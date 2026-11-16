# Français · 法语研习空间

一个自成一体的法语学习站点：**法式极简 / 杂志编排风格**的前端 + **纯 Python 标准库**写的轻后端。
包含动词变位、词典查词与整句翻译、权威法语源新闻阅读、影子跟读、生词收藏夹五个功能区。

> 前端是零依赖的静态资源，后端只用了 `flask` 一个第三方包（仅用于全文抓取的本地代理），
> 其余全部基于 `http.server` / `urllib` / `json`，**没有数据库、没有构建步骤**。

---

## 零、第一次来，怎么用

**① 只想用，不想装任何东西** —— 点开就能用，手机浏览器也行：

<https://wbapp-0r1srlfu77zrwcsyw8rsgd.app.workbuddy.host/?sharecode=ZRBO3KFILA>

> 这是沙箱演示地址，可能随时失效。想长期对外，按下面「二、部署成公网站点」部署一次即可。

**② 想在自己电脑上跑** —— 见「一、本地运行」，需要 Python 3.9 以上，两条命令。

**③ 想改成自己的版本** —— Fork 本仓库，再按「二、部署成公网站点」部署，Render 免费档够用。

---

## 一、本地运行

```bash
pip install -r requirements.txt
python server.py
# 打开 http://127.0.0.1:8000/
```

看到 `法语学习平台已启动` 即可。**这个终端窗口不能关**，关掉服务就停了 —— 这是本地运行与"公网站点"的唯一区别。

### 可选：接入大模型（整句翻译 / 生词释义）

不配也能用：查词会退回本地词典 `french_dict.json`，整句翻译不可用。
要开启，任选一种方式：

```bash
# 方式 A：环境变量（云端部署用这个）
export LLM_API_KEY=sk-xxxx
export LLM_BASE_URL=https://api.openai.com/v1   # 兼容 OpenAI 协议的任意服务
export LLM_MODEL=gpt-4o-mini
python server.py

# 方式 B：本地密钥文件（Windows）
powershell -ExecutionPolicy Bypass -File set_llm_key.ps1 -ApiKey "sk-xxxx"
```

密钥存放在 `~/.french-llm-key`，已被 `.gitignore` 排除，不会进仓库。

---

## 二、部署成公网站点（让别人也能用）

### ⚠️ 先说清楚：GitHub Pages 不行

GitHub Pages 只能托管**静态文件**。本项目的变位查询、新闻聚合、全文抓取全在 `server.py` 里，
放上去会只剩一个空壳页面。正确姿势是：**代码放 GitHub，让云平台从仓库拉起一个真正的 Python 进程**。

### 路线 A · Render（推荐，有免费档）

1. 用 GitHub 账号登录 [render.com](https://render.com)（不需要信用卡）。
2. 右上角 **New → Blueprint**，选中本仓库。
3. Render 会自动读取 `render.yaml`，点 **Apply** 即可。
4. 构建完成后拿到形如 `https://french-learning-space.onrender.com` 的地址，发给谁都能打开。
5. 之后每次 `git push`，Render 自动重新部署。

免费档的两个限制，心里有数即可：

| 限制 | 表现 | 应对 |
|---|---|---|
| 15 分钟无访问会休眠 | 下一个访客首次打开要等 30–50 秒 | 用 [UptimeRobot](https://uptimerobot.com) 每 10 分钟 ping 一次 `/api/news` 即可常驻 |
| 磁盘是临时的 | 重启后 `~/.french-llm-key` 丢失 | 密钥一律用环境变量注入，不要依赖文件 |

### 路线 B · Railway / Fly.io

同样是"连仓库 → 自动识别 `requirements.txt` → 启动 `python server.py`"。
唯一的必填项是环境变量 `HOST=0.0.0.0`（平台会在外部做反向代理，绑回环地址会 502）。

### 绑定自己的域名

在 Render 的 **Settings → Custom Domain** 填你的域名，按提示到域名商加一条 `CNAME`。
HTTPS 证书由平台自动签发，无需手动配置。

---

## 三、环境变量

| 变量 | 必填 | 说明 |
|---|---|---|
| `PORT` | 云端必填 | 平台动态下发；本地默认 8000 |
| `HOST` | 云端必填 | 填 `0.0.0.0`。留空则走双栈 `::`（本地用，localhost 不会解析失败） |
| `PUBLIC_MODE` | 建议填 `1` | 公网模式：关闭 `/api/setmodel` 这类只该在本地用的写接口 |
| `LLM_API_KEY` | 选填 | 不填则整句翻译降级，词典功能不受影响 |
| `LLM_BASE_URL` | 选填 | 默认 `https://api.openai.com/v1` |
| `LLM_MODEL` | 选填 | 默认由服务端探测 |
| `DISABLE_PROXY` | 选填 | 平台不允许额外端口时置 `1`，全文抓取自动走内置同源接口 |

---

## 四、项目结构

```
server.py
rss_fetch.py
article_fetch.py
proxy.py
french_dict.json
build_full_dict.py
gen_dict.py
index.html
styles.css
app.js
render.yaml
requirements.txt
```

## 五、接口一览

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/conjugate?verb=parler` | 动词变位 |
| GET | `/api/suggest?prefix=pa` | 动词补全 |
| GET | `/api/dict?q=bonjour` | 查词 / 整句翻译 |
| GET | `/api/dict/stream?q=...` | 同上，SSE 流式输出 |
| GET | `/api/news` | 法语新闻聚合（缓存秒回，后台异步刷新） |
| GET | `/api/fetch-article?url=...` | 抓取文章全文 |
| GET | `/api/model` | 当前模型名（不含密钥） |
| POST | `/api/setmodel` | 切换模型（`PUBLIC_MODE=1` 时禁用） |

---

## License

个人学习项目，代码可自由参考。抓取内容版权归各原媒体所有。
