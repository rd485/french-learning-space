#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
法语学习平台 · 本地服务 + 动词变位代理
- 托管当前目录的静态文件 (index.html / styles.css / app.js)
- 提供 /api/conjugate?verb=XXX 接口：
    服务端实时抓取 leconjugueur.lefigaro.fr 并解析六人称 x 各时态变位
    绝不依靠本地记忆生成，抓不到或解析失败一律返回 found:false
"""
import re
import os
import html
import json
import urllib.request
import urllib.parse
import concurrent.futures
import socket
import time
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

import rss_fetch  # RSS 聚合与全文归一化（权威法语源）

# 端口：本地默认 8000；云平台（Render / Railway 等）会通过 PORT 环境变量动态下发，
# 写死端口会导致部署后无法监听，平台健康检查直接判失败。
PORT = int(os.environ.get("PORT", "8000") or 8000)
# 监听地址：本地留空 → 走下面的双栈 server（同时吃 IPv4/IPv6，localhost 不会解析失败）；
# 云端需要显式 0.0.0.0，平台的反向代理才连得进来。
# 判定：只要注入了 PORT 环境变量（Render / 发布沙箱都会这么做），就默认绑 0.0.0.0，
#       这样部署时不必额外配 HOST 也不会出现「部署成功但访问 502」。
HOST = (os.environ.get("HOST") or "").strip()
if not HOST and os.environ.get("PORT"):
    HOST = "0.0.0.0"
# 公网模式开关：置 1 时关掉「改模型」这类只该在本地用的写接口
PUBLIC_MODE = (os.environ.get("PUBLIC_MODE") or "").strip() in ("1", "true", "yes")

# 新闻聚合结果缓存：后台线程异步刷新，前端请求永远秒回（空时返回 loading 标志）。
_NEWS_CACHE = {"ts": 0.0, "data": None, "ttl": 300.0, "loading": True, "refreshing": False}


def _do_refresh_news():
    """执行一次抓取并写入缓存（RSS 抓取已内部绕过出站代理）。"""
    try:
        data = rss_fetch.fetch_all_news()
    except Exception as e:
        data = {"items": [], "sources_status": {}, "error": str(e)[:160]}
    _NEWS_CACHE["data"] = data
    _NEWS_CACHE["ts"] = time.time()
    _NEWS_CACHE["loading"] = False
    _NEWS_CACHE["refreshing"] = False


def _refresh_news_async():
    """非阻塞触发一次刷新（避免与正在进行的刷新重叠）。"""
    if _NEWS_CACHE["refreshing"]:
        return
    _NEWS_CACHE["refreshing"] = True
    t = threading.Thread(target=_do_refresh_news, daemon=True)
    t.start()


def _news_refresh_loop():
    """后台常驻：立即抓首批，之后每 ttl 秒刷新一次。"""
    _do_refresh_news()
    while True:
        time.sleep(_NEWS_CACHE["ttl"])
        _refresh_news_async()
BASE = "https://leconjugueur.lefigaro.fr/conjugaison/verbe/"

PERSON_LABELS = ["je", "tu", "il / elle", "nous", "vous", "ils / elles"]
PRON_MAP = {"je": 0, "j'": 0, "tu": 1, "il": 2, "elle": 2,
            "nous": 3, "vous": 4, "ils": 5, "elles": 5}
IMPER_ORDER = [1, 3, 4]  # 命令式无代词时顺序: tu, nous, vous
PERSONAL_MODES = {"Indicatif", "Subjonctif", "Conditionnel", "Impératif"}
MODE_ZH = {
    "Indicatif": "直陈式", "Subjonctif": "虚拟式", "Conditionnel": "条件式",
    "Impératif": "命令式", "Participe": "分词", "Infinitif": "不定式",
    "Gérondif": "副动词",
}
# 时态（法语小写词 → 中文）用于逆向反查的展示
TENSE_ZH = {
    "présent": "现在时", "imparfait": "未完成过去时", "futur": "将来时",
    "passé composé": "复合过去时", "passé simple": "简单过去时",
    "plus-que-parfait": "愈过去时", "passé antérieur": "先过去时",
    "futur antérieur": "先将来时",
}
# 法语人称描述 → 人称代词
PERSON_FR = {
    "première personne du singulier": "je",
    "deuxième personne du singulier": "tu",
    "troisième personne du singulier": "il / elle",
    "première personne du pluriel": "nous",
    "deuxième personne du pluriel": "vous",
    "troisième personne du pluriel": "ils / elles",
}
NOT_FOUND_MSG = "这不是一个法语动词（或拼写有误，未找到对应变位）"

# 简单内存缓存，避免重复抓取
_cache = {}


def _fetch_html(verb, timeout=10):
    url = BASE + urllib.parse.quote(verb, safe="") + ".html"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def _parse(html_text):
    m = re.search(r"<title>[^<]*verbe ([^<]+)</title>", html_text, re.I)
    canonical = html.unescape(m.group(1).strip()) if m else None

    parts = re.split(r'<h2 class="modeBloc"', html_text)
    modes, other = [], []
    for p in parts[1:]:
        mm = re.search(r'id="[a-z]+"[^>]*>(?:<a[^>]*>)?([^<]+?)(?:</a>)?</h2>', p)
        if not mm:
            continue
        mode = html.unescape(mm.group(1).strip())
        blocks = re.findall(
            r'<div class="conjugBloc"><div id="temps\d+" class="tempsBloc">([^<]*)</div>(.*?)</div>',
            p, re.S)
        if not blocks:
            continue

        if mode in PERSONAL_MODES:
            tenses = []
            for tname, body in blocks:
                tname = html.unescape(tname.strip())
                segs = [html.unescape(re.sub(r"<[^>]+>", "", s)).strip()
                        for s in re.split(r"<br\s*/?>", body)]
                segs = [s for s in segs if s]
                forms = ["—"] * 6
                if mode == "Impératif":
                    for k, f in enumerate(segs):
                        if k < len(IMPER_ORDER):
                            forms[IMPER_ORDER[k]] = f
                else:
                    for s in segs:
                        tok = s.split(" ", 1)[0].lower()
                        if tok in PRON_MAP:
                            forms[PRON_MAP[tok]] = s
                        elif tok.startswith("j'"):
                            forms[0] = s
                tenses.append({"name": tname, "forms": forms})
            modes.append({"mode": mode, "tenses": tenses})
        elif mode in {"Participe", "Infinitif", "Gérondif"}:
            flat = []
            for _, body in blocks:
                for s in re.split(r"<br\s*/?>", body):
                    t = html.unescape(re.sub(r"<[^>]+>", "", s)).strip()
                    if t:
                        flat.append(t)
            other.append({"mode": mode, "forms": flat})

    return canonical, modes, other


def _parse_inverse(html_text):
    """解析 leconjugueur 的「Conjugaison inversée」逆向变位表。
    返回 [{infinitive, tense_label, person}, ...] 或 None。"""
    if "Conjugaison invers" not in html_text:
        return None
    rows = re.findall(
        r'<tr>\s*<td[^>]*><a href="/conjugaison/verbe/([^"]+)\.html">([^<]+)</a></td>'
        r'\s*<td[^>]*>(.*?)</td>\s*<td[^>]*>(.*?)</td>\s*<td[^>]*>(.*?)</td>',
        html_text, re.S)
    out = []
    for _href, infin_text, form_cell, tense_cell, person_cell in rows:
        infinitive = html.unescape(infin_text.strip())
        mode_tense = html.unescape(re.sub(r"<[^>]+>", "", tense_cell)).strip()
        parts = mode_tense.split(" ", 1)
        mode = parts[0]
        tense = parts[1] if len(parts) > 1 else ""
        tense_label = MODE_ZH.get(mode, mode)
        if tense:
            tense_label += "·" + TENSE_ZH.get(tense, tense)
        person_raw = html.unescape(re.sub(r"<[^>]+>", "", person_cell)).strip().lower()
        person = PERSON_FR.get(person_raw, person_raw)
        out.append({"infinitive": infinitive, "tense_label": tense_label, "person": person})
    return out if out else None


def conjugate(verb, timeout=10):
    # 输入校验：仅允许法语字母、重音、省音撇号、连字符
    if not re.fullmatch(r"[A-Za-zàâäéèêëîïôöûüùçæœ'\-]+", verb or ""):
        return {"found": False, "message": NOT_FOUND_MSG}

    key = verb.lower()
    if key in _cache:
        return _cache[key]

    try:
        raw = _fetch_html(key, timeout)
    except Exception:
        res = {"found": False, "message": NOT_FOUND_MSG}
        return res

    # 情况 1：页面含常规 conjugBloc → 输入是动词原形（或 leconjugueur 可识别的原形）
    if len(re.findall(r'<div class="conjugBloc">', raw)) > 0:
        canonical, modes, other = _parse(raw)
        res = {
            "found": True, "is_form": False, "verb": key,
            "canonical": canonical, "modes": modes, "other": other,
        }
        _cache[key] = res
        return res

    # 情况 2：输入不是原形 → 尝试「逆向变位」反查（即输入的是某个变位形式）
    inv = _parse_inverse(raw)
    if inv:
        # 选定代表行：优先「je / 第一人称单数」，否则取第一条
        pick = next((r for r in inv if r["person"] == "je"), inv[0])
        try:
            raw_inf = _fetch_html(pick["infinitive"], timeout)
        except Exception:
            raw_inf = None
        if raw_inf and len(re.findall(r'<div class="conjugBloc">', raw_inf)) > 0:
            canonical, modes, other = _parse(raw_inf)
            res = {
                "found": True, "is_form": True, "verb": key,
                "canonical": pick["infinitive"],
                "infinitive": pick["infinitive"],
                "detected_tense": pick["tense_label"],
                "detected_person": pick["person"],
                "modes": modes, "other": other,
            }
            _cache[key] = res
            return res
        # 原型页异常（极少），仍返回反查到的识别信息
        res = {
            "found": True, "is_form": True, "verb": key,
            "canonical": pick["infinitive"],
            "infinitive": pick["infinitive"],
            "detected_tense": pick["tense_label"],
            "detected_person": pick["person"],
            "modes": [], "other": [],
        }
        _cache[key] = res
        return res

    # 情况 3：既不是原形也不是任何已知变位形式 → 非动词 / 拼写错误
    res = {"found": False, "message": NOT_FOUND_MSG}
    _cache[key] = res
    return res


# ===================== 词典与翻译（AI 大模型） =====================
# 该模块把「查词 / 翻译」请求转发给一个 OpenAI 兼容的 Chat Completions 接口。
# 通过环境变量配置，无需改动代码即可对接 OpenAI / DeepSeek / Moonshot / 通义千问 等：
#   LLM_API_KEY   必填：你的 API Key
#   LLM_BASE_URL  选填：兼容接口地址，默认 https://api.openai.com/v1
#   LLM_MODEL     选填：模型名，默认 gpt-4o-mini
WORD_SYSTEM = """你是一位严谨的法语词典专家。先判断该词是原形还是变位（如 irai 是 aller 的将来时）。
1. 若是变位，先标明原形和时态，再输出原形词典信息。
2. 给出音标与词性（动词/名词/形容词等）。
3. 每个词性给 1-2 个纯正法语例句，用列表项「法语例句 — 中文翻译」呈现；**不要**加「法语/中文」表头或表格。
4. 给出 3-5 个固定搭配。
5. 不确定时直接说明，绝对不要捏造。
用 Markdown 排版，小标题用 ##，例句用 - 列表。"""

SENTENCE_SYSTEM = """你是一位严谨的法语翻译专家与语法解析师。面对一句法语：
1. 先给整句标准中文翻译。
2. 再解析句中关键变位动词（原形、时态、人称），不确定请说明。
3. 不确定时明确说明，不要臆造语法规则。
用 Markdown 排版，小标题 ## 整句翻译 与 ## 变位解析。"""

CORRECTION_INSTRUCTION = (
    "【拼写检查】仅当用户输入确实不存在或明显错拼（如 venir 拼成 veenir）时，"
    "才在第一行输出：【自动纠错】已为您找到：正确词。"
    "若输入本身是真实法语词（原形或合理变位），即使你不确其含义，也绝对不要输出纠错行——宁可跳过，也不要误报。"
)


# 隐藏本地密钥文件：位于用户主目录（项目之外），不会被提交到仓库。
# 由 set_llm_key.sh 写入，格式为 key=value 的纯文本（支持 # 注释）。
LLM_KEYFILE = os.path.join(os.path.expanduser("~"), ".french-llm-key")


def load_llm_config():
    """加载大模型配置：环境变量优先，其次读取隐藏本地文件 ~/.french-llm-key。

    文件不存在或无对应项时，使用默认值。Key 仅保存在本机，绝不进入代码或仓库。
    """
    env = {
        "LLM_API_KEY": (os.environ.get("LLM_API_KEY") or "").strip(),
        "LLM_BASE_URL": (os.environ.get("LLM_BASE_URL") or "").strip(),
        "LLM_MODEL": (os.environ.get("LLM_MODEL") or "").strip(),
    }
    cfg = {
        "LLM_API_KEY": env["LLM_API_KEY"],
        "LLM_BASE_URL": env["LLM_BASE_URL"] or "https://api.openai.com/v1",
        "LLM_MODEL": env["LLM_MODEL"] or "gpt-4o-mini",
    }
    if os.path.isfile(LLM_KEYFILE):
        try:
            kv = {}
            with open(LLM_KEYFILE, "r", encoding="utf-8-sig") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    kv[k.strip()] = v.strip().strip('"').strip("'")
            if not cfg["LLM_API_KEY"] and kv.get("LLM_API_KEY"):
                cfg["LLM_API_KEY"] = kv["LLM_API_KEY"]
            if not env["LLM_BASE_URL"] and kv.get("LLM_BASE_URL"):
                cfg["LLM_BASE_URL"] = kv["LLM_BASE_URL"].rstrip("/") or cfg["LLM_BASE_URL"]
            if not env["LLM_MODEL"] and kv.get("LLM_MODEL"):
                cfg["LLM_MODEL"] = kv["LLM_MODEL"] or cfg["LLM_MODEL"]
        except Exception:
            pass
    return cfg


def set_llm_model(model):
    """就地更新隐藏密钥文件中的 LLM_MODEL（替换该行，保留其余配置与注释/BOM）。"""
    model = (model or "").strip()
    if not model or not os.path.isfile(LLM_KEYFILE):
        return False
    try:
        with open(LLM_KEYFILE, "rb") as f:
            data = f.read()
        has_bom = data[:3] == b"\xef\xbb\xbf"
        text = data.decode("utf-8-sig")
        lines = text.split("\n")
        found = False
        for i, line in enumerate(lines):
            if re.match(r"^\s*LLM_MODEL\s*=", line):
                lines[i] = "LLM_MODEL=" + model
                found = True
                break
        if not found:
            if lines and lines[-1].strip() == "":
                lines[-1] = "LLM_MODEL=" + model
            else:
                lines.append("LLM_MODEL=" + model)
        out = "\n".join(lines)
        with open(LLM_KEYFILE, "w", encoding="utf-8") as f:
            if has_bom:
                f.write("\ufeff")
            f.write(out)
        return True
    except Exception:
        return False


def detect_mode(q):
    """单词模式：不含任何中间空格；句子模式：含空格或句末标点。"""
    q = q.strip()
    if not q:
        return "word"
    if any(c.isspace() for c in q):
        return "sentence"
    if q[-1] in ".!?…":
        return "sentence"
    return "word"


def build_user_prompt(q, mode):
    topic = f"请查询这个法语词：{q}" if mode == "word" else f"请翻译并解析这句法语：{q}"
    return CORRECTION_INSTRUCTION + "\n\n" + topic


# 动词快速判定：避免对名词/形容词等做无谓的联网往返（占词典查询大多数）
_VERB_SUFFIXES = ("er", "ir", "re", "oir", "ître")
_KNOWN_IRREG = {
    "être", "avoir", "aller", "faire", "venir", "pouvoir", "vouloir", "devoir",
    "savoir", "voir", "prendre", "mettre", "dire", "écrire", "lire", "ouvrir",
    "offrir", "comprendre", "suivre", "courir", "mourir", "naître", "connaître",
    "croire", "boire", "rire", "plaire", "taire", "paraître", "vivre", "falloir",
    "pleuvoir", "asseoir", "tenir", "devenir", "retenir", "obtenir", "contenir",
    "soutenir", "apprendre", "atteindre", "peindre", "craindre", "joindre",
    "éteindre", "feindre", "vaincre", "conclure", "inclure", "exclure", "résoudre",
    "absoudre", "moudre", "cuire", "luire", "nuire", "suffire", "confire",
    "détruire", "instruire", "réduire", "traduire", "produire", "introduire",
    "conduire", "construire", "décrire",
}


def _maybe_verb(w):
    w = (w or "").lower()
    if not w:
        return False
    if w in _KNOWN_IRREG:
        return True
    return any(w.endswith(s) and len(w) > 3 for s in _VERB_SUFFIXES)


def word_grounding(q):
    """为「看似动词」的单词提供权威变位数据，作为大模型事实锚点，抑制幻觉。
    名词/形容词等无需变位锚点，直接跳过，省去一次联网往返以加速。"""
    if not _maybe_verb(q):
        return ""
    try:
        res = conjugate(q, timeout=5)
    except Exception:
        return ""
    if not res.get("found") or res.get("is_form"):
        return ""
    lines = []
    for m in res.get("modes", []):
        if m["mode"] == "Indicatif":
            for t in m["tenses"]:
                if t["name"].lower().startswith("présent"):
                    forms = " / ".join(t["forms"])
                    lines.append(f"{m['mode']}·{t['name']}: {forms}")
    if lines:
        return ("参考变位数据（请以其为准，不要改写或臆造）：\n" + "\n".join(lines))
    return ""


def call_llm(system, user, mode=None):
    """调用 OpenAI 兼容接口；未配置 LLM_API_KEY 时返回 None。
    对 429 / 5xx 等瞬时拥塞做轻量退避重试，避免长时间卡顿。"""
    import time
    cfg = load_llm_config()
    key = cfg["LLM_API_KEY"]
    if not key:
        return None
    base = cfg["LLM_BASE_URL"].rstrip("/")
    model = cfg["LLM_MODEL"]
    # 限制输出长度：既控成本，也显著缩短生成时间（单词略长、句子略短）
    max_tokens = 900 if mode == "word" else 600
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.3,
        "max_tokens": max_tokens,
    }
    last_err = None
    # 退避节奏：立即重试、0.8s、2s（约 3 次尝试，尽快失败而非长时间阻塞）
    for attempt, delay in enumerate([0, 0.8, 2.0]):
        if attempt > 0:
            time.sleep(delay)
        req = urllib.request.Request(
            base + "/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = json.load(r)
            return data["choices"][0]["message"]["content"]
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code == 429 or e.code >= 500:
                # 尊重服务端 Retry-After（秒），否则用退避表
                ra = e.headers.get("Retry-After")
                if ra and ra.isdigit():
                    time.sleep(min(int(ra), 8))
                continue   # 瞬时限流/拥塞，重试
            raise          # 401/403/404 等非瞬时错误，直接抛出
        except Exception as e:
            last_err = e
            continue
    # 重试后仍失败：把可读原因抛给上层（前端据此提示“稍后再试/换模型”）
    raise RuntimeError(f"LLM 调用在重试后仍失败：{last_err}")


def split_correction(text):
    """抽取首行【自动纠错】提示，并从正文移除。"""
    lines = text.split("\n")
    for i, line in enumerate(lines):
        if re.search(r"【自动纠错】", line):
            corr = line.strip().lstrip("#").strip()
            body = "\n".join(lines[:i] + lines[i + 1:]).strip()
            return corr, body
    return None, text.strip()


def _extract_correction(head_line, q):
    """从首行提取【自动纠错】信息；若纠错目标词与用户输入一致（误报）则返回 None。"""
    if not re.search(r"【自动纠错】", head_line):
        return None
    corr = head_line.strip().lstrip("#").strip()
    m = re.search(r"已为您找到[：:]\s*(.+)", corr)
    if m and m.group(1).strip().strip("。. ").lower() == (q or "").lower():
        return None
    return corr


def strip_example_header(text):
    """剔除模型偶发输出的「法语 — 中文」表头行（含 Markdown 表格表头），
    避免例句区上方出现无意义的首行。"""
    lines = text.split("\n")
    out, i, n = [], 0, len(lines)
    while i < n:
        s = lines[i].strip()
        if re.match(r"^[|｜\s]*法语[\s\-—–:|｜]*中文[\s|｜]*$", s, re.I):
            i += 1
            if i < n and re.match(r"^[|｜\s:*\-]+$", lines[i].strip()):
                i += 1  # 跳过紧跟的 Markdown 分隔行
            continue
        out.append(lines[i])
        i += 1
    return "\n".join(out).strip()


def clean_dict_body(text):
    """词典正文清洗：剔除「法语-中文」表头 + 折叠模型偶发的「- - 」重复列表符。"""
    text = strip_example_header(text)
    lines = text.split("\n")
    out = []
    for ln in lines:
        m = re.match(r"^(\s*)(?:[-•·*]\s*){2,}(.*)$", ln)
        if m:
            out.append(m.group(1) + "- " + m.group(2))
        else:
            out.append(ln)
    return "\n".join(out).strip()


# 全文抓取逻辑抽到 article_fetch（与 Flask 代理 proxy.py 共用），保持单一实现
from article_fetch import fetch_article


class Handler(SimpleHTTPRequestHandler):
    def _send_json(self, obj, code=200):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/dict":
            length = int(self.headers.get("Content-Length", 0) or 0)
            raw = self.rfile.read(length) if length else b""
            try:
                data = json.loads(raw.decode("utf-8")) if raw else {}
            except Exception:
                data = {}
            q = (data.get("q") or "").strip()
            mode = (data.get("mode") or "").strip()
            if not mode:
                mode = detect_mode(q)
            if not q:
                self._send_json({"ok": False, "reason": "empty"}, 400)
                return
            system = WORD_SYSTEM if mode == "word" else SENTENCE_SYSTEM
            user = build_user_prompt(q, mode)
            if mode == "word":
                # 变位抓取与「调用大模型」解耦：并行获取，最多等 4s；超时则直接发起大模型调用，
                # 既保留动词的事实锚点（命中缓存/快速网络时零额外耗时），又不为慢网络买单。
                g = ""
                if _maybe_verb(q):
                    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as _ex:
                        _fut = _ex.submit(word_grounding, q)
                        try:
                            g = _fut.result(timeout=4)
                        except Exception:
                            g = ""
                if g:
                    user = user + "\n\n" + g
            try:
                content = call_llm(system, user, mode)
            except Exception as e:
                self._send_json({"ok": False, "reason": "llm_error",
                                 "message": str(e)[:300]})
                return
            if content is None:
                self._send_json({"ok": False, "reason": "no_key", "mode": mode})
                return
            correction, body = split_correction(content)
            body = clean_dict_body(body)
            # 兜底：若纠错目标词与用户输入完全一致（如 venir -> venir），判定为误报，隐藏横幅
            if correction:
                m = re.search(r"已为您找到[：:]\s*(.+)", correction)
                if m:
                    target = m.group(1).strip().strip("。. ").lower()
                    if target == q.lower():
                        correction = None
            self._send_json({"ok": True, "mode": mode, "q": q,
                             "correction": correction, "content": body})
            return
        if parsed.path == "/api/dict/stream":
            # 流式输出：边生成边下发，显著降低「等待感」；原 /api/dict(JSON) 保留给即时查词抽屉。
            length = int(self.headers.get("Content-Length", 0) or 0)
            raw = self.rfile.read(length) if length else b""
            try:
                data = json.loads(raw.decode("utf-8")) if raw else {}
            except Exception:
                data = {}
            q = (data.get("q") or "").strip()
            mode = (data.get("mode") or "").strip()
            if not mode:
                mode = detect_mode(q)
            if not q:
                self._send_json({"ok": False, "reason": "empty"}, 400)
                return
            system = WORD_SYSTEM if mode == "word" else SENTENCE_SYSTEM
            user = build_user_prompt(q, mode)
            if mode == "word" and _maybe_verb(q):
                with concurrent.futures.ThreadPoolExecutor(max_workers=1) as _ex:
                    try:
                        g = _ex.submit(word_grounding, q).result(timeout=4)
                    except Exception:
                        g = ""
                if g:
                    user = user + "\n\n" + g
            cfg = load_llm_config()
            key = cfg["LLM_API_KEY"]
            base = cfg["LLM_BASE_URL"].rstrip("/")
            model = cfg["LLM_MODEL"]
            max_tokens = 900 if mode == "word" else 600
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                "temperature": 0.3,
                "max_tokens": max_tokens,
                "stream": True,
            }
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("X-Accel-Buffering", "no")
            self.end_headers()

            def _sse(ev):
                try:
                    self.wfile.write(("data: " + json.dumps(ev, ensure_ascii=False) + "\n\n").encode("utf-8"))
                    self.wfile.flush()
                except Exception:
                    pass

            if not key:
                _sse({"type": "error", "message": "未配置 API Key，请先运行 set_llm_key 脚本填写密钥。"})
                return

            first_buf, meta_sent, body_buf = "", False, ""
            req = urllib.request.Request(
                base + "/chat/completions",
                data=json.dumps(payload).encode("utf-8"),
                headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"})
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    for raw_line in r:
                        line = raw_line.decode("utf-8", "replace").strip()
                        if not line.startswith("data:"):
                            continue
                        ds = line[5:].strip()
                        if ds == "[DONE]":
                            break
                        try:
                            obj = json.loads(ds)
                        except Exception:
                            continue
                        delta = obj.get("choices", [{}])[0].get("delta", {}).get("content", "")
                        if not delta:
                            continue
                        if not meta_sent:
                            first_buf += delta
                            if "\n" in first_buf:
                                head, rest = first_buf.split("\n", 1)
                                corr = _extract_correction(head, q)
                                _sse({"type": "meta", "mode": mode, "q": q, "correction": corr})
                                meta_sent = True
                                body_buf = rest
                                if rest:
                                    _sse({"type": "delta", "content": rest})
                            # 否则继续缓冲首行
                        else:
                            body_buf += delta
                            _sse({"type": "delta", "content": delta})
                if not meta_sent:  # 极短输出，未出现换行
                    corr = _extract_correction(first_buf, q)
                    _sse({"type": "meta", "mode": mode, "q": q, "correction": corr})
                    meta_sent = True
                    body_buf = first_buf
                    if first_buf:
                        _sse({"type": "delta", "content": first_buf})
                _sse({"type": "done", "content": clean_dict_body(body_buf)})
            except Exception as e:
                _sse({"type": "error", "message": str(e)[:200]})
            return
        if parsed.path == "/api/setmodel":
            # 公网部署时这条写接口必须关掉：否则任何访客都能改服务器上的模型名。
            if PUBLIC_MODE:
                self._send_json({"ok": False, "reason": "disabled_in_public_mode"}, 403)
                return
            length = int(self.headers.get("Content-Length", 0) or 0)
            raw = self.rfile.read(length) if length else b""
            try:
                data = json.loads(raw.decode("utf-8")) if raw else {}
            except Exception:
                data = {}
            model = (data.get("model") or "").strip()
            if set_llm_model(model):
                self._send_json({"ok": True, "model": model})
            else:
                self._send_json({"ok": False, "reason": "write_failed"}, 500)
            return
        self._send_json({"ok": False, "reason": "not_found"}, 404)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/conjugate":
            q = urllib.parse.parse_qs(parsed.query)
            verb = (q.get("verb") or [""])[0].strip()
            self._send_json(conjugate(verb))
            return
        if parsed.path == "/api/suggest":
            q = urllib.parse.parse_qs(parsed.query)
            prefix = (q.get("prefix") or [""])[0].strip()
            self._send_json({"prefix": prefix, "verbs": suggest(prefix)})
            return
        if parsed.path == "/api/model":
            cfg = load_llm_config()
            self._send_json({"model": cfg["LLM_MODEL"] or ""})
            return
        if parsed.path == "/api/fetch-article":
            q = urllib.parse.parse_qs(parsed.query)
            target = (q.get("url") or [""])[0].strip()
            self._send_json(fetch_article(target))
            return
        if parsed.path == "/api/news":
            # 聚合权威法语源，优先返回 RSS 自带全文。
            # 取缓存即时返回；若强制刷新或缓存为空，则在后台线程触发刷新（不阻塞请求）。
            q = urllib.parse.parse_qs(parsed.query)
            force = (q.get("refresh") or ["0"])[0] in ("1", "true")
            if force and not _NEWS_CACHE["refreshing"]:
                _refresh_news_async()
            data = _NEWS_CACHE["data"]
            if data is None:
                # 首次尚未就绪：返回 loading 标志，前端轮询
                self._send_json({"items": [], "sources_status": {}, "loading": True})
            else:
                resp = dict(data)
                resp["loading"] = _NEWS_CACHE["refreshing"]
                resp["cached_at"] = _NEWS_CACHE["ts"]
                self._send_json(resp)
            return
        # 其余按静态文件处理
        super().do_GET()

    def log_message(self, *args):
        pass  # 静默日志



def suggest(prefix, limit=12):
    """联网兜底：Wiktionary 法语前缀搜索取候选（pslimit=50），并行用 leconjugueur 验证是否为真实动词。
    返回以 prefix 开头的法语动词原形列表（最多 limit 个），零编造。"""
    if not re.fullmatch(r"[A-Za-zàâäéèêëîïôöûüùçæœ]{1,20}", prefix or ""):
        return []
    key = "sug:" + prefix.lower()
    if key in _cache:
        return _cache[key]
    # 1) Wiktionary 法语前缀搜索（取较多候选，覆盖生僻前缀如 z）
    try:
        q = urllib.parse.urlencode({
            "action": "query", "list": "prefixsearch", "pssearch": prefix,
            "pslimit": "50", "format": "json", "psnamespace": "0"})
        req = urllib.request.Request(
            "https://fr.wiktionary.org/w/api.php?" + q,
            headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.load(r)
        titles = [x["title"].strip() for x in data.get("query", {}).get("prefixsearch", [])]
    except Exception:
        titles = []
    # 2) 并行用 leconjugueur 验证是否为真实动词（避免混入名词等）
    def verify(t):
        t = t.lower()
        if not re.fullmatch(r"[a-zàâäéèêëîïôöûüùçæœ'\-]+", t):
            return None
        try:
            raw = _fetch_html(t)
        except Exception:
            return None
        if len(re.findall(r'<div class="conjugBloc">', raw)) > 0:
            return t
        return None
    verbs, seen = [], set()
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
        for res in ex.map(verify, titles):
            if res and res not in seen and len(verbs) < limit:
                seen.add(res)
                verbs.append(res)
    _cache[key] = verbs
    return verbs



def start_flask_proxy():
    """在后台线程拉起本地 Flask 代理（proxy.py，默认端口 8001）。
    该代理附真实浏览器 UA 并开放 CORS，是全文抓取优先级 3 的本地通道。
    若未安装 flask，则静默跳过——前端会自动回退到本服务内置的同源 /api/fetch-article。

    云端说明：这条通道只绑 127.0.0.1，属于容器内部回环，不对外暴露；
    若平台不允许额外监听，用 DISABLE_PROXY=1 关掉即可（功能自动降级，不会崩）。"""
    if (os.environ.get("DISABLE_PROXY") or "").strip() in ("1", "true", "yes"):
        print("已按 DISABLE_PROXY 跳过 Flask 代理，全文抓取走内置 /api/fetch-article。")
        return
    try:
        import threading
        from proxy import app as flask_app
        proxy_port = int(os.environ.get("PROXY_PORT", "8001") or 8001)
        t = threading.Thread(
            target=lambda: flask_app.run(host="127.0.0.1", port=proxy_port, threaded=True, use_reloader=False),
            daemon=True,
        )
        t.start()
        print(f"本地 Flask 代理已启动: http://127.0.0.1:{proxy_port}/  (全文抓取优先级3)")
    except Exception as e:
        print(f"提示：未启动 Flask 代理（{e}）。前端将回退到内置 /api/fetch-article。")


if __name__ == "__main__":
    class DualStackServer(ThreadingHTTPServer):
        # 同时监听 IPv4 与 IPv6，避免 localhost 被解析为 ::1 时连不上
        address_family = socket.AF_INET6

        def server_bind(self):
            try:
                self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
            except OSError:
                pass
            super().server_bind()

    start_flask_proxy()
    # 后台常驻：立即抓取首批权威法语新闻并周期性刷新（前端请求永远秒回缓存）
    threading.Thread(target=_news_refresh_loop, daemon=True).start()
    # 云端必须显式绑定 0.0.0.0，否则平台的反向代理（在容器另一个网络命名空间）
    # 连不到 :: 的监听地址，表现为「部署成功但访问 502」。
    if HOST:
        server = ThreadingHTTPServer((HOST, PORT), Handler)
        print(f"法语学习平台已启动: http://{HOST}:{PORT}/")
    else:
        server = DualStackServer(("::", PORT), Handler)
        print(f"法语学习平台已启动: http://127.0.0.1:{PORT}/  (也支持 http://localhost:{PORT}/)")
    print("动词变位接口: /api/conjugate?verb=parler")
    print("新闻聚合：后台异步抓取权威法语源（The Conversation / L'Express / France24 / RFI 等），RSS 自带全文优先")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()
