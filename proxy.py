#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""本地 Flask 代理（全文抓取优先级 3）：在请求中附加真实浏览器 User-Agent，
并对前端开放 CORS，从而让浏览器端也能调用而无需担心跨域。

用法：
    pip install flask
    python proxy.py            # 默认监听 http://127.0.0.1:8001
接口：
    GET /api/fetch-article?url=<文章链接>
        → {ok, html?, text?, via, error?}
    GET /health
        → {ok: true}

本代理与 server.py 共用 article_fetch.fetch_article（Jina → 直连 → 公共代理）。
server.py 启动时会自动在后台拉起本代理；若未安装 flask，server.py 会自动回退到
自身内置的同源 /api/fetch-article，功能不受影响。
"""
from flask import Flask, request, jsonify
from article_fetch import fetch_article

app = Flask(__name__)


@app.after_request
def _add_cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    resp.headers["Cache-Control"] = "no-store"
    return resp


@app.route("/api/fetch-article")
def api_fetch_article():
    url = (request.args.get("url") or "").strip()
    return jsonify(fetch_article(url))


@app.route("/health")
def health():
    return jsonify({"ok": True, "proxy": "flask"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8001, threaded=True)
