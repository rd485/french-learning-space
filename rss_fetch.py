"""RSS 抓取与全文归一化模块（v2：更快、更稳定、结果一致）。

设计原则（第一性原理 + 实测）：
- 沙箱 / 数据中心 IP 直连各大法语新闻站基本被反爬拦截（403 / 超时 / 连接重置），
  而第三方代理（corsproxy / allorigins / codetabs）在此环境也大多超时或 401。
- 实测唯一稳定可用的聚合通道是 rss2json（其服务器代抓，绕开本机 IP 限制）。
  但它偶发 500 / 限流，且 `content` 字段有时是全文、有时是摘要 —— 因此：
    1) 源清单只保留「经 rss2json 实测可服务」的权威源，杜绝「有的抓到有的抓不到」；
    2) 统一 direct + rss2json 两条通道，都用同一套解析器解析 content:encoded，
       保证「是否全文」的判定口径一致；同一源优先取「全文条目更多」的那一路；
    3) 全程并行 + 失败重试退避，首屏聚合控制在 ~10s 级，且结果可缓存复用。

对外暴露：
- RSS_SOURCES：经筛选的权威法语源（含全文型 / 摘要型）。
- fetch_all_news(): 聚合所有源，返回归一化条目列表 {items, sources_status}。
- 归一化条目字段：
  title, link, pubDate(ISO), thumbnail, summary(纯文本),
  full_html(若源带全文), source(源名), is_full(bool)
"""

import json
import re
import html
import time
import concurrent.futures
import urllib.request
import urllib.parse
from datetime import datetime, timezone

# 抓取需要直连目标站 / rss2json，绕过可能存在的出站代理（避免挂起或拦截）。
# 仅对抓取禁用代理，不影响服务器其它网络调用（如大模型 API）。
_NO_PROXY_OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))

RSS2JSON_API = "https://api.rss2json.com/v1/api.json"

# 经实测 rss2json 可稳定服务的权威法语源（沙箱 / 本地均走同一通道，结果一致）。
# mode:
#   "full"     —— 源 RSS 通常自带全文（content:encoded），优先就地渲染，无需抓文章页
#   "summary"  —— 仅摘要，详情页提供「新标签页打开原文」（用户浏览器直连，必能加载）
RSS_SOURCES = [
    # ---- 全文型（RSS 自带完整正文，站内可直接渲染）----
    {"name": "The Conversation FR", "url": "https://theconversation.com/fr/articles.atom", "mode": "full"},
    {"name": "L'Express", "url": "https://www.lexpress.fr/rss/actualite.xml", "mode": "full"},
    # ---- 摘要型（仅 RSS 摘要；站内展示摘要 + 新标签页打开原文）----
    {"name": "Slate.fr", "url": "https://www.slate.fr/rss.xml", "mode": "summary"},
    {"name": "La Croix", "url": "https://www.la-croix.com/rss", "mode": "summary"},
    {"name": "Numerama", "url": "https://www.numerama.com/feed/", "mode": "summary"},
    {"name": "France24", "url": "https://www.france24.com/fr/rss", "mode": "summary"},
    {"name": "RFI", "url": "https://www.rfi.fr/fr/rss", "mode": "summary"},
]

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")
HEADERS = {"User-Agent": UA, "Accept-Language": "fr-FR,fr;q=0.9"}


def _get(url, timeout=12):
    req = urllib.request.Request(url, headers=HEADERS)
    with _NO_PROXY_OPENER.open(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def _clean_text(s):
    if not s:
        return ""
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _pick_thumb(item_xml):
    """从 RSS/Atom 项里挑一张图。"""
    m = re.search(r'<media:content[^>]+url="([^"]+)"', item_xml, re.I)
    if m:
        return m.group(1)
    m = re.search(r'<media:thumbnail[^>]+url="([^"]+)"', item_xml, re.I)
    if m:
        return m.group(1)
    m = re.search(r'<enclosure[^>]+url="([^"]+)"[^>]+type="image', item_xml, re.I)
    if m:
        return m.group(1)
    m = re.search(r'<img[^>]+src="([^"]+)"', item_xml, re.I)
    if m:
        return m.group(1)
    return ""


def _parse_iso(datestr):
    if not datestr:
        return ""
    try:
        try:
            dt = datetime.strptime(datestr, "%a, %d %b %Y %H:%M:%S %z")
        except ValueError:
            dt = datetime.fromisoformat(datestr.replace("Z", "+00:00"))
        return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    except Exception:
        return datestr


def _extract_blocks(raw_html):
    """从全文 HTML 中抽取段落纯文本（安全：只取块级文本，丢弃脚本/样式/标签）。"""
    if not raw_html:
        return []
    h = re.sub(r"<script[\s\S]*?</script>", " ", raw_html, flags=re.I)
    h = re.sub(r"<style[\s\S]*?</style>", " ", h, flags=re.I)
    blocks = re.findall(r"<(p|h1|h2|h3|li|blockquote)[\s>][\s\S]*?</\1>", h, re.I)
    out = []
    for b in blocks:
        txt = _clean_text(b)
        if len(txt) > 25:
            out.append(txt)
    if len(out) <= 1:
        txt = _clean_text(raw_html)
        if len(txt) > 200:
            out = [t.strip() for t in re.split(r"\n{2,}|\.\s+", txt) if len(t.strip()) > 40]
    return out


def _looks_full(content_html):
    """判断内容是否像全文（两条通道共用同一口径 → 判定一致）。"""
    if not content_html:
        return False
    blocks = _extract_blocks(content_html)
    total = sum(len(b) for b in blocks)
    return total > 700 and len(blocks) >= 2


def _parse_raw(xml_text, source_name, mode):
    """解析原始 RSS 2.0 或 Atom，返回归一化条目（可能为空）。"""
    items = re.findall(r"<item[\s>]([\s\S]*?)</item>", xml_text, re.I)
    entries = re.findall(r"<entry[\s>]([\s\S]*?)</entry>", xml_text, re.I)
    nodes = items if items else entries
    out = []
    for node in nodes[:30]:
        title = re.search(r"<title[^>]*>([\s\S]*?)</title>", node, re.I)
        link = re.search(r"<link[^>]*href=\"([^\"]+)\"", node, re.I)
        if not link:
            link = re.search(r"<link[^>]*>([^<]+)</link>", node, re.I)
        desc = re.search(r"<description[^>]*>([\s\S]*?)</description>", node, re.I)
        enc = re.search(r"<content:encoded[^>]*>([\s\S]*?)</content:encoded>", node, re.I)
        content = re.search(r"<content[^>]*>([\s\S]*?)</content>", node, re.I)
        pub = re.search(r"<pubDate[^>]*>([\s\S]*?)</pubDate>", node, re.I) or \
              re.search(r"<updated[^>]*>([\s\S]*?)</updated>", node, re.I)
        full_html = enc.group(1) if enc else (content.group(1) if content else "")
        summary_html = desc.group(1) if desc else ""
        is_full = (mode == "full") and _looks_full(full_html)
        out.append({
            "title": _clean_text(title.group(1)) if title else "(无标题)",
            "link": link.group(1).strip() if link else "",
            "pubDate": _parse_iso(pub.group(1).strip() if pub else ""),
            "thumbnail": _pick_thumb(node),
            "summary": _clean_text(summary_html) or _clean_text(full_html)[:300],
            "full_html": full_html if is_full else "",
            "source": source_name,
            "is_full": is_full,
        })
    return out


def _parse_rss2json(data, source_name, mode):
    out = []
    for it in data.get("items", [])[:30]:
        content = it.get("content") or ""
        summary = it.get("description") or ""
        is_full = (mode == "full") and _looks_full(content)
        out.append({
            "title": it.get("title", "(无标题)"),
            "link": it.get("link", ""),
            "pubDate": it.get("pubDate", ""),
            "thumbnail": it.get("thumbnail", "") or (it.get("enclosure", {}).get("link", "") if isinstance(it.get("enclosure"), dict) else ""),
            "summary": _clean_text(summary) or _clean_text(content)[:300],
            "full_html": content if is_full else "",
            "source": source_name,
            "is_full": is_full,
        })
    return out


def _fetch_direct(src):
    """通道一：直连原始 RSS（用户本机真实 IP 通常 200 且带全文；沙箱多被拦截，快速失败）。"""
    name, url, mode = src["name"], src["url"], src["mode"]
    try:
        xml = _get(url, timeout=6)
        items = _parse_raw(xml, name, mode)
        if items:
            return items
    except Exception:
        pass
    return []


def _fetch_rss2json(src, attempts=3):
    """通道二：经 rss2json 代抓（其服务器 IP，绕开本机 IP 限制）。
    失败重试 + 退避，克服偶发 500 / 限流，保证稳定性。"""
    name, url, mode = src["name"], src["url"], src["mode"]
    last_err = None
    for i in range(attempts):
        try:
            api = RSS2JSON_API + "?rss_url=" + urllib.parse.quote(url)
            data = json.loads(_get(api, timeout=12))
            if data.get("status") == "ok":
                items = _parse_rss2json(data, name, mode)
                if items:
                    return items
        except Exception as e:
            last_err = e
        if i < attempts - 1:
            time.sleep(1.2 * (i + 1))   # 退避：1.2s / 2.4s
    return []


def _fetch_source_unified(src):
    """统一抓取：direct 与 rss2json 并行，择优（优先全文条目更多的一路）。"""
    name, mode = src["name"], src["mode"]
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:
        fd = ex.submit(_fetch_direct, src)
        fr = ex.submit(_fetch_rss2json, src)
        d, r = fd.result(), fr.result()
    d_full = sum(1 for x in d if x["is_full"])
    r_full = sum(1 for x in r if x["is_full"])
    if d_full >= r_full and d:
        return d, ("direct" if d_full else "direct-sum")
    if r:
        return r, ("rss2json" if r_full else "rss2json-sum")
    return d, "empty"


def fetch_all_news():
    """聚合所有源（并行抓取，整体耗时为最慢单源而非累加）。
    每个源内部 direct + rss2json 并行，择优合并；源间也并行（max_workers=12）。
    返回 {items, sources_status}。"""
    items = []
    status = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
        results = list(ex.map(_fetch_source_unified, RSS_SOURCES))
    for src, (rows, via) in zip(RSS_SOURCES, results):
        status[src["name"]] = {"count": len(rows), "via": via}
        items.extend(rows)
    # 时间降序
    items.sort(key=lambda x: x.get("pubDate", ""), reverse=True)
    # 去重（同 link）
    seen, uniq = set(), []
    for it in items:
        k = it.get("link") or it.get("title")
        if k and k not in seen:
            seen.add(k)
            uniq.append(it)
    return {"items": uniq, "sources_status": status}


if __name__ == "__main__":
    t0 = time.time()
    res = fetch_all_news()
    print("耗时 %.1fs  总条目:%d  全文:%d" % (
        time.time() - t0, len(res["items"]), sum(1 for i in res["items"] if i["is_full"])))
    for s, st in res["sources_status"].items():
        print(f"  {s:22s} {st}")
    for it in res["items"][:3]:
        print(f"\n[{it['source']}] {it['title'][:50]}")
        print(f"  全文={it['is_full']} 摘要长={len(it['summary'])} link={it['link'][:60]}")
