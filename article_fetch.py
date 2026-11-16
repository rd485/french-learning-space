#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""文章全文抓取（被 server.py 与 proxy.py 共用，零依赖，仅用标准库）。

优先级（对应前端需求）：
  1) Jina Reader  API：https://r.jina.ai/<url>  —— 返回已剥离导航/广告的 Markdown 纯文本。
  2) 本地直连（真实浏览器 User-Agent）—— 绕过前端 CORS，由本机/服务端发起请求。
  3) 公共读取代理兜底：corsproxy.io / allorigins.win。

任一路成功即返回 {ok, html?, text?, via, error?}。
前端优先用 html（DOMParser 提取正文），其次用 text（纯文本分段）。
"""
import re
import urllib.request
import urllib.parse

# 文章抓取需要直连目标站 / Jina / 公共代理，绕过可能存在的出站代理（避免挂起或拦截）。
# 仅对抓取禁用代理，不影响服务器其它网络调用（如大模型 API）。
_NO_PROXY_OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))

# 真实浏览器请求头：显著降低被反爬直接 403 的概率
BROWSER_HEADERS = {
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
}


def _html_looks_like_article(html):
    """轻量校验：返回的是否真像一篇带正文的文章页，避免把 403/错误页/空壳页当成成功。"""
    if not html or len(html) < 500:
        return False
    stripped = re.sub(r"<script[\s\S]*?</script>", "", html, flags=re.I)
    stripped = re.sub(r"<style[\s\S]*?</style>", "", stripped, flags=re.I)
    if "<article" in stripped.lower():
        return True
    if len(re.findall(r"<p[\s>]", stripped, re.I)) >= 3:
        return True
    return False


def fetch_article(url, timeout=15):
    """抓取新闻原文，多路回退链，任一路成功即返回。

    通道顺序（按「在受限环境下最有可能成功」实测调整）：
      1) direct     —— 本机/服务端真实 UA 直连（用户本机通常 200；数据中心 IP 会被 403）
      2) corsproxy  —— 公共 CORS 代理（实测在沙箱可返回完整 HTML，但偶发 401/520）
      3) allorigins —— 公共代理兜底（偶发 522）
      4) jina       —— Jina Reader（返回干净 Markdown，但部分环境连不通，放最后避免空耗）
    全部失败时返回 ok=False，由前端引导用户「在新标签页打开原文」（用户浏览器 IP 不被拦截）。
    """
    if not url or not url.startswith("http"):
        return {"ok": False, "error": "invalid url"}
    strategies = [
        ("direct", url, "html", 7),
        ("corsproxy", "https://corsproxy.io/?url=" + urllib.parse.quote(url, safe=""), "html", 6),
        ("allorigins", "https://api.allorigins.win/raw?url=" + urllib.parse.quote(url, safe=""), "html", 6),
        ("jina", "https://r.jina.ai/" + url, "text", 5),
    ]
    last_err = None
    for name, target, kind, to in strategies:
        try:
            req = urllib.request.Request(target, headers=BROWSER_HEADERS)
            with _NO_PROXY_OPENER.open(req, timeout=to) as r:
                raw = r.read().decode("utf-8", "replace")
            if kind == "html":
                if _html_looks_like_article(raw):
                    return {"ok": True, "html": raw, "via": name}
                else:
                    # 返回了内容但不是文章页（如 403 拦截页 / 空壳页）→ 记录并换下一通道
                    last_err = Exception(name + " 返回内容不像文章页（可能反爬拦截）")
            else:  # text（Jina 返回 Markdown 纯文本）
                if len(raw) > 200:
                    return {"ok": True, "text": raw, "via": name}
                else:
                    last_err = Exception(name + " 返回内容过短")
        except Exception as e:
            last_err = e
    return {"ok": False, "error": "全部抓取通道均失败：" + (str(last_err) if last_err else "empty response")}
