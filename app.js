/* =========================================================
   法语学习平台 · 交互逻辑
   ========================================================= */

/* ---------------- 数据：动词变位（本地离线缓存，仅作兜底） ---------------- */
const VERBS = {
  "être": {
    zh: "是 / 存在", group: "不规则动词",
    tenses: {
      "Présent 现在时": ["suis", "es", "est", "sommes", "êtes", "sont"],
      "Imparfait 未完成过去时": ["étais", "étais", "était", "étions", "étiez", "étaient"],
      "Futur 将来时": ["serai", "seras", "sera", "serons", "serez", "seront"],
      "Passé composé 复合过去时": ["ai été", "as été", "a été", "avons été", "avez été", "ont été"]
    }
  },
  "avoir": {
    zh: "有", group: "不规则动词",
    tenses: {
      "Présent 现在时": ["ai", "as", "a", "avons", "avez", "ont"],
      "Imparfait 未完成过去时": ["avais", "avais", "avait", "avions", "aviez", "avaient"],
      "Futur 将来时": ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
      "Passé composé 复合过去时": ["ai eu", "as eu", "a eu", "avons eu", "avez eu", "ont eu"]
    }
  },
  "faire": {
    zh: "做 / 制造", group: "不规则动词",
    tenses: {
      "Présent 现在时": ["fais", "fais", "fait", "faisons", "faites", "font"],
      "Imparfait 未完成过去时": ["faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient"],
      "Futur 将来时": ["ferai", "feras", "fera", "ferons", "ferez", "feront"],
      "Passé composé 复合过去时": ["ai fait", "as fait", "a fait", "avons fait", "avez fait", "ont fait"]
    }
  },
  "aller": {
    zh: "去", group: "不规则动词",
    tenses: {
      "Présent 现在时": ["vais", "vas", "va", "allons", "allez", "vont"],
      "Imparfait 未完成过去时": ["allais", "allais", "allait", "allions", "alliez", "allaient"],
      "Futur 将来时": ["irai", "iras", "ira", "irons", "irez", "iront"],
      "Passé composé 复合过去时": ["suis allé", "es allé", "est allé", "sommes allés", "êtes allés", "sont allés"]
    }
  },
  "parler": {
    zh: "说话", group: "第一组 · -er 规则",
    tenses: {
      "Présent 现在时": ["parle", "parles", "parle", "parlons", "parlez", "parlent"],
      "Imparfait 未完成过去时": ["parlais", "parlais", "parlait", "parlions", "parliez", "parlaient"],
      "Futur 将来时": ["parlerai", "parleras", "parlera", "parlerons", "parlerez", "parleront"],
      "Passé composé 复合过去时": ["ai parlé", "as parlé", "a parlé", "avons parlé", "avez parlé", "ont parlé"]
    }
  },
  "manger": {
    zh: "吃", group: "第一组 · -er 规则（ge）",
    tenses: {
      "Présent 现在时": ["mange", "manges", "mange", "mangeons", "mangez", "mangent"],
      "Imparfait 未完成过去时": ["mangeais", "mangeais", "mangeait", "mangions", "mangiez", "mangeaient"],
      "Futur 将来时": ["mangerai", "mangeras", "mangera", "mangerons", "mangerez", "mangeront"],
      "Passé composé 复合过去时": ["ai mangé", "as mangé", "a mangé", "avons mangé", "avez mangé", "ont mangé"]
    }
  },
  "finir": {
    zh: "完成", group: "第二组 · -ir 规则",
    tenses: {
      "Présent 现在时": ["finis", "finis", "finit", "finissons", "finissez", "finissent"],
      "Imparfait 未完成过去时": ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"],
      "Futur 将来时": ["finirai", "finiras", "finira", "finirons", "finirez", "finiront"],
      "Passé composé 复合过去时": ["ai fini", "as fini", "a fini", "avons fini", "avez fini", "ont fini"]
    }
  },
  "vendre": {
    zh: "卖", group: "第三组 · -re 规则",
    tenses: {
      "Présent 现在时": ["vends", "vends", "vend", "vendons", "vendez", "vendent"],
      "Imparfait 未完成过去时": ["vendais", "vendais", "vendait", "vendions", "vendiez", "vendaient"],
      "Futur 将来时": ["vendrai", "vendras", "vendra", "vendrons", "vendrez", "vendront"],
      "Passé composé 复合过去时": ["ai vendu", "as vendu", "a vendu", "avons vendu", "avez vendu", "ont vendu"]
    }
  },
  "pouvoir": {
    zh: "能够", group: "不规则动词",
    tenses: {
      "Présent 现在时": ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"],
      "Imparfait 未完成过去时": ["pouvais", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient"],
      "Futur 将来时": ["pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront"],
      "Passé composé 复合过去时": ["ai pu", "as pu", "a pu", "avons pu", "avez pu", "ont pu"]
    }
  },
  "prendre": {
    zh: "拿 / 取", group: "不规则动词",
    tenses: {
      "Présent 现在时": ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
      "Imparfait 未完成过去时": ["prenais", "prenais", "prenait", "prenions", "preniez", "prenaient"],
      "Futur 将来时": ["prendrai", "prendras", "prendra", "prendrons", "prendrez", "prendront"],
      "Passé composé 复合过去时": ["ai pris", "as pris", "a pris", "avons pris", "avez pris", "ont pris"]
    }
  }
};

/* ---------------- 数据：词典 ---------------- */
const DICTIONARY = [
  { fr: "bonjour", phon: "/bɔ̃.ʒuʁ/", pos: "n.m.", zh: "你好；日安" },
  { fr: "merci", phon: "/mɛʁ.si/", pos: "interj.", zh: "谢谢" },
  { fr: "oui", phon: "/wi/", pos: "adv.", zh: "是，对" },
  { fr: "non", phon: "/nɔ̃/", pos: "adv.", zh: "不，否" },
  { fr: "chat", phon: "/ʃa/", pos: "n.m.", zh: "猫" },
  { fr: "chien", phon: "/ʃjɛ̃/", pos: "n.m.", zh: "狗" },
  { fr: "maison", phon: "/mɛ.zɔ̃/", pos: "n.f.", zh: "房子，家" },
  { fr: "eau", phon: "/o/", pos: "n.f.", zh: "水" },
  { fr: "pomme", phon: "/pɔm/", pos: "n.f.", zh: "苹果" },
  { fr: "livre", phon: "/livʁ/", pos: "n.m.", zh: "书" },
  { fr: "soleil", phon: "/sɔ.lɛj/", pos: "n.m.", zh: "太阳" },
  { fr: "femme", phon: "/fam/", pos: "n.f.", zh: "女人；妻子" },
  { fr: "homme", phon: "/ɔm/", pos: "n.m.", zh: "男人" },
  { fr: "manger", phon: "/mɑ̃.ʒe/", pos: "v.", zh: "吃" },
  { fr: "parler", phon: "/paʁ.le/", pos: "v.", zh: "说话" },
  { fr: "aimer", phon: "/ɛ.me/", pos: "v.", zh: "爱；喜欢" },
  { fr: "aller", phon: "/a.le/", pos: "v.", zh: "去" },
  { fr: "venir", phon: "/və.niʁ/", pos: "v.", zh: "来" },
  { fr: "grand", phon: "/ɡʁɑ̃/", pos: "adj.", zh: "大的；高的" },
  { fr: "petit", phon: "/pə.ti/", pos: "adj.", zh: "小的" },
  { fr: "beau", phon: "/bo/", pos: "adj.", zh: "美丽的" },
  { fr: "rouge", phon: "/ʁuʒ/", pos: "adj.", zh: "红色的" },
  { fr: "aujourd'hui", phon: "/o.ʒuʁ.dɥi/", pos: "adv.", zh: "今天" },
  { fr: "demain", phon: "/də.mɛ̃/", pos: "adv.", zh: "明天" },
  { fr: "France", phon: "/fʁɑ̃s/", pos: "n.f.", zh: "法国" },
  { fr: "temps", phon: "/tɑ̃/", pos: "n.m.", zh: "时间；天气" },
  { fr: "ami", phon: "/a.mi/", pos: "n.m.", zh: "朋友" },
  { fr: "travail", phon: "/tʁa.vaj/", pos: "n.m.", zh: "工作" },
  { fr: "école", phon: "/e.kɔl/", pos: "n.f.", zh: "学校" },
  { fr: "ville", phon: "/vil/", pos: "n.f.", zh: "城市" }
];

/* ---------------- 数据：阅读材料 ---------------- */
/* 阅视界（Reading View）：站内直接阅读权威法语新闻，并与右侧翻译区形成联动。
   抓取策略（第一性原理修正，杜绝"新标签页跳转"对目标的污染）：
   - 服务端出站（沙箱 / 数据中心 IP）常被源站反爬拦截、且公共代理不稳，因此【不在服务端抓文章页】；
   - 改为【浏览器端直连各权威源的原始 RSS】：请求来自用户浏览器（不受沙箱 IP 封锁），
     经 CORS 代理取回 XML，再用 JS 解析 content:encoded 拿到真·全文，站内渲染 +
     划词查词 + 右侧翻译联动，全程零跳转；
   - 多源组合（Le Monde / The Conversation / L'Express / Libération / Le Point / Slate /
     Courrier / Le Devoir / Swissinfo / Le Temps / Numerama / La Croix / 20 Minutes /
     Sciences et Avenir），均为「RSS 自带全文」的权威源，保证站内可读、稳定、全量。 */

/* 权威法语源（均提供 content:encoded / atom content 全文） */
const RSS_FEEDS = [
  { name: "Le Monde",               url: "https://www.lemonde.fr/actualite-medias/rss_full.xml" },
  { name: "The Conversation FR",    url: "https://theconversation.com/fr/articles.atom" },
  { name: "L'Express",              url: "https://www.lexpress.fr/rss/actualite.xml" },
  { name: "Libération",             url: "https://www.liberation.fr/feed/" },
  { name: "Le Point",               url: "https://www.lepoint.fr/rss.xml" },
  { name: "Slate.fr",               url: "https://www.slate.fr/rss.xml" },
  { name: "Courrier International", url: "https://www.courrierinternational.com/feed" },
  { name: "Sciences et Avenir",     url: "https://www.sciencesetavenir.fr/rss/" },
  { name: "Le Devoir",              url: "https://www.ledevoir.com/rss" },
  { name: "Swissinfo",              url: "https://www.swissinfo.ch/fre/rss" },
  { name: "Le Temps",               url: "https://www.letemps.ch/rss" },
  { name: "Numerama",               url: "https://www.numerama.com/feed/" },
  { name: "La Croix",               url: "https://www.la-croix.com/rss" },
  { name: "20 Minutes",             url: "https://www.20minutes.fr/feeds/news.xml" },
  { name: "Le Figaro",              url: "https://www.lefigaro.fr/rss/figaro_actualites.xml" },
  { name: "L'Obs",                  url: "https://www.nouvelobs.com/rss/une.xml" },
  { name: "France Culture",         url: "https://www.franceculture.fr/rss" },
  { name: "HuffPost FR",            url: "https://www.huffingtonpost.fr/feeds/index.xml" }
];

/* 浏览器端 CORS 代理链（请求来自用户浏览器，不受沙箱 IP 封锁；并行竞速，任一成功即用） */
const CORS_PROXIES = [
  u => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
  u => "https://api.allorigins.win/get?url=" + encodeURIComponent(u),
  u => "https://corsproxy.io/?url=" + encodeURIComponent(u),
  u => "https://api.codetabs.com/v1/proxy/?quest=" + u,
  u => "https://cors.eu.org/" + u
];

const NEWS_CACHE_KEY = "reading_news_cache_v2";
const NEWS_CACHE_TTL = 20 * 60 * 1000;   // 20 分钟内复用缓存：秒开且抗网络抖动

let readingItems = [];          // 归一化后的新闻条目（站内全文 + 右侧翻译联动）
let readingActiveCat = "all";   // 当前选中的分类 Tab

/* 分类 Tab 配置：纯前端按 description/title 关键字过滤（法国24台法语源） */
const READING_CATEGORIES = [
  { key: "all",      label: "全部", kw: [] },
  { key: "politics", label: "政治", kw: ["politique","président","gouvernement","gouvern","élection","électoral","ministre","parlement","sénat","assemblée","macron","premier ministre","campagne","vote","sénateur"] },
  { key: "economy",  label: "经济", kw: ["économie","économique","croissance","marché","bourse","entreprise","finance","financier","inflation","prix","pétrole","chômage","emploi","commerce","banque","crise"] },
  { key: "sport",    label: "体育", kw: ["sport","foot","football","match","tennis","coupe","olympique","jeux","ligue","champion","tournoi","cyclisme","rugby","basket","cycliste"] },
  { key: "culture",  label: "文化", kw: ["culture","culturel","cinéma","film","livre","musique","art","exposition","théâtre","littérature","chanson","artiste","spectacle"] },
  { key: "world",    label: "国际", kw: ["international","monde","étranger","guerre","diplomatie","onu","états-unis","américain","chine","russie","ukraine","moyen-orient","afrique","europe","gaza"] },
  { key: "society",  label: "社会", kw: ["société","social","police","justice","santé","éducation","école","manifestation","grève","accident","environnement","climat","secours"] }
];

/* 判断某条新闻是否属于指定分类（all 返回 true；其余按关键字命中） */
function readingInCat(it, catKey) {
  if (catKey === "all") return true;
  const cat = READING_CATEGORIES.find(c => c.key === catKey);
  if (!cat) return false;
  const text = ((it.title || "") + " " + (it.summary || "")).toLowerCase();
  return cat.kw.some(k => text.includes(k));
}

/* 去掉 RSS 描述里的 HTML 标签与常见实体，得到可安全展示的纯文本 */
function stripTags(input) {
  if (!input) return "";
  return String(input)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, " ")
    .trim();
}

/* 将 RSS 时间格式化为「YYYY-MM-DD HH:MM」 */
function formatRssDate(s) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/* ---------------- 导航 ---------------- */
const VIEWS = {
  conjugation: { title: "动词变位区", sub: "Conjugaison · 掌握法语动词的人称变化" },
  dictionary: { title: "词典与翻译", sub: "Dictionnaire · 法语 ↔ 中文速查" },
  reading: { title: "阅视界", sub: "Lecture · 在短文中积累语感" },
  shadow: { title: "影子跟读室", sub: "Shadowing · 听标准发音，跟读模仿" },
  favorites: { title: "生词收藏夹", sub: "Mes Mots · 收藏的法语生词本" }
};

/* ---------------- 三层视图（A 入场 / B 轮盘 / C 功能区） ---------------- */
const viewA = document.getElementById("view-A");
const viewB = document.getElementById("view-B");
const viewC = document.getElementById("view-C");
const homeEnter = document.getElementById("home-enter");
const backHome = document.getElementById("back-home");
const brand = document.querySelector(".brand");
const nav = document.getElementById("nav");
const titleEl = document.getElementById("view-title");
const subEl = document.getElementById("view-sub");
const wheel = document.getElementById("wheel");
const transition = document.getElementById("transition");
const transitionText = document.getElementById("transition-text");

/* 侧栏已改为独立样式（styles.css 的 .side 系列），选中态只切换一个 is-active 类。
   注意：绝不能再整串覆盖 className —— 那样会把 nav-item / nav-ico 等结构类一起抹掉。 */
const NAV_ACTIVE_CLASS = "is-active";

/* View A（7fr/3fr）与 View B（1fr/1fr）主框架都是 CSS Grid，
   显示时必须以 grid 呈现，否则栅格不生效 */
const LAYER_SHOW = { "view-A": "grid", "view-B": "grid", "view-C": "flex" };
let currentLayer = "view-A";   // 初始仅显示 View A；B、C 默认 display:none
let layerBusy = false;

/* 0.4s 透明度淡入淡出：先淡出当前层 → display:none → 显示目标层并淡入（三层绝对隔离，互不重叠） */
function setLayer(id) {
  if (layerBusy || currentLayer === id) return;
  layerBusy = true;
  const from = document.getElementById(currentLayer);
  const to = document.getElementById(id);
  from.style.opacity = "0";
  setTimeout(() => {
    from.style.display = "none";
    to.style.display = LAYER_SHOW[id];
    to.style.opacity = "0";
    void to.offsetWidth;                 // 触发重排以启动淡入
    to.style.opacity = "1";
    if (id === "view-B") { playWheelIn(); updateQuote(); paintHomeStats(); if (wheel3D) wheel3D.resize(); }  // 轮盘弹出 + 刷新金句 + 数据卡填真实值
    currentLayer = id;
    layerBusy = false;
  }, 400);
}

/* A → B：封面平滑淡出，轮盘页平滑淡入 */
function goToB() { setLayer("view-B"); }

/* B → C：轮盘隐藏 → 招手小人过场(1.5s) → 功能区淡入并加载对应功能 */
let transitionTimer = null;
const TRANSITION_TEXT = {
  conjugation: "正在进入动词变位空间…",
  dictionary: "正在进入词典与翻译空间…",
  reading: "正在进入阅视界…",
  shadow: "正在进入影子跟读室…"
};
function playWheelIn() {
  viewB.classList.remove("explore-in");
  void viewB.offsetWidth;
  viewB.classList.add("explore-in");
  setTimeout(() => viewB.classList.remove("explore-in"), 1300);  // 动画结束移除，恢复正常 hover
}
function enterWithTransition(view) {
  if (!VIEWS[view] || layerBusy) return;
  layerBusy = true;
  transitionText.textContent = TRANSITION_TEXT[view] || "正在进入…";
  const fill = transition.querySelector(".transition-fill");
  fill.style.animation = "none"; void fill.offsetWidth; fill.style.animation = "";  // 重启进度条
  transition.classList.remove("hidden");
  viewB.style.opacity = "0";                       // 先淡出轮盘页
  setTimeout(() => { viewB.style.display = "none"; }, 400);
  transitionTimer = setTimeout(() => {
    transition.classList.add("hidden");
    setFunction(view);                              // 仅切换 View C 内部的功能区块
    viewC.style.display = "flex";
    viewC.style.opacity = "0";
    void viewC.offsetWidth;
    viewC.style.opacity = "1";
    currentLayer = "view-C";
    layerBusy = false;
  }, 1500);
}

/* C 内部：切换具体功能区（不切换层、无过场；侧边栏点击直接切换） */
function setFunction(view) {
  if (!VIEWS[view]) view = "conjugation";
  document.querySelectorAll("#view-C .func-section").forEach(s =>
    s.classList.toggle("hidden", s.id !== "view-" + view));
  document.querySelectorAll(".nav-item").forEach(b =>
    b.classList.toggle(NAV_ACTIVE_CLASS, b.dataset.view === view));
  titleEl.textContent = VIEWS[view].title;
  subEl.textContent = VIEWS[view].sub;
  if (view === "favorites") renderFavorites();
  const main = document.querySelector("#view-C main");
  if (main) main.scrollTop = 0;
}

/* ===================== 生词收藏夹（localStorage 驱动，零后端） ===================== */
const FAV_KEY = "fr_favorites_v1";
function loadFavs() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || {}; } catch (e) { return {}; } }
function saveFavs(map) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(map)); } catch (e) {}
  paintHomeStats();   // 主页数据卡与收藏夹同源：增删收藏立刻反映到数字与柱状图
}
function normalizeWord(w) { return (w || "").trim().toLowerCase(); }
function isFav(word) { return !!loadFavs()[normalizeWord(word)]; }
function addFav(word, meaning) {
  const m = loadFavs();
  m[normalizeWord(word)] = { word: (word || "").trim(), meaning: (meaning || "").slice(0, 60), ts: Date.now() };
  saveFavs(m);
}
function removeFav(word) { const m = loadFavs(); delete m[normalizeWord(word)]; saveFavs(m); }
function favList() { return Object.values(loadFavs()).sort((a, b) => b.ts - a.ts); }   // 按收藏时间倒序（最新最上）

/* ===================== 主页数据卡：真实统计 + 本地记忆 =====================
   口径说明（写在这里，避免以后再猜）：
   - 学习时长：页面处于前台、且 90 秒内有过操作才累计，按「秒」记账。
     这样挂着标签页去吃饭不会虚增时长，短暂切走也不会漏记。
   - 生词数量：直接数 fr_favorites_v1，不另存一份，永远和收藏夹一致。
   - 存储：每天一个键存进 fr_study_stats_v1，形如 {"days":{"2026-11-15":1830}}。
     跨天不清库，昨天的记录留着给「近 7 日」用；只保留最近 60 天防膨胀。
   - 作用域：localStorage 按浏览器隔离，同一台电脑同一浏览器再打开数字就在；
     换设备 / 换浏览器 / 无痕窗口不共享——这是纯前端方案的固有边界。
   ======================================================================== */
const STATS_KEY = "fr_study_stats_v1";
const STUDY_GOAL_MIN = 60;          // 每日学习目标（分钟）：环形进度到 100% 的基准
const IDLE_LIMIT_MS = 90 * 1000;    // 90 秒无任何操作 → 视为离开，暂停计时
const KEEP_DAYS = 60;               // 只保留最近 60 天的日记录

function dateKey(d) {
  const t = d || new Date();
  const p = n => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}
function loadStats() {
  try {
    const o = JSON.parse(localStorage.getItem(STATS_KEY));
    if (o && typeof o === "object" && o.days && typeof o.days === "object") return o;
  } catch (e) {}
  return { days: {} };
}
function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) {} }

let statsState = loadStats();
let statsLastWrite = 0;
let statsLastActive = Date.now();   // 最近一次真人操作的时间戳

function todaySeconds() { return Math.round(statsState.days[dateKey()] || 0); }

/* 记 1 秒；写盘做 5 秒节流，避免每秒都碰 localStorage */
function tickStudySecond() {
  const k = dateKey();
  statsState.days[k] = (statsState.days[k] || 0) + 1;
  const now = Date.now();
  if (now - statsLastWrite >= 5000) { statsLastWrite = now; commitStats(); }
}
function pruneStats() {
  const keys = Object.keys(statsState.days).sort();
  if (keys.length > KEEP_DAYS) keys.slice(0, keys.length - KEEP_DAYS).forEach(k => delete statsState.days[k]);
}
/* 落盘前先读盘、按天取较大值合并：
   同时开了两个标签页时，后写的那个不会把另一个已经累计的时长覆盖回去 */
function commitStats() {
  try {
    const disk = JSON.parse(localStorage.getItem(STATS_KEY));
    if (disk && disk.days && typeof disk.days === "object") {
      for (const k in disk.days) {
        const v = Number(disk.days[k]) || 0;
        if (v > (statsState.days[k] || 0)) statsState.days[k] = v;
      }
    }
  } catch (e) {}
  pruneStats();
  saveStats(statsState);
}
function flushStats() {   // 关页 / 切后台：立刻落盘，绝不丢最后一分钟
  commitStats();
  statsLastWrite = Date.now();
}

/* 把真实数据画到 View B 的两张卡上 */
function paintHomeStats() {
  /* ① 今日学习时长：不足 1 分钟显示秒，避免刚学会儿就显示「0 分钟」像是没记上 */
  const sec = todaySeconds();
  const numEl = document.getElementById("stat-min");
  const unitEl = document.getElementById("stat-min-unit");
  if (numEl && unitEl) {
    if (sec < 60) { numEl.textContent = String(sec); unitEl.textContent = "秒"; }
    else { numEl.textContent = String(Math.floor(sec / 60)); unitEl.textContent = "分钟"; }
  }
  const pct = Math.max(0, Math.min(100, Math.round(sec / (STUDY_GOAL_MIN * 60) * 100)));
  const ring = document.getElementById("stat-ring");
  const ringTxt = document.getElementById("stat-ring-txt");
  if (ring) {
    ring.style.setProperty("--p", String(pct));
    ring.setAttribute("aria-label",
      `今日已学习 ${Math.floor(sec / 60)} 分 ${sec % 60} 秒，目标 ${STUDY_GOAL_MIN} 分钟，已完成 ${pct}%`);
  }
  if (ringTxt) ringTxt.textContent = pct + "%";

  /* ② 生词收藏总数（与收藏夹同源，增删即时同步） */
  const favs = Object.values(loadFavs());
  const favEl = document.getElementById("stat-fav");
  if (favEl) favEl.textContent = String(favs.length);

  /* ③ 近 7 日每日新增：按收藏时间戳分组，不额外存统计 */
  const spark = document.getElementById("stat-spark");
  if (spark) {
    const bars = spark.querySelectorAll("i");
    const counts = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = dateKey(d);
      counts.push(favs.filter(f => f.ts && dateKey(new Date(f.ts)) === k).length);
    }
    const max = Math.max(1, ...counts);
    bars.forEach((b, i) => {
      // 当天为 0 也留一条 6% 的基线，柱子不会整个消失
      const h = counts[i] ? Math.max(16, Math.round(counts[i] / max * 100)) : 6;
      b.style.setProperty("--h", h + "%");
    });
    spark.setAttribute("aria-label", "近 7 日新增生词：" + counts.join("、") + " 个");
  }
}

/* 计时器：每秒结算一次；前台 + 未超时闲置才 +1 秒 */
function startStudyStats() {
  ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"].forEach(ev =>
    window.addEventListener(ev, () => { statsLastActive = Date.now(); }, { passive: true }));

  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    if (Date.now() - statsLastActive > IDLE_LIMIT_MS) return;   // 人不在，停止计时
    tickStudySecond();
    if (currentLayer === "view-B") paintHomeStats();            // 只有主页可见时才重绘
  }, 1000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushStats();
    else { statsLastActive = Date.now(); paintHomeStats(); }    // 切回来立刻校准显示
  });
  window.addEventListener("pagehide", flushStats);
  window.addEventListener("beforeunload", flushStats);
  flushStats();   // 启动即落盘一次：把 loadStats 的容错结果固化
}

/* 从词典渲染结果中抽取第一个含中文的核心释义（用于收藏卡片展示） */
function extractCoreMeaning(container) {
  if (!container) return "";
  const pick = (nodes) => {
    for (const n of nodes) {
      const t = (n.textContent || "").trim();
      if (/[一-鿿]/.test(t) && t.length <= 60) return t;
    }
    return "";
  };
  return pick(container.querySelectorAll("li")) ||
         pick(container.querySelectorAll("p, h3, h4, strong")) || "";
}

let currentDictWord = "";
let currentDictMode = "word";
let currentDictMeaning = "";

/* 词典结果区顶部收藏条：单词模式显示 ⭐，句子模式隐藏；状态随收藏变化实时联动 */
function updateFavBar() {
  const bar = document.getElementById("dict-fav-bar");
  const wordEl = document.getElementById("dfb-word");
  const star = document.getElementById("dfb-star");
  if (!bar) return;
  if (currentDictMode !== "word" || !currentDictWord) { bar.classList.add("hidden"); return; }
  bar.classList.remove("hidden");
  wordEl.textContent = currentDictWord;
  const fav = isFav(currentDictWord);
  star.classList.toggle("is-fav", fav);
  star.title = fav ? "已收藏 · 点击取消" : "收藏到生词本";
  star.setAttribute("aria-pressed", fav ? "true" : "false");
}

/* 渲染收藏夹列表（卡片式，按收藏时间倒序）；顶部统计 + 空状态切换 */
function renderFavorites() {
  const list = favList();
  const countEl = document.getElementById("fav-count");
  const listEl = document.getElementById("fav-list");
  const emptyEl = document.getElementById("fav-empty");
  if (countEl) countEl.textContent = `共收藏了 ${list.length} 个单词`;
  if (!list.length) {
    if (listEl) listEl.innerHTML = "";
    if (emptyEl) emptyEl.classList.remove("hidden");
    return;
  }
  if (emptyEl) emptyEl.classList.add("hidden");
  listEl.innerHTML = list.map(f => `
    <div class="fav-card" data-word="${escapeHtml(f.word)}">
      <div class="fav-card-main">
        <div class="fav-card-word">${escapeHtml(f.word)}</div>
        <div class="fav-card-meaning">${escapeHtml(f.meaning || "—")}</div>
      </div>
      <button class="fav-card-del" type="button" data-word="${escapeHtml(f.word)}" aria-label="移除" title="移除该生词">🗑️</button>
    </div>`).join("");
  listEl.querySelectorAll(".fav-card").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest(".fav-card-del")) return;
      const w = card.dataset.word;
      setFunction("dictionary");
      dictSearch.value = w;
      doDictStream(w);
    });
  });
  listEl.querySelectorAll(".fav-card-del").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const w = btn.dataset.word;
      removeFav(w);
      renderFavorites();
      updateFavBar();
      showToast("已移除：" + w);
    });
  });
}

/* 收藏条 ⭐ 点击切换 + 清空全部（二次确认） */
(function bindFavBar() {
  const star = document.getElementById("dfb-star");
  if (star) star.addEventListener("click", () => {
    if (!currentDictWord) return;
    if (isFav(currentDictWord)) {
      removeFav(currentDictWord);
      showToast("已取消收藏：" + currentDictWord);
    } else {
      addFav(currentDictWord, currentDictMeaning || extractCoreMeaning(dictResult));
      showToast("已收藏：" + currentDictWord);
    }
    updateFavBar();
  });
  const clearBtn = document.getElementById("fav-clear");
  if (clearBtn) clearBtn.addEventListener("click", () => {
    const list = favList();
    if (!list.length) { showToast("收藏夹已是空的"); return; }
    if (confirm(`确定要清空全部 ${list.length} 个收藏单词吗？此操作不可撤销。`)) {
      try { localStorage.removeItem(FAV_KEY); } catch (e) {}
      paintHomeStats();   // 清空后主页数字与柱状图同步归零
      renderFavorites();
      updateFavBar();
      showToast("已清空生词收藏夹");
    }
  });
})();

/* 事件绑定 */
homeEnter.addEventListener("click", goToB);
nav.addEventListener("click", e => {
  const btn = e.target.closest(".nav-item");
  if (btn) setFunction(btn.dataset.view);    // 侧边栏直接切换功能区，无过场
});

/* 轮盘图标顺序：上=动词变位(Tag) 右=影子跟读(麦克风) 下=词典 左=阅读 */
const HOME_CARDS = [
  { view: "conjugation", title: "动词变位区", sub: "掌握法语动词在各语式、各时态下的人称变化。",
    icon: '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h5l8 8-7 7-8-8V7z"/><path d="M9 9h.01"/><path d="M14 14l4 4"/></svg>' },
  { view: "shadow", title: "影子跟读室", sub: "听标准法语发音，跟读模仿，打磨口语。",
    icon: '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M19 9a3 3 0 0 1 0 6M5 9a3 3 0 0 0 0 6"/><path d="M12 18v3"/></svg>' },
  { view: "dictionary", title: "词典与翻译", sub: "法语 ↔ 中文，随时查词、看音标与词性。",
    icon: '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h7v18H6a2 2 0 0 1-2-2V5z"/><path d="M13 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/><path d="M8 8h3M8 12h3"/></svg>' },
  { view: "reading", title: "阅视界", sub: "在分级短文中积累语感，左法右中对照阅读。",
    icon: '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H3z"/><path d="M21 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z"/></svg>' },
  { view: "favorites", title: "生词收藏夹", sub: "收藏查过的法语生词，随时复习。",
    icon: '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 17.9 6.6 19.6l1.2-6L3.3 9.4l6.1-.8z"/></svg>' }
];

function renderWheel() {
  // 主页视觉已改为「非对称杂志风 3×2 功能矩阵」。
  // 若要切回 Three.js 球体弧线：把下一行换成 if (window.THREE && webglAvailable()) initWheel3D(); else renderWheelGrid();
  renderWheelGrid();
}

/* 功能矩阵：3 列 × 2 行向心矩阵。
   Fr 徽标由 CSS 显式钉在 (2,2) 网格中心，5 枚按钮自动填充其余格子：
   ┌────┬────┬────┐
   │ ①  │ ②  │ ③  │
   ├────┼────┼────┤
   │ ④  │ Fr │ ⑤  │
   └────┴────┴────┘
   DOM 顺序保持 center 在前 + 5 个按钮，自动放置算法会自然跳过中心格。 */
function renderWheelGrid() {
  const nodes = HOME_CARDS.map(c => `
    <button class="wheel-btn wb-${c.view}" data-view="${c.view}" aria-label="${c.title}" type="button">
      <span class="wb-icon">${c.icon}</span>
      <span class="wb-label"><span class="wb-title">${c.title}</span></span>
    </button>`).join("");
  wheel.classList.remove("wheel-3d", "wheel-dom");
  wheel.classList.add("wheel-grid");
  wheel.innerHTML = `<div class="wheel-center">Fr</div>` + nodes;
  wheel.querySelectorAll(".wheel-btn").forEach(b => {
    b.onclick = () => enterWithTransition(b.dataset.view);   // 走「过场 → 功能区」
  });
}

/* WebGL 可用性探测 */
function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch (e) { return false; }
}

/* 把功能区 SVG 图标渲染成 Canvas 纹理，作为「贴在球面上的徽记」
   （球体是半透明磨砂玻璃，图标用 billboard 精确朝向相机，避免转到背面不可读） */
function makeSphereIconTexture(svgMarkup, strokeColor) {
  const size = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d");
  const texture = new THREE.CanvasTexture(cv);
  texture.anisotropy = 4;
  const svg = svgMarkup
    .replace(/^<svg\s/, '<svg xmlns="http://www.w3.org/2000/svg" ')   // img 载入 SVG 必须显式声明命名空间，否则图标空白
    .replace(/width="34"/, `width="${size}"`)
    .replace(/height="34"/, `height="${size}"`)
    .replace(/stroke="currentColor"/, `stroke="${strokeColor}"`)
    .replace(/stroke-width="1.6"/, `stroke-width="1.3"`);
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, size * 0.14, size * 0.14, size * 0.72, size * 0.72);
    texture.needsUpdate = true;
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  return texture;
}

/* Three.js 3D 轮盘：5 个莫兰迪球体沿弧线排布，磨砂玻璃质感；点击球体路由切换 */
let wheel3D = null;
function initWheel3D() {
  const container = wheel;
  const W = () => container.clientWidth || 620;
  const H = () => container.clientHeight || 460;

  container.classList.remove("wheel-dom");
  container.classList.add("wheel-3d");

  // 容器内容：canvas（底） + Fr 印章（中） + hover 提示（顶）
  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute; inset:0; width:100%; height:100%; display:block;";
  container.appendChild(canvas);
  const fr = document.createElement("div");
  fr.className = "wheel-center";
  fr.textContent = "Fr";
  fr.style.pointerEvents = "none";   // 不拦截画布上的射线点击/悬停
  container.appendChild(fr);
  const tip = document.createElement("div");
  tip.className = "wheel-3d-tip";
  tip.textContent = "";
  container.appendChild(tip);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W(), H(), false);
  renderer.setClearColor(0x000000, 0);   // 透明，露出 View B 的渐变背景
  if ("outputEncoding" in renderer && THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
  if (THREE.ACESFilmicToneMapping) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;   // 柔和压制高光，去掉塑料反光
    renderer.toneMappingExposure = 1.1;                   // 补偿哑光材质被压暗的中间调
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 100);
  camera.position.set(0, 0.1, 5.6);      // 稍拉远：配合 z 轴错落，产生真实大小差异
  camera.lookAt(0, 0.05, 0);

  /* 灯光：一盏柔和环境光打底 + 右上方低强度平行光，形成柔和的明暗渐变（点光源已删除） */
  scene.add(new THREE.AmbientLight(0xfffdf8, 0.86));
  const key = new THREE.DirectionalLight(0xfff4e2, 0.52);    // 右上主光，低强度、无高光热点
  key.position.set(3.2, 4.6, 3.4);
  scene.add(key);

  const group = new THREE.Group();
  scene.add(group);

  // 莫兰迪色系：绿 / 红棕 / 土黄 / 蓝 / 金（收藏夹）
  const COLORS = {
    conjugation: 0x7AA389,
    shadow:      0xC69393,
    dictionary:  0xD8AA60,
    reading:     0x6995B4,
    favorites:   0xE6B65E
  };

  /* 弧线排布：横向一条流畅的拱形，中间高、两侧缓落；z 轴前后错落制造景深（近大远小）
     跨度经投影核算：最外球缘约占容器宽度 90%，四周仍有安全留白 */
  const N = HOME_CARDS.length;
  const SPAN = 2.9;     // 横向半跨度
  const RISE = 0.58;    // 拱起幅度
  const DEPTH = 1.35;   // 前后景深差（中间近、两侧远 → 投影直径差约 25%）
  const R = 0.55;       // 球半径
  const sphereGeo = new THREE.SphereGeometry(R, 48, 36);
  const spheres = HOME_CARDS.map((c, i) => {
    // 磨砂玻璃 / 哑光陶土：高粗糙度 + 低金属度 + 半透明
    const mat = new THREE.MeshStandardMaterial({
      color: COLORS[c.view],
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8,
      emissive: new THREE.Color(COLORS[c.view]),
      emissiveIntensity: 0.05
    });
    const mesh = new THREE.Mesh(sphereGeo, mat);
    const t = N === 1 ? 0 : (i / (N - 1)) * 2 - 1;   // -1 … 1
    const x = t * SPAN;
    const y = RISE * (1 - t * t) - RISE * 0.5;       // 拱形
    const z = -DEPTH * t * t + 0.1;                  // 中间近、两侧远
    mesh.position.set(x, y, z);

    // 图标徽记：贴在球面正前方，始终面向相机（半透明球体让图标有「嵌在玻璃里」的观感）
    const iconMat = new THREE.SpriteMaterial({
      map: makeSphereIconTexture(c.icon, "#332E26"),
      transparent: true, opacity: 0.9, depthWrite: false
    });
    const sprite = new THREE.Sprite(iconMat);
    sprite.scale.set(R * 1.12, R * 1.12, 1);
    sprite.position.set(0, 0, R * 1.05);   // 略在球面外，避免被前半球遮住
    mesh.add(sprite);

    mesh.userData = { view: c.view, title: c.title, baseY: y, phase: i * 1.1 };
    group.add(mesh);
    return mesh;
  });

  // 射线拾取 + 悬停/点击
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let lastX = 0, lastY = 0;
  let hovered = null;
  function setNdc(clientX, clientY) {
    const rect = container.getBoundingClientRect();
    ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    lastX = clientX - rect.left;
    lastY = clientY - rect.top;
  }
  function pick() {
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(spheres, false);
    return hits.length ? hits[0].object : null;
  }
  /* 悬停高亮：微微提亮 + 轻微放大，代替生硬的轮廓线 */
  function setHovered(hit) {
    if (hit === hovered) return;
    if (hovered) {
      hovered.material.emissiveIntensity = 0.05;
      hovered.scale.setScalar(1);
    }
    hovered = hit;
    if (hovered) {
      hovered.material.emissiveIntensity = 0.26;
      hovered.scale.setScalar(1.05);
    }
  }
  canvas.addEventListener("pointermove", (e) => {
    setNdc(e.clientX, e.clientY);
    const hit = pick();
    setHovered(hit);
    if (hit) {
      canvas.style.cursor = "pointer";
      tip.textContent = hit.userData.title;
      tip.style.left = lastX + "px";
      tip.style.top = lastY + "px";
      tip.classList.add("show");
    } else {
      canvas.style.cursor = "default";
      tip.classList.remove("show");
    }
  });
  canvas.addEventListener("pointerleave", () => {
    setHovered(null);
    tip.classList.remove("show");
    canvas.style.cursor = "default";
  });
  canvas.addEventListener("click", (e) => {
    setNdc(e.clientX, e.clientY);
    const hit = pick();
    if (hit) enterWithTransition(hit.userData.view);   // 保留原路由跳转
  });

  // 尺寸自适应（含 view-B 由 display:none 切换为可见时）
  function resize() {
    const w = W(), h = H();
    if (w <= 0 || h <= 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  if (window.ResizeObserver) new ResizeObserver(resize).observe(container);
  window.addEventListener("resize", resize);
  resize();

  // 动画循环：只有「呼吸」式的有界上下浮动 + 极轻微左右摆动，不作累积漂移（不乱飘）
  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    if (viewB.offsetParent === null) return;          // 隐藏时不渲染
    const t = clock.getElapsedTime();
    for (const s of spheres) {
      s.position.y = s.userData.baseY + Math.sin(t * 0.9 + s.userData.phase) * 0.085;
    }
    group.rotation.y = Math.sin(t * 0.18) * 0.045;    // 有界摆动，模拟静物呼吸
    renderer.render(scene, camera);
  })();

  wheel3D = { resize };
}

backHome.addEventListener("click", goToB);   // 返回键 → 回到轮盘导航页 View B（不回封面 View A）
if (brand) {
  brand.addEventListener("click", goToB);
  /* 品牌区有 role="button" tabindex="0"，必须补键盘触发，否则键盘用户无法激活 */
  brand.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToB(); }
  });
}

/* ---------------- 日夜主题切换（Tailwind dark 模式） ---------------- */
const themeToggle = document.getElementById("theme-toggle");
function applyTheme(dark) {
  document.documentElement.classList.toggle("dark", dark);
  /* 日月图标已改由 CSS 按 .dark 显隐（.ico-moon / .ico-sun）。
     这里绝不能再写 textContent，否则会把两个 <svg> 一并抹掉、只剩一个 emoji。 */
  themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
}
function initTheme() {
  let dark = false;
  try {
    const t = localStorage.getItem("theme");
    dark = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (e) {}
  applyTheme(dark);
}
themeToggle.addEventListener("click", () =>
  applyTheme(!document.documentElement.classList.contains("dark")));

/* ---------------- 动词变位区（实时联网） ---------------- */
const PRONOUNS = ["je", "tu", "il / elle", "nous", "vous", "ils / elles"];
const MODE_ZH = {
  Indicatif: "直陈式", Subjonctif: "虚拟式", Conditionnel: "条件式",
  Impératif: "命令式", Participe: "分词", Infinitif: "不定式", Gérondif: "副动词"
};

const verbInput = document.getElementById("verb-input");
const verbLookup = document.getElementById("verb-lookup");
const verbChips = document.getElementById("verb-chips");
const conjCard = document.getElementById("conjugation-card");
const formBanner = document.getElementById("form-banner");
const formBannerText = document.getElementById("form-banner-text");
let currentMarkdown = "";
let hasResult = false;        // 当前是否已展示查询结果（控制快捷按钮显隐）

/* ---- 搜索框下拉联想：本地高频库优先 + 联网兜底（混合方案） ---- */
const verbSuggest = document.getElementById("verb-suggest");
let localDict = null;        // 本地高频库：[{fr, zh, rank, present}]
let dictLoaded = false;
let dictLoading = false;
let debounceTimer = null;    // 防抖定时器
let suggestAbort = null;     // 当前联网请求的 AbortController
let suggestSeq = 0;          // 请求序列号（竞态防护）

async function loadDict() {
  if (dictLoaded || dictLoading) return;
  dictLoading = true;
  try {
    const r = await fetch("french_dict.json");
    localDict = await r.json();
  } catch (e) {
    localDict = [];
  } finally {
    dictLoaded = true;
    dictLoading = false;
    if (verbInput.value.trim()) onVerbInput();  // 若已输入则重新联想
  }
}

function localMatches(prefix) {
  if (!localDict) return [];
  prefix = prefix.toLowerCase();
  return localDict.filter(d => d.fr.toLowerCase().startsWith(prefix));
}

function hideSuggest() {
  verbSuggest.classList.add("hidden");
  verbSuggest.innerHTML = "";
}

function renderSuggestions(localItems, netItems, opts) {
  const val = verbInput.value.trim();
  if (!val) { hideSuggest(); return; }
  let merged = localItems.concat(netItems || []);
  const seen = new Set();
  merged = merged.filter(it => { if (seen.has(it.fr)) return false; seen.add(it.fr); return true; });
  merged = merged.slice(0, 12);
  let html = "";
  if (opts && opts.loading) {
    html += '<div class="flex items-center gap-2 px-4 py-3 text-sm text-mg-400 dark:text-fin-500">' +
      '<span class="inline-block w-4 h-4 border-2 border-mg-300 dark:border-fin-500 border-t-transparent rounded-full animate-spin"></span>' +
      '正在联网搜索…</div>';
  }
  if (opts && opts.error) {
    html += '<div class="px-4 py-3 text-sm text-mg-400 dark:text-fin-500">' + opts.error + '</div>';
  }
  merged.forEach(it => {
    const cloud = it.source === "net"
      ? '<span class="ml-2 text-xs text-mg-400 dark:text-fin-500" title="来自联网补充">☁</span>' : "";
    const zh = it.zh ? '<span class="text-xs text-mg-400 dark:text-fin-500 ml-2">' + escapeHtml(it.zh) + '</span>' : "";
    html += '<button type="button" data-word="' + escapeHtml(it.fr) + '" class="suggest-item w-full text-left flex items-center justify-between px-4 py-2.5 hover:bg-mg-200 dark:hover:bg-fin-800 transition text-mg-800 dark:text-fin-100">' +
      '<span class="font-medium">' + escapeHtml(it.fr) + zh + '</span>' + cloud + '</button>';
  });
  if (!html) {
    // 没有任何候选结果时直接隐藏下拉，不再展示「未找到…」提示
    hideSuggest();
    return;
  }
  verbSuggest.innerHTML = html;
  verbSuggest.classList.remove("hidden");
  verbSuggest.querySelectorAll(".suggest-item").forEach(btn => {
    btn.addEventListener("mousedown", e => {   // mousedown 防止 input blur 抢先关闭
      e.preventDefault();
      selectSuggestion(btn.dataset.word);
    });
  });
}

function selectSuggestion(word) {
  verbInput.value = word;
  hideSuggest();
  lookupVerb(word);
}

function onVerbInput() {
  const val = verbInput.value.trim();
  updateChips();                // 开始输入即隐藏快捷按钮（空且无结果才显示）
  if (!val) { hideSuggest(); return; }
  if (!dictLoaded) {
    // 词库尚未加载完：先提示，loadDict 完成后会再触发
    verbSuggest.innerHTML = '<div class="px-4 py-3 text-sm text-mg-400 dark:text-fin-500">正在加载词库…</div>';
    verbSuggest.classList.remove("hidden");
    loadDict();
    return;
  }
  const localItems = localMatches(val).map(d => ({ fr: d.fr, zh: d.zh, source: "local" }));
  if (localItems.length >= 3) {
    // 本地足够（>=3）→ 直接渲染，绝不发网络请求
    if (suggestAbort) { suggestAbort.abort(); suggestAbort = null; }
    if (debounceTimer) clearTimeout(debounceTimer);
    renderSuggestions(localItems, [], {});
    return;
  }
  // 本地不足 3 个 → 防抖 500ms 后联网兜底
  renderSuggestions(localItems, [], { loading: true });
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const mySeq = ++suggestSeq;
    if (suggestAbort) suggestAbort.abort();
    const ac = new AbortController();
    suggestAbort = ac;
    try {
      const r = await fetch("/api/suggest?prefix=" + encodeURIComponent(val), { signal: ac.signal });
      const data = await r.json();
      if (mySeq !== suggestSeq) return;  // 竞态防护：已有更新的请求
      const net = (data.verbs || []).map(v => ({ fr: v, zh: "", source: "net" }));
      renderSuggestions(localItems, net, {});
    } catch (err) {
      if (err.name === "AbortError") return;
      if (mySeq !== suggestSeq) return;
      renderSuggestions(localItems, [], { error: "联网搜索失败，请重试" });
    }
  }, 500);
}

verbInput.addEventListener("input", onVerbInput);
verbInput.addEventListener("blur", () => setTimeout(hideSuggest, 150));
verbInput.addEventListener("keydown", e => {
  if (e.key === "Enter") { hideSuggest(); lookupVerb(); }
});
verbLookup.addEventListener("click", () => { hideSuggest(); lookupVerb(); });
loadDict();

// 常用动词快捷入口（点击即联网查询；本地仅作离线兜底）
const POPULAR = ["être", "avoir", "faire", "aller", "parler", "manger", "finir", "vendre", "pouvoir", "prendre"];

function renderVerbChips() {
  verbChips.innerHTML = "";
  POPULAR.forEach(v => {
    const c = document.createElement("button");
    c.className = "rounded-full border border-mg-200 dark:border-fin-800 bg-mg-100 dark:bg-fin-900 text-sm text-mg-500 dark:text-fin-400 px-3 py-1.5 hover:border-mg-accent dark:hover:border-fin-accent hover:text-mg-accent dark:hover:text-fin-accent transition";
    c.textContent = v;
    c.onclick = () => { verbInput.value = v; lookupVerb(v); };
    verbChips.appendChild(c);
  });
}

// 常用动词快捷按钮：仅当用户未输入任何内容 且 当前没有查询结果时才显示
function updateChips() {
  const empty = verbInput.value.trim() === "";
  if (empty && !hasResult) verbChips.classList.remove("hidden");
  else verbChips.classList.add("hidden");
}

function buildMarkdown(data) {
  const L = ["je", "tu", "il / elle", "nous", "vous", "ils / elles"];
  let md = "";
  if (data.is_form) {
    md += `**【识别提示】您输入的 ${data.verb} 是原形动词 ${data.infinitive} 在 ${data.detected_tense} 下，针对人称 ${data.detected_person} 的变位。**\n\n`;
  }
  md += `## ${data.canonical} · 法语动词变位（leconjugueur.lefigaro.fr）\n\n`;
  for (const m of data.modes) {
    md += `### ${m.mode} · ${MODE_ZH[m.mode] || ""}\n\n`;
    for (const t of m.tenses) {
      md += `**${t.name}**\n\n| 人称 | 变位 |\n| --- | --- |\n`;
      L.forEach((p, i) => { md += `| ${p} | ${t.forms[i]} |\n`; });
      md += `\n`;
    }
  }
  if (data.other && data.other.length) {
    md += `### 其他形式\n\n`;
    for (const o of data.other) {
      md += `**${o.mode} · ${MODE_ZH[o.mode] || ""}**：${o.forms.join(" / ")}\n\n`;
    }
  }
  return md;
}

function renderWeb(data) {
  let html = `
    <div class="flex items-baseline gap-3 flex-wrap mb-1">
      <span class="text-3xl font-serif italic">${data.canonical}</span>
      <span class="text-xs text-mg-400 dark:text-fin-500">实时联网 · leconjugueur.lefigaro.fr</span>
    </div>`;
  for (const m of data.modes) {
    html += `<div class="mt-6"><h3 class="tense-head inline-block text-base font-bold rounded-lg px-3 py-1.5 mb-3">${m.mode} · ${MODE_ZH[m.mode] || ""}</h3>`;
    for (const t of m.tenses) {
      html += `<div class="mb-4"><div class="text-sm font-bold uppercase tracking-wide text-mg-700 dark:text-fin-200 mb-1.5 pb-1.5 border-b border-dashed border-mg-200 dark:border-fin-800">${t.name}</div>`;
      t.forms.forEach((f, i) => {
        html += `<div class="grid grid-cols-[120px_1fr] items-center py-1.5 even:bg-mg-200/40 dark:even:bg-fin-800/40 rounded">
          <span class="text-sm font-bold text-mg-700 dark:text-fin-200">${PRONOUNS[i]}</span>
          <span class="font-serif text-lg">${f}</span></div>`;
      });
      html += `</div>`;
    }
    html += `</div>`;
  }
  if (data.other && data.other.length) {
    html += `<div class="mt-6"><h3 class="tense-head inline-block text-base font-bold rounded-lg px-3 py-1.5 mb-3">其他形式</h3>`;
    for (const o of data.other) {
      html += `<div class="text-xs font-semibold text-mg-400 dark:text-fin-500 mb-1">${o.mode} · ${MODE_ZH[o.mode] || ""}</div>
        <div class="text-sm text-mg-500 dark:text-fin-400 mb-3">${o.forms.join(" / ")}</div>`;
    }
    html += `</div>`;
  }
  html += `<div class="mt-6"><button id="copy-md" class="rounded-xl text-mg-500 dark:text-fin-400 hover:bg-mg-200 dark:hover:bg-fin-800 text-sm font-medium px-4 py-2.5 transition">📋 复制为 Markdown</button></div>`;
  conjCard.innerHTML = html;
  currentMarkdown = buildMarkdown(data);
  const copyBtn = document.getElementById("copy-md");
  if (copyBtn) copyBtn.onclick = () => copyText(currentMarkdown);
}

function renderLocal(verb) {
  const data = VERBS[verb.toLowerCase()];
  if (!data) return false;
  let html = `
    <div class="flex items-baseline gap-3 flex-wrap mb-1">
      <span class="text-3xl font-serif italic">${verb}</span>
      <span class="text-xs text-mg-400 dark:text-fin-500">${data.group} · 离线缓存</span>
    </div>
    <div class="text-sm text-mg-accent dark:text-fin-accent mb-5">${data.zh}</div>`;
  for (const [tense, forms] of Object.entries(data.tenses)) {
    html += `<div class="mb-5"><div class="text-sm font-bold uppercase tracking-wide text-mg-700 dark:text-fin-200 mb-2 pb-2 border-b border-dashed border-mg-200 dark:border-fin-800">${tense}</div><div class="conj-grid">`;
    forms.forEach((f, i) => {
      html += `<div class="conj-card c${i}"><span class="conj-pro">${PRONOUNS[i]}</span><span class="conj-form">${f}</span></div>`;
    });
    html += `</div></div>`;
  }
  conjCard.innerHTML = html;
  return true;
}

function showError(msg) {
  conjCard.innerHTML = `<div class="text-center text-mg-400 dark:text-fin-500 py-8">${msg}</div>`;
}

async function lookupVerb(verb) {
  verb = (verb || verbInput.value).trim();
  if (!verb) { showError("请输入一个法语动词。"); return; }
  hasResult = false; updateChips();
  conjCard.innerHTML = `<p class="text-mg-500 dark:text-fin-400 text-sm">正在联网查询「${escapeHtml(verb)}」的变位…</p>`;
  try {
    const res = await fetch("/api/conjugate?verb=" + encodeURIComponent(verb));
    const data = await res.json();
    if (data.found) {
      // 若输入是某个变位形式（非原形），用横幅醒目展示识别结果
      if (data.is_form) {
        formBannerText.textContent =
          `【识别提示】您输入的 ${data.verb} 是原形动词 ${data.infinitive} 在 ${data.detected_tense} 下，针对人称 ${data.detected_person} 的变位。`;
        formBanner.classList.remove("hidden");
      } else {
        formBanner.classList.add("hidden");
      }
      renderWeb(data);
      hasResult = true; updateChips();
    } else {
      // 非动词 / 拼写错误：严格按规则提示，绝不编造
      formBanner.classList.add("hidden");
      showError(data.message || "这不是一个法语动词");
    }
  } catch (e) {
    // 网络失败 → 尝试本地缓存兜底（离线无法做变位形式反查，隐藏横幅）
    formBanner.classList.add("hidden");
    if (!renderLocal(verb)) {
      showError("联网查询失败，且本地无「" + escapeHtml(verb) + "」的离线缓存。请检查网络后重试。");
    } else {
      hasResult = true; updateChips();
    }
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => flash("已复制 Markdown 到剪贴板"),
      () => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}
function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); flash("已复制 Markdown 到剪贴板"); }
  catch (e) { flash("复制失败，请手动选择"); }
  document.body.removeChild(ta);
}
let flashTimer = null;
function flash(msg) {
  let el = document.getElementById("flash");
  if (!el) {
    el = document.createElement("div");
    el.id = "flash"; el.className = "flash";
    document.body.appendChild(el);
  }
  el.textContent = msg; el.classList.add("show");
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

verbLookup.addEventListener("click", () => lookupVerb());
verbInput.addEventListener("keydown", e => { if (e.key === "Enter") lookupVerb(); });

/* ---------------- 词典与翻译（AI 大模型） ---------------- */
const dictSearch = document.getElementById("dict-search");
const dictGo = document.getElementById("dict-go");
const dictResult = document.getElementById("dict-result");
const dictCorrection = document.getElementById("dict-correction");
const dictModeHint = document.getElementById("dict-mode-hint");
const dictModel = document.getElementById("dict-model");
const dictDrawer = document.getElementById("dict-drawer");
const dictDrawerBody = document.getElementById("dict-drawer-body");
const dictDrawerClose = document.getElementById("dict-drawer-close");
const dictDrawerBackdrop = document.getElementById("dict-drawer-backdrop");
const toastEl = document.getElementById("toast");

let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden");
  requestAnimationFrame(() => toastEl.classList.add("show"));
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
    toastTimer = setTimeout(() => toastEl.classList.add("hidden"), 300);
  }, 2200);
}

/* 前端模式判断（与后端一致）：无中间空格 => 单词；含空格或句末标点 => 句子 */
function detectMode(q) {
  q = (q || "").trim();
  if (!q) return "word";
  if (/\s/.test(q)) return "sentence";
  if (/[.!?…]$/.test(q)) return "sentence";
  return "word";
}

/* 极简、安全的 Markdown 渲染（仅处理本项目用到的子集，先把文本转义再补回标签，杜绝注入） */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function inlineMd(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}
function renderMarkdown(md) {
  const lines = escapeHtml(md).split("\n");
  let html = "", inUl = false, inOl = false;
  const closeLists = () => {
    if (inUl) { html += "</ul>"; inUl = false; }
    if (inOl) { html += "</ol>"; inOl = false; }
  };
  for (let raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) { closeLists(); continue; }
    let m;
    if ((m = line.match(/^###\s+(.*)$/))) { closeLists(); html += `<h4>${m[1]}</h4>`; }
    else if ((m = line.match(/^##\s+(.*)$/))) { closeLists(); html += `<h3>${m[1]}</h3>`; }
    else if ((m = line.match(/^#\s+(.*)$/))) { closeLists(); html += `<h3>${m[1]}</h3>`; }
    else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      if (!inUl) { closeLists(); html += "<ul>"; inUl = true; }
      html += `<li>${inlineMd(m[1])}</li>`;
    }
    else if ((m = line.match(/^\s*\d+\.\s+(.*)$/))) {
      if (!inOl) { closeLists(); html += "<ol>"; inOl = true; }
      html += `<li>${inlineMd(m[1])}</li>`;
    }
    else if ((m = line.match(/^>\s?(.*)$/))) { closeLists(); html += `<blockquote>${inlineMd(m[1])}</blockquote>`; }
    else { closeLists(); html += `<p>${inlineMd(line)}</p>`; }
  }
  closeLists();
  return html;
}

/* 句子分词：按空格拆分；单词（含省音 j'ai / l'heure）包成可点击 span；标点不包裹 */
function tokenizeSentence(sentence) {
  const re = /(\s+)|([\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*)|([^\s\p{L}\p{M}]+)/gu;
  let out = "", m;
  while ((m = re.exec(sentence)) !== null) {
    if (m[1]) out += m[1];
    else if (m[2]) {
      const w = escapeHtml(m[2]);
      out += `<span class="clickable-word" data-word="${w.replace(/"/g, "&quot;")}" title="点击查询该词">${w}</span>`;
    } else {
      out += escapeHtml(m[3]);
    }
  }
  return out;
}

async function doDict(q, opts = {}) {
  q = (q || "").trim();
  const drawer = !!opts.drawer;
  if (!q) { showToast("请输入要查询的内容"); return; }

  const mode = detectMode(q);

  const target = drawer ? dictDrawerBody : dictResult;
  if (!drawer) {
    dictCorrection.classList.add("hidden");
    dictResult.innerHTML = `<div class="dict-loading">正在向大模型请求…</div>`;
  } else {
    dictDrawerBody.innerHTML = `<div class="dict-loading">正在查询该词…</div>`;
  }

  let res;
  try {
    const r = await fetch("/api/dict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q, mode }),
    });
    res = await r.json();
  } catch (e) {
    target.innerHTML = `<div class="dict-error">网络请求失败，请确认本地服务（server.py）已启动且能访问。</div>`;
    return;
  }

  if (!res.ok) {
    if (res.reason === "no_key") target.innerHTML = noKeyCard(mode);
    else if (res.reason === "llm_error") {
      const msg = (res.message || "").replace(/</g, "");
      const congested = /429|1305|访问量过大|Too Many|rate limit|rate_limit/i.test(msg);
      target.innerHTML = congested
        ? `<div class="dict-error">
             <strong>模型当前访问量过大（429）</strong><br>
             服务商（智谱）正在限流，这是临时性的——请稍等几秒后重试。<br>
             若反复出现，可把模型换成更稳定的 <code>glm-4-flash</code> 或 <code>glm-4-plus</code>：
             重跑 <code>set_llm_key.ps1</code> 时修改 Model 即可。
           </div>`
        : `<div class="dict-error">大模型调用出错：${msg}</div>`;
    }
    else target.innerHTML = `<div class="dict-error">查询失败，请稍后再试。</div>`;
    return;
  }
  renderDictResult(res, target, drawer);
}

/* 流式查词：调用 /api/dict/stream，结果边生成边显示，显著降低等待感 */
let _dictAbort = null;
async function doDictStream(q) {
  q = (q || "").trim();
  if (!q) { showToast("请输入要查询的内容"); return; }
  const mode = detectMode(q);
  currentDictWord = q; currentDictMode = mode; updateFavBar();

  if (_dictAbort) { try { _dictAbort.abort(); } catch (e) {} }
  _dictAbort = new AbortController();

  dictCorrection.classList.add("hidden");
  dictResult.innerHTML = `<div class="dict-loading">正在向大模型请求…</div>`;

  let acc = "";
  let started = false;
  let renderTimer = null;
  let mdEl = null;
  const ensureStructure = (evMode) => {
    if (started) return;
    started = true;
    dictResult.innerHTML = "";
    if (evMode === "sentence") {
      const s = document.createElement("div");
      s.className = "sentence-tokens";
      s.innerHTML = tokenizeSentence(q);
      dictResult.appendChild(s);
    }
    mdEl = document.createElement("div");
    mdEl.className = "dict-md";
    mdEl.innerHTML = `<span class="dict-stream-caret">▍</span>`;
    dictResult.appendChild(mdEl);
  };
  const flushRender = () => {
    renderTimer = null;
    if (mdEl) mdEl.innerHTML = renderMarkdown(acc) + `<span class="dict-stream-caret">▍</span>`;
  };
  const scheduleRender = () => { if (!renderTimer) renderTimer = setTimeout(flushRender, 90); };

  const onEvent = (ev) => {
    if (ev.type === "meta") {
      ensureStructure(ev.mode);
      if (ev.correction) {
        dictCorrection.innerHTML = correctionHTML(ev.correction);
        dictCorrection.classList.remove("hidden");
      }
    } else if (ev.type === "delta") {
      if (!started) ensureStructure(mode);
      acc += ev.content;
      scheduleRender();
    } else if (ev.type === "done") {
      acc = ev.content || acc;
      if (!started) ensureStructure(mode);
      if (renderTimer) { clearTimeout(renderTimer); renderTimer = null; }
      if (mdEl) mdEl.innerHTML = renderMarkdown(acc);
      bindSentenceClicks(dictResult);
      currentDictMeaning = extractCoreMeaning(dictResult);
    } else if (ev.type === "error") {
      dictResult.innerHTML = `<div class="dict-error">${escapeHtml(ev.message || "查询失败，请稍后再试。")}</div>`;
    }
  };

  try {
    const r = await fetch("/api/dict/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q, mode }),
      signal: _dictAbort.signal,
    });
    if (!r.ok) {
      let msg = "查询失败，请稍后再试。";
      try { const e = await r.json(); if (e && e.message) msg = e.message; } catch (_) {}
      dictResult.innerHTML = `<div class="dict-error">${escapeHtml(msg)}</div>`;
      return;
    }
    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n\n")) >= 0) {
          const frame = buf.slice(0, idx);
          buf = buf.slice(idx + 2);
          const dl = frame.split("\n").find((l) => l.startsWith("data:"));
          if (!dl) continue;
          let ev;
          try { ev = JSON.parse(dl.slice(5).trim()); } catch (_) { continue; }
          onEvent(ev);
        }
      }
      if (buf.trim()) {
        const dl = buf.split("\n").find((l) => l.startsWith("data:"));
        if (dl) { try { onEvent(JSON.parse(dl.slice(5).trim())); } catch (_) {} }
      }
    };
    await pump();
    if (started && mdEl) { mdEl.innerHTML = renderMarkdown(acc); bindSentenceClicks(dictResult); currentDictMeaning = extractCoreMeaning(dictResult); }
  } catch (e) {
    if (e && e.name === "AbortError") return;
    dictResult.innerHTML = `<div class="dict-error">网络请求失败，请确认本地服务（server.py）已启动且能访问。</div>`;
  } finally {
    _dictAbort = null;
  }
}

function correctionHTML(text) {
  const m = String(text).match(/^【(.+?)】\s*(.*)$/s);
  const tag = m ? m[1] : "提示";
  const body = m ? m[2] : text;
  return `<span class="dc-ico" aria-hidden="true">✦</span>` +
         `<span class="dc-tag">${escapeHtml(tag)}</span>` +
         `<span class="dc-body">${escapeHtml(body)}</span>`;
}

function renderDictResult(res, target, drawer) {
  if (res.correction) {
    if (drawer) {
      target.innerHTML = `<div class="dict-correction dict-correction-inline">${correctionHTML(res.correction)}</div>`;
    } else {
      dictCorrection.innerHTML = correctionHTML(res.correction);
      dictCorrection.classList.remove("hidden");
    }
  } else if (!drawer) {
    dictCorrection.classList.add("hidden");
  }
  let body = "";
  if (res.mode === "sentence") {
    body += `<div class="sentence-tokens">${tokenizeSentence(res.q)}</div>`;
  }
  body += `<div class="dict-md">${renderMarkdown(res.content || "")}</div>`;
  if (drawer) target.innerHTML += body;
  else target.innerHTML = body;
  if (!drawer) bindSentenceClicks(dictResult);
}

function bindSentenceClicks(container) {
  container.querySelectorAll(".clickable-word").forEach(el => {
    el.addEventListener("click", () => {
      const w = (el.getAttribute("data-word") || "").trim();
      if (!w) return;
      dictSearch.value = w;            // 回填搜索框
      openDrawer();
      doDict(w, { drawer: true });     // 即时单词查询，不刷新页面
    });
  });
}

function noKeyCard(mode) {
  return `<div class="dict-setup">
    <h3>尚未接入 AI 大模型</h3>
    <p>「词典与翻译」由大模型驱动。请在启动本地服务时配置以下环境变量（支持 OpenAI / DeepSeek / Moonshot / 通义千问 等任意 OpenAI 兼容接口）：</p>
    <pre>LLM_API_KEY="你的Key"<br>LLM_BASE_URL="https://api.openai.com/v1"   # 可选<br>LLM_MODEL="gpt-4o-mini"               # 可选</pre>
    <p class="dict-setup-tip">配置后重启 <code>server.py</code> 即可获得带纠错的 AI 词典与整句翻译。</p>
  </div>`;
}

/* 抽屉开关 */
function openDrawer() {
  dictDrawerBackdrop.classList.remove("hidden");
  dictDrawer.classList.add("open");
  dictDrawer.setAttribute("aria-hidden", "false");
}
function closeDrawer() {
  dictDrawer.classList.remove("open");
  dictDrawer.setAttribute("aria-hidden", "true");
  setTimeout(() => dictDrawerBackdrop.classList.add("hidden"), 300);
}
dictDrawerClose.addEventListener("click", closeDrawer);
dictDrawerBackdrop.addEventListener("click", closeDrawer);

/* 触发查询：按钮 + 回车 */
dictGo.addEventListener("click", () => doDictStream(dictSearch.value));
dictSearch.addEventListener("keydown", e => { if (e.key === "Enter") doDictStream(dictSearch.value); });

/* 模型切换：在页面内直接换模型，无需重跑脚本或重启服务（写入本地隐藏密钥文件，服务端每次请求实时读取） */

/* 服务就绪探测：页面打开即 ping /api/model，连不上时显示醒目横幅，
   让用户立刻知道是「本地服务没启动」还是「网络被拦截」，而不是点查询才报错 */
let _svcBanner = null;
function showServiceBanner(msg) {
  const v = document.getElementById("view-dictionary");
  if (!v) return;
  if (!_svcBanner) {
    _svcBanner = document.createElement("div");
    _svcBanner.id = "service-banner";
    _svcBanner.className = "service-banner";
    v.insertBefore(_svcBanner, v.firstChild);
  }
  _svcBanner.textContent = msg;
  _svcBanner.classList.remove("hidden");
}
function hideServiceBanner() { if (_svcBanner) _svcBanner.classList.add("hidden"); }

function syncModelSelect(d) {
  if (!dictModel || !d || !d.model) return;
  let opt = Array.from(dictModel.options).find(o => o.value === d.model);
  if (!opt) {
    opt = document.createElement("option");
    opt.value = d.model; opt.textContent = d.model;
    dictModel.appendChild(opt);
  }
  dictModel.value = d.model;
}

function checkService() {
  fetch("/api/model", { cache: "no-store" })
    .then(r => { if (!r.ok) throw new Error("bad status " + r.status); return r.json(); })
    .then(d => { hideServiceBanner(); syncModelSelect(d); })
    .catch(() => showServiceBanner(
      "⚠ 无法连接本地服务（server.py）。请在你的电脑终端运行 python server.py 后刷新本页；" +
      "若已运行，请直接用浏览器打开 http://127.0.0.1:8000/（预览面板可能受网络隔离限制）。"));
}

if (dictModel) {
  dictModel.addEventListener("change", () => {
    const model = dictModel.value;
    dictModel.disabled = true;
    fetch("/api/setmodel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model }),
    }).then(r => r.json()).then(d => {
      if (d && d.ok) showToast("已切换模型：" + model + "（即时生效）");
      else showToast("模型切换失败，请检查本地密钥文件");
    }).catch(() => showToast("切换失败：无法连接本地服务")).finally(() => {
      dictModel.disabled = false;
    });
  });
}

/* 进入词典功能区时，探测一次本地服务并同步当前模型到下拉框 */
const _setFunction = setFunction;
setFunction = function (view) {
  _setFunction(view);
  if (view === "dictionary") checkService();
  if (view === "reading") renderReadingList();   // 进入阅视界即拉取最新新闻
};

/* ---------------- 阅视界 ---------------- */
const readingList = document.getElementById("reading-list");
const readingDetail = document.getElementById("reading-detail");
const readingRefresh = document.getElementById("reading-refresh");

/* 阅视界新闻列表：浏览器端抓取 + 解析 RSS 全文（详见上方配置说明，彻底无新标签页跳转）。 */

function loadNewsCache() {
  try {
    const c = JSON.parse(localStorage.getItem(NEWS_CACHE_KEY) || "null");
    if (c && c.ts && (Date.now() - c.ts) < NEWS_CACHE_TTL) return c.items || [];
  } catch (e) {}
  return null;
}
function saveNewsCache(items) {
  try { localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({ ts: Date.now(), items })); } catch (e) {}
}

/* 文章级缓存：把已抓取的站内全文按链接存本地，下次（同会话或 20 分钟缓存窗口内）点开同一文章直接秒开 */
const ARTICLE_CACHE_KEY = "reading_article_cache_v2";
function loadArticleCache() {
  try { return JSON.parse(localStorage.getItem(ARTICLE_CACHE_KEY) || "{}") || {}; } catch (e) { return {}; }
}
function saveArticleCache(map) {
  try { localStorage.setItem(ARTICLE_CACHE_KEY, JSON.stringify(map)); } catch (e) {}
}

/* 经多个 CORS 代理「并行竞速」抓取目标 URL（XML / HTML）。
   关键优化：同时发起所有代理请求，取第一个成功者（Promise.any），
   避免旧逻辑串行逐个等待超时（最坏要 4×超时 秒）。全部失败才返回 null。 */
async function fetchViaProxies(targetUrl, { timeout = 9000, minLen = 200, validate } = {}) {
  const attempts = CORS_PROXIES.map((mk) => {
    const isGet = (CORS_PROXIES[1] === mk);
    const url = mk(targetUrl);
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeout);
    return (async () => {
      try {
        const res = await fetch(url, { cache: "no-store", signal: ac.signal });
        if (!res.ok) throw new Error("status " + res.status);
        let text = await res.text();
        if (isGet) { try { text = (JSON.parse(text).contents) || ""; } catch (e) { text = ""; } }
        if (!text || text.length < minLen) throw new Error("empty");
        if (validate && !validate(text)) throw new Error("invalid");
        return text;
      } finally { clearTimeout(t); }
    })();
  });
  try {
    return await Promise.any(attempts);
  } catch (e) {
    return null;   // 所有代理均失败
  }
}
function stripHtml(s) {
  const d = document.createElement("div");
  d.innerHTML = s || "";
  return (d.textContent || "").replace(/\s+/g, " ").trim();
}
function byDateDesc(a, b) {
  const ta = Date.parse(a.pubDate), tb = Date.parse(b.pubDate);
  const na = isNaN(ta), nb = isNaN(tb);
  if (na && nb) return 0;
  if (na) return 1;
  if (nb) return -1;
  return tb - ta;
}
let readingRenderTimer = null;
function scheduleRenderReading() {
  if (readingRenderTimer) return;
  readingRenderTimer = setTimeout(() => {
    readingRenderTimer = null;
    renderReadingCards();
  }, 400);
}

/* 经 CORS 代理「并行竞速」取回某源的原始 RSS/Atom XML（请求来自用户浏览器，不受沙箱 IP 封锁） */
async function fetchFeedViaProxy(feedUrl) {
  return fetchViaProxies(feedUrl, {
    timeout: 9000,
    minLen: 200,
    validate: t => /<rss|<feed|<item|<entry/i.test(t)
  });
}

/* 解析 RSS/Atom XML，抽取带全文的条目（content:encoded / atom content） */
function parseFeedXml(xmlText, sourceName) {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  if (doc.querySelector("parsererror")) return [];
  let nodes = Array.from(doc.querySelectorAll("item"));
  let isAtom = false;
  if (!nodes.length) { nodes = Array.from(doc.querySelectorAll("entry")); isAtom = true; }
  const out = [];
  for (const n of nodes) {
    const title = textOf(n, "title");
    let link = textOf(n, "link");
    if (isAtom) {
      const lk = n.querySelector("link[rel='alternate']") || n.querySelector("link");
      link = lk ? (lk.getAttribute("href") || lk.textContent || link) : link;
    } else {
      const lk = n.querySelector("link");
      if (lk && lk.getAttribute("href")) link = lk.getAttribute("href");
    }
    const pub = isAtom ? (textOf(n, "updated") || textOf(n, "published")) : textOf(n, "pubDate");
    const summary = isAtom ? textOf(n, "summary") : textOf(n, "description");
    const content = getContent(n);
    const thumbnail = getThumb(n, content);
    const fullLen = (content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
    const summLen = (summary || "").replace(/\s+/g, " ").trim().length;
    if (fullLen < 120 && summLen < 120) continue;   // 丢弃仅标题的噪声条目
    out.push({
      title: title || "无标题",
      tag: sourceName,
      fr: stripHtml(summary) || stripHtml(content).slice(0, 200),
      link: link || "",
      pubDate: pub || "",
      thumbnail: thumbnail,
      isFull: fullLen > 400,
      fullHtml: content || ""
    });
  }
  return out;
}
function textOf(node, tag) {
  const el = node.getElementsByTagName(tag)[0] || node.querySelector(tag);
  return el ? (el.textContent || "").trim() : "";
}
function getContent(node) {
  const enc = node.getElementsByTagName("content:encoded")[0];
  if (enc && (enc.textContent || "").trim()) return enc.textContent;
  for (const c of Array.from(node.children)) {
    const ln = (c.localName || "").toLowerCase();
    if (ln === "content") {
      const html = c.innerHTML || c.textContent;
      if (html && html.trim()) return html;
    }
  }
  return "";
}
function getThumb(node, contentHtml) {
  const mt = node.getElementsByTagName("media:thumbnail")[0] || node.getElementsByTagName("media:content")[0];
  if (mt) { const u = mt.getAttribute("url") || mt.getAttribute("href"); if (u) return u; }
  const enc = node.getElementsByTagName("enclosure")[0];
  if (enc && /image/.test(enc.getAttribute("type") || "")) { const u = enc.getAttribute("url"); if (u) return u; }
  if (contentHtml) { const m = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i); if (m) return m[1]; }
  return "";
}

/* 本机 server.py 兜底：用户本机运行，IP 不被源站封锁。返回 {html} / {text} 或 null。 */
async function fetchArticleViaServer(link) {
  try {
    const res = await fetch("/api/fetch-article?url=" + encodeURIComponent(link), { cache: "no-store" });
    if (res.ok) {
      const d = await res.json();
      if (d.ok && d.html) return { html: d.html };
      if (d.ok && d.text) return { text: d.text };
    }
  } catch (e) {}
  return null;
}

/* 站内抓取文章页正文（段落数组）：
   关键提速——浏览器端 4 个 CORS 代理「并行竞速」与「本机 server.py 兜底」同时发起、谁先成功用谁
   （旧逻辑是浏览器代理全部失败后才串行走 server，要多等几秒）。两者任一成功即解析正文，
   请求全部来自用户浏览器/本机，不受沙箱 IP 封锁。 */
async function fetchArticleInSite(link) {
  const tasks = [];
  // ① 浏览器端 CORS 代理并行竞速（直接拿原文 HTML）
  tasks.push((async () => {
    const html = await fetchViaProxies(link, { timeout: 9000, minLen: 600 });
    if (!html) throw new Error("browser proxies failed");
    return { html };
  })());
  // ② 本机 server.py 兜底（并行，不等浏览器失败）
  tasks.push((async () => {
    const r = await fetchArticleViaServer(link);
    if (!r) throw new Error("server failed");
    return r;
  })());
  try {
    const winner = await Promise.any(tasks);
    let paras;
    if (winner.html !== undefined) {
      const doc = new DOMParser().parseFromString(winner.html, "text/html");
      paras = extractArticleText(doc);
    } else {
      paras = (winner.text || "").split(/\n{2,}/).map(s => s.replace(/\s+/g, " ").trim()).filter(s => s.length > 40);
    }
    if (paras.length >= 2) return paras;
    throw new Error("parse too few");
  } catch (e) {
    throw new Error("无法获取原文正文");
  }
}

/* 从已解析文章页文档中提取核心正文段落（剥离导航/脚本/广告等无用节点，只留正文块级文本）。 */
function extractArticleText(doc) {
  let root = doc.querySelector("article") || doc.querySelector("main") ||
             doc.querySelector(".content") || doc.querySelector("#content") || doc.body;
  if (!root) return [];
  root.querySelectorAll("script,style,noscript,nav,header,footer,aside,form,iframe,svg,.ad,.banner,figure,.related,.recommend,.social").forEach(n => n.remove());
  const blocks = [];
  root.querySelectorAll("p,h2,h3,h1,h4,li,blockquote").forEach(el => {
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (t.length > 40) blocks.push(t);
  });
  if (blocks.length < 2) {
    const t = (root.textContent || "").replace(/\s+/g, " ").trim();
    if (t.length > 200) return t.split(/(?:\n{2,}|\.\s+)/).map(s => s.trim()).filter(s => s.length > 40);
  }
  return blocks;
}

/* 并发抓取全部源（限流 4），边到边渲染，最终写入缓存 */
async function fetchAllFeeds() {
  const seen = new Set(readingItems.map(i => i.link || i.title));
  let idx = 0;
  async function worker() {
    while (idx < RSS_FEEDS.length) {
      const feed = RSS_FEEDS[idx++];
      try {
        const xml = await fetchFeedViaProxy(feed.url);
        if (!xml) continue;
        const items = parseFeedXml(xml, feed.name);
        let added = false;
        for (const it of items) {
          const key = it.link || it.title;
          if (!key || seen.has(key)) continue;
          seen.add(key); readingItems.push(it); added = true;
        }
        if (added) { readingItems.sort(byDateDesc); scheduleRenderReading(); }
      } catch (e) {}
    }
  }
  const pool = [];
  for (let i = 0; i < Math.min(4, RSS_FEEDS.length); i++) pool.push(worker());
  await Promise.all(pool);
  // 浏览器端代理若全部失败（极少见，多见于本机网络特殊），回退到本机 server.py 直连抓取
  if (!readingItems.length) {
    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const raw = (data && Array.isArray(data.items)) ? data.items : [];
        for (const it of raw) {
          const key = it.link || it.title;
          if (!key || seen.has(key)) continue;
          seen.add(key);
          readingItems.push({
            title: it.title || "无标题",
            tag: it.source || "未知来源",
            fr: it.summary || "",
            link: it.link || "",
            pubDate: it.pubDate || "",
            thumbnail: it.thumbnail || "",
            isFull: !!it.is_full,
            fullHtml: it.full_html || ""
          });
        }
      }
    } catch (e) {}
  }
  if (readingItems.length) { saveNewsCache(readingItems); renderReadingCards(); prefetchTopSummaries(); }
  else { readingList.innerHTML = readingErrorHTML("暂时无法连接新闻源，请检查网络后重试"); }
}

/* 拉取权威法语新闻：先出缓存（秒开），再后台刷新最新全文 */
async function renderReadingList() {
  readingDetail.classList.add("hidden");
  readingList.classList.remove("hidden");
  const cached = loadNewsCache();
  if (cached && cached.length) {
    readingItems = cached.slice();
    readingItems.sort(byDateDesc);
    renderReadingCards();
  } else {
    readingList.innerHTML = `<div class="reading-loading">正在从权威法语源加载全文（首次约需数秒）…</div>`;
  }
  fetchAllFeeds();
}

/* 渲染新闻卡片：Flexbox 横向布局（左图 120×90 / 右标题+摘要），并按当前分类过滤 */
function renderReadingCards() {
  readingItems.forEach((it, i) => { it.id = String(i); });   // 渲染时分配稳定 id
  const items = readingItems.filter(it => readingInCat(it, readingActiveCat));
  if (!items.length) {
    readingList.innerHTML = `<div class="reading-empty">该分类暂无相关新闻</div>`;
    return;
  }
  readingList.innerHTML = items.map(r => `
    <article class="reading-card" data-id="${r.id}">
      <div class="reading-thumb-wrap">
        ${r.thumbnail
          ? `<img class="reading-thumb" src="${escapeHtml(r.thumbnail)}" alt="" loading="lazy" onerror="this.style.display='none'">`
          : `<span class="reading-thumb-fallback">📰</span>`}
      </div>
      <div class="reading-card-body">
        <h3 class="reading-title">${escapeHtml(r.title)}</h3>
        <p class="reading-summary">${escapeHtml((r.fr || "").slice(0, 110))}${(r.fr || "").length > 110 ? "…" : ""}</p>
        <div class="reading-card-meta">
          <span class="reading-tag">${escapeHtml(r.tag)}</span>
          ${r.isFull ? `<span class="reading-full-badge">全文</span>` : `<span class="reading-sum-badge">摘要·点开读全文</span>`}
          ${r.pubDate ? `<span class="reading-date">${escapeHtml(formatRssDate(r.pubDate))}</span>` : ""}
        </div>
      </div>
    </article>`).join("");
  readingList.querySelectorAll(".reading-card").forEach(card => {
    card.onclick = () => showReading(card.dataset.id);
  });
}

/* 分类 Tab 切换：纯前端过滤，无需重新请求网络 */
function setupReadingTabs() {
  const tabs = document.getElementById("reading-tabs");
  if (!tabs) return;
  tabs.querySelectorAll(".reading-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.querySelectorAll(".reading-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      readingActiveCat = btn.dataset.cat;
      renderReadingCards();
    });
  });
}

/* 优雅的「网络异常」占位图：图标 + 文案 + 重试按钮 */
function readingErrorHTML(msg) {
  return `
    <div class="reading-error">
      <svg viewBox="0 0 24 24" width="58" height="58" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18M3 12h12M3 18h7"/>
        <circle cx="18.5" cy="16.5" r="3"/>
        <path d="M21.5 19.5l-1.6-1.6"/>
      </svg>
      <p class="reading-error-title">${msg ? escapeHtml(msg) : "网络异常"}</p>
      <p class="reading-error-sub">请稍后重试</p>
      <button class="reading-retry" type="button" onclick="renderReadingList()">重新加载</button>
    </div>`;
}

/* 中文翻译静态占位（后续接大模型 API 自动翻译） */
const READING_ZH_PLACEHOLDER =
  "这是中文翻译的静态占位文本。\n\n后续将接入大模型 API，自动把左侧的法语原文翻译为对应的中文，并支持逐句对照阅读。\n\n当前左栏展示的是来自权威法语源（Le Monde / The Conversation / L'Express 等）实时 RSS 的真·全文，您可以先对照阅读、积累语感；译文功能上线后，这里会自动填充中文内容。";

/* 内置示例法语文章（原创中性内容，仅用于演示划词/翻译阅读效果，非真实新闻）。
   当外部抓取因网络/反爬受限失败时，可一键加载它以体验完整阅读交互。 */
const DEMO_ARTICLE_FR = [
  "Apprendre une langue étrangère demande avant tout de la régularité. En consacrant seulement vingt minutes par jour à la lecture, on finit par assimiler naturellement le vocabulaire et la syntaxe.",
  "La presse francophone constitue une source précieuse pour les étudiants. Les articles de société, en particulier, exposent un langage courant tout en abordant des thèmes concrets : l'éducation, le climat, ou encore la culture.",
  "Pour progresser, il est utile de ne pas hésiter à consulter un dictionnaire dès qu'un mot reste flou. Cliquer sur un terme inconnu permet d'en découvrir la définition, la prononciation et des exemples contextualisés.",
  "Au fil des semaines, la compréhension s'affine. Ce qui semblait autrefois déroutant devient familier, et la lecture devient un plaisir plutôt qu'un effort. C'est ainsi que naît une véritable aisance linguistique."
].join("\n\n");

function isVideoLink(link) {
  return /\/(video|videos|emission|emissions|audio|podcast|tv|infographie)\//i.test(link || "");
}

/* 把若干法文段落渲染进左侧正文区，并绑定划词查词 + 右侧翻译占位（真实全文与示例共用此管线） */
function renderFrenchBody(paragraphs, bannerHtml) {
  const body = document.getElementById("article-body");
  if (!body) return;
  const banner = bannerHtml ? `<div class="reading-demo-banner">${bannerHtml}</div>` : "";
  body.innerHTML = banner + paragraphs
    .map(p => `<p class="reading-para">${wrapReadingWords(p)}</p>`).join("");
  fillTranslationFull(paragraphs.join("\n\n"));
}

/* 一键加载内置示例法语文章，走与真实全文完全相同的渲染与交互管线 */
function loadDemoArticle(showBanner) {
  const paras = DEMO_ARTICLE_FR.split("\n\n")
    .map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean);
  const banner = showBanner
    ? "📄 以下为<strong>示例法语文章</strong>（演示划词 / 翻译交互，非真实新闻）。"
    : "📄 以下为<strong>示例法语文章</strong>（演示划词 / 翻译交互，非真实新闻）。";
  renderFrenchBody(paras, banner);
  showToast("已加载示例法语文章（演示内容）");
}

let articleRightHidden = false;   // 翻译区是否处于收起状态
let pendingFullFr = "";           // 当前详情页的完整法语原文（供右侧译文区覆盖）

/* 点击新闻卡片 → 隐藏列表、展示双栏阅读页（左法文 / 右中文，默认 60% : 40%） */
function showReading(id) {
  const r = readingItems.find(x => x.id === id);
  if (!r) return;
  readingList.classList.add("hidden");
  readingDetail.classList.remove("hidden");
  articleRightHidden = false;

  // 站内直接渲染：优先 RSS 全文（content:encoded / atom content），否则站内摘要，全程零跳转
  let bodyHtml, hasFull = false;
  if (r.fullHtml && r.fullHtml.length > 200) {
    const blocks = extractBlocks(r.fullHtml);
    if (blocks.length) {
      bodyHtml = `<div class="reading-full-banner">✅ 全文 · ${escapeHtml(r.tag)}（站内阅读 · 与右侧翻译联动）</div>` +
        blocks.map(p => `<p class="reading-para">${wrapReadingWords(p)}</p>`).join("");
      pendingFullFr = blocks.join("\n\n");
      hasFull = true;
    }
  }
  if (!hasFull) {
    const paras = (r.fr || "").split(/\n+/).map(s => s.replace(/\s+/g, " ").trim()).filter(s => s.length > 20);
    bodyHtml = `<div class="reading-full-banner">📄 站内摘要 · ${escapeHtml(r.tag)}</div>` +
      paras.map(p => `<p class="reading-para">${wrapReadingWords(p)}</p>`).join("");
    pendingFullFr = paras.join("\n\n");
  }

  readingDetail.innerHTML = `
    <div class="reading-detail-bar">
      <button class="reading-back" type="button">← 返回列表</button>
      <button class="reading-toggle" type="button" id="article-toggle">隐藏译文</button>
    </div>
    <div class="reading-article" id="reading-article">
      <div class="article-left" id="article-left">
        ${r.thumbnail ? `<img class="reading-detail-thumb" src="${escapeHtml(r.thumbnail)}" alt="" loading="lazy" onerror="this.style.display='none'">` : ""}
        <h2 class="reading-detail-title">${escapeHtml(r.title)}</h2>
        <div class="reading-detail-meta">${escapeHtml(r.tag)}${r.pubDate ? " · " + escapeHtml(formatRssDate(r.pubDate)) : ""}${isVideoLink(r.link) ? " · 📺 视频报道" : ""}</div>
        <div class="reading-body font-serif" id="article-body">${bodyHtml}</div>
      </div>
      <div class="resizer" id="article-resizer" title="拖动调整左右宽度"></div>
      <div class="article-right" id="article-right">
        <div class="article-right-inner">
          <div class="article-right-head">中文翻译 <span class="article-right-hint">（占位，后续接入大模型 API）</span></div>
          <div class="article-right-body" id="article-right-body">${escapeHtml(READING_ZH_PLACEHOLDER)}</div>
        </div>
      </div>
    </div>`;
  readingDetail.querySelector(".reading-back").onclick = destroyReading;
  const toggleBtn = readingDetail.querySelector("#article-toggle");
  toggleBtn.onclick = () => toggleTranslation(toggleBtn);
  // 单词的「悬停释义 + 点击图标跳转」交互由全局委托（bindWordTip）统一接管，无需逐词绑定
  // 右侧翻译区同步覆盖全文（占位，后续可接大模型逐句翻译）
  if (pendingFullFr) fillTranslationFull(pendingFullFr);
  // 摘要型源：自动在站内抓取文章页全文（浏览器直连源站，不跳页），实现更强全文覆盖
  if (!hasFull && r.link && !isVideoLink(r.link)) {
    const bodyEl = document.getElementById("article-body");
    loadFullInSite(r, bodyEl);
  }
  setupResizer();
}

/* 把站内抓取到的正文段落渲染进左栏（含联动右侧翻译），供「缓存命中」与「新抓取」共用 */
function renderInlineFull(r, bodyEl, paras) {
  const banner = `<div class="reading-full-banner">✅ 全文 · ${escapeHtml(r.tag)}（站内抓取 · 与右侧翻译联动）</div>`;
  bodyEl.innerHTML = banner + paras.map(p => `<p class="reading-para">${wrapReadingWords(p)}</p>`).join("");
  pendingFullFr = paras.join("\n\n");
  fillTranslationFull(pendingFullFr);
  showToast("已加载站内全文");
}

/* 站内抓取文章页全文：优先命中本地文章缓存（秒开），否则用用户浏览器经 CORS 代理并行竞速
   直连源站文章页（不受沙箱 IP 封锁），解析正文后在站内渲染，绝不开新页。
   摘要型源点开后自动触发；成功结果写回缓存，下次（含 20 分钟新闻缓存窗口内）直接秒开。 */
async function loadFullInSite(r, bodyEl) {
  if (!bodyEl) return;
  // 1) 文章级缓存：已抓过的同一篇文章直接秒开
  const acache = loadArticleCache();
  if (r.link && acache[r.link] && acache[r.link].length >= 2) {
    renderInlineFull(r, bodyEl, acache[r.link]);
    return;
  }
  const loading = document.createElement("div");
  loading.className = "reading-loading-inline";
  loading.innerHTML = `<span class="spinner"></span><span>正在站内抓取完整全文（代理与本机兜底并行竞速，不跳页）…</span>`;
  bodyEl.appendChild(loading);
  try {
    const paras = await fetchArticleInSite(r.link);
    const banner = `<div class="reading-full-banner">✅ 全文 · ${escapeHtml(r.tag)}（站内抓取 · 与右侧翻译联动）</div>`;
    if (loading.parentNode) loading.remove();
    bodyEl.innerHTML = banner + paras.map(p => `<p class="reading-para">${wrapReadingWords(p)}</p>`).join("");
    pendingFullFr = paras.join("\n\n");
    fillTranslationFull(pendingFullFr);
    showToast("已加载站内全文");
    // 写回缓存：文章级 + 新闻列表级（下次打开即 isFull，无需再抓）
    if (r.link) {
      acache[r.link] = paras; saveArticleCache(acache);
      const it = readingItems.find(i => i.link === r.link);
      if (it) { it.isFull = true; it.fullHtml = "<p>" + paras.join("</p><p>") + "</p>"; saveNewsCache(readingItems); }
    }
  } catch (e) {
    if (loading.parentNode) loading.remove();
    const box = document.createElement("div");
    box.className = "reading-fetch-fail";
    box.innerHTML = `⚠️ 站内全文抓取暂未成功（${escapeHtml(e.message || "网络受限")}）。已保留摘要，可稍后重试。`;
    const btn = document.createElement("button");
    btn.className = "reading-inline-btn"; btn.type = "button";
    btn.textContent = "📥 重试站内抓取全文";
    btn.onclick = () => loadFullInSite(r, bodyEl);
    box.appendChild(document.createElement("br"));
    box.appendChild(btn);
    bodyEl.appendChild(box);
  }
}

/* 列表加载完成后，后台（非阻塞、错峰）预取前几条摘要型文章的全文到缓存，
   这样用户点开头条摘要文章时基本秒开，无需再等代理抓取。每会话至多预取一次。 */
let articlePrefetched = false;
function prefetchTopSummaries() {
  if (articlePrefetched) return;
  articlePrefetched = true;
  const acache = loadArticleCache();
  const summaryItems = readingItems
    .filter(it => !it.isFull && it.link && !isVideoLink(it.link))
    .slice(0, 6);
  if (!summaryItems.length) return;
  setTimeout(() => {
    summaryItems.forEach((it, i) => {
      setTimeout(async () => {
        if (!it.link || acache[it.link]) return;
        try {
          const paras = await fetchArticleInSite(it.link);
          if (paras && paras.length >= 2) {
            acache[it.link] = paras; saveArticleCache(acache);
            it.isFull = true; it.fullHtml = "<p>" + paras.join("</p><p>") + "</p>"; saveNewsCache(readingItems);
          }
        } catch (e) {}
      }, i * 600);
    });
  }, 800);
}

/* 从 RSS 全文 HTML 中抽取段落纯文本（安全：只取块级文本，丢弃脚本/样式/标签）。
   与服务器端 rss_fetch._extract_blocks 对应，用于把 RSS 自带全文渲染进左栏。 */
function extractBlocks(html) {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script,style,noscript,nav,header,footer,aside,figure,iframe,svg,.ad,.banner").forEach(n => n.remove());
  const blocks = [];
  doc.querySelectorAll("p,h2,h3,h1,h4,li,blockquote").forEach(el => {
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (t.length > 25) blocks.push(t);
  });
  if (blocks.length <= 1) {
    const t = (doc.body.textContent || "").replace(/\s+/g, " ").trim();
    if (t.length > 200) {
      return t.split(/(?:\n{2,}|\.\s+)/).map(s => s.trim()).filter(s => s.length > 40);
    }
  }
  return blocks;
}

/* 将文本分词并包裹为可探索的 <span class="reading-word">，且全程做 HTML 转义防注入。
   只保留 data-word（真实交互由悬浮框接管），不再使用单调的原生 title 提示。 */
function wrapReadingWords(text) {
  const wordRe = /[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*/gu;
  let out = "", last = 0, m;
  while ((m = wordRe.exec(text)) !== null) {
    out += escapeHtml(text.slice(last, m.index));
    const w = m[0];
    out += `<span class="reading-word" data-word="${escapeHtml(w)}">${escapeHtml(w)}</span>`;
    last = wordRe.lastIndex;
  }
  out += escapeHtml(text.slice(last));
  return out;
}

/* 右侧翻译区覆盖全文：先放占位说明，再附完整法语原文供对照（后续可接大模型 API） */
function fillTranslationFull(frText) {
  const right = document.getElementById("article-right");
  if (!right) return;
  const inner = right.querySelector(".article-right-body");
  if (!inner) return;
  inner.innerHTML =
    `<div class="article-zh-note">📝 全文中文翻译为占位内容（后续可接入大模型 API 自动翻译）。` +
    `下方为完整法语原文，悬停任意单词可查看释义，点击释义卡右下角 🔍 可跳转词典查词：</div>` +
    `<div class="article-zh-src">${wrapReadingWords(frText)}</div>`;
}

/* 点击正文单词 → 跳转「词典与翻译」并即时查词（仅由释义卡右下角图标触发） */
function openWordInDictionary(word) {
  word = (word || "").trim();
  if (!word) return;
  setFunction("dictionary");
  if (dictSearch) dictSearch.value = word;
  doDictStream(word);
}

/* ===================================================================
   划词悬浮框（Tooltip）深度重构
   - 悬停单词：立即显示 Loading 状态的微型卡片，异步取词后平滑淡入释义；
   - 卡片三行结构：① 单词(粗体)+词性(灰) ② 核心中文释义 ③ 右下角跳转图标；
   - 仅点击卡片右下角「跳转图标」才联动跳转到词典模块（不再直接点单词跳转）；
   - 用 getBoundingClientRect 精确定位，置于单词正下/正上方，绝不超出屏幕边界。
   =================================================================== */

/* 本地基础词典占位（后续可替换为真实词典 API / 大模型）。pos 用法语缩写。 */
const LOCAL_DICT = {
  "le":   { pos: "art. m.",   meaning: "（定冠词）表示阳性单数“the”" },
  "la":   { pos: "art. f.",   meaning: "（定冠词）表示阴性单数“the”" },
  "les":  { pos: "art.",      meaning: "（定冠词）表示复数“the”" },
  "un":   { pos: "art. m.",   meaning: "（不定冠词）一个（阳性）" },
  "une":  { pos: "art. f.",   meaning: "（不定冠词）一个（阴性）" },
  "des":  { pos: "art.",      meaning: "（不定冠词）一些、若干个" },
  "du":   { pos: "art. m.",   meaning: "（部分冠词/缩合）的 / 一些（阳性）" },
  "de":   { pos: "prép.",     meaning: "的；从；关于" },
  "et":   { pos: "conj.",     meaning: "和、与、并且" },
  "ou":   { pos: "conj.",     meaning: "或者、还是" },
  "mais": { pos: "conj.",     meaning: "但是、然而" },
  "donc": { pos: "conj.",     meaning: "因此、所以" },
  "car":  { pos: "conj.",     meaning: "因为（置于句中）" },
  "que":  { pos: "conj./pron.", meaning: "that；引导从句 / 关系代词“那”" },
  "qui":  { pos: "pron.",     meaning: "（关系代词）谁、那（主语）" },
  "avec": { pos: "prép.",     meaning: "和……一起、用" },
  "pour": { pos: "prép.",     meaning: "为了、给、对于" },
  "sur":  { pos: "prép.",     meaning: "在……上面、关于" },
  "dans": { pos: "prép.",     meaning: "在……里面、在……期间" },
  "par":  { pos: "prép.",     meaning: "被、由、通过" },
  "en":   { pos: "prép./pron.", meaning: "在……里、用……材料；en 代词“some”" },
  "au":   { pos: "prép.",     meaning: "à + le 的缩合：在（阳性）" },
  "aux":  { pos: "prép.",     meaning: "à + les 的缩合：在（复数）" },
  "ce":   { pos: "pron./adj.", meaning: "这、这个（指示）" },
  "cet":  { pos: "adj.",      meaning: "这个（元音前阳性）" },
  "cette":{ pos: "adj.",      meaning: "这个（阴性）" },
  "il":   { pos: "pron.",     meaning: "他；它（主语）" },
  "elle": { pos: "pron.",     meaning: "她；它（主语，阴性）" },
  "je":   { pos: "pron.",     meaning: "我（主语）" },
  "tu":   { pos: "pron.",     meaning: "你（主语，单数亲密）" },
  "nous": { pos: "pron.",     meaning: "我们" },
  "vous": { pos: "pron.",     meaning: "你们；您" },
  "ils":  { pos: "pron.",     meaning: "他们（主语）" },
  "elles":{ pos: "pron.",     meaning: "她们（主语，阴性）" },
  "être": { pos: "v.",        meaning: "是、在（系动词 être）" },
  "avoir":{ pos: "v.",        meaning: "有（avoir）" },
  "faire":{ pos: "v.",        meaning: "做、使、让（faire）" },
  "dire": { pos: "v.",        meaning: "说、讲（dire）" },
  "aller":{ pos: "v.",        meaning: "去、走（aller）" },
  "venir":{ pos: "v.",        meaning: "来（venir）" },
  "voir": { pos: "v.",        meaning: "看见（voir）" },
  "pouvoir":{ pos: "v.",      meaning: "能够、可以（pouvoir）" },
  "vouloir":{ pos: "v.",      meaning: "想要、愿意（vouloir）" },
  "devoir":{ pos: "v.",       meaning: "必须、应该、欠（devoir）" },
  "savoir":{ pos: "v.",       meaning: "知道、懂得（savoir）" },
  "parler":{ pos: "v.",       meaning: "说话、讲（语言）（parler）" },
  "mettre":{ pos: "v.",       meaning: "放、穿、装（mettre）" },
  "prendre":{ pos: "v.",      meaning: "拿、取、乘（prendre）" },
  "comprendre":{ pos: "v.",   meaning: "理解、包括（comprendre）" },
  "grand":{ pos: "adj.",      meaning: "大的、高的、伟大的" },
  "petit":{ pos: "adj.",      meaning: "小的、矮的" },
  "nouveau":{ pos: "adj.",    meaning: "新的（nouveau）" },
  "bon":  { pos: "adj.",      meaning: "好的、善的（bon）" },
  "mauvais":{ pos: "adj.",    meaning: "坏的、糟糕的" },
  "beau": { pos: "adj.",      meaning: "美丽的、好看的" },
  "joli": { pos: "adj.",      meaning: "漂亮的、可爱的" },
  "important":{ pos: "adj.",  meaning: "重要的" },
  "premier":{ pos: "adj.",    meaning: "第一的、首要的" },
  "dernier":{ pos: "adj.",    meaning: "最后的、最近的" },
  "français":{ pos: "adj./n.", meaning: "法国的；法语；法国人" },
  "monde":{ pos: "n.m.",     meaning: "世界；人们" },
  "pays": { pos: "n.m.",     meaning: "国家；地区" },
  "jour": { pos: "n.m.",     meaning: "天、日；白天" },
  "an":   { pos: "n.m.",     meaning: "年" },
  "année":{ pos: "n.f.",     meaning: "年（时间段）" },
  "temps":{ pos: "n.m.",     meaning: "时间；天气；时态" },
  "heure":{ pos: "n.f.",     meaning: "小时；点钟" },
  "homme":{ pos: "n.m.",     meaning: "男人；人类" },
  "femme":{ pos: "n.f.",     meaning: "女人；妻子" },
  "enfant":{ pos: "n.m./f.", meaning: "孩子" },
  "vie":  { pos: "n.f.",     meaning: "生活；生命" },
  "eau":  { pos: "n.f.",     meaning: "水" },
  "féminin":{ pos: "adj./n.", meaning: "阴性的；女性" },
  "masculin":{ pos: "adj./n.", meaning: "阳性的；男性" },
  "gouvernement":{ pos: "n.m.", meaning: "政府" },
  "politique":{ pos: "n.f./adj.", meaning: "政治；政策的" },
  "économie":{ pos: "n.f.",   meaning: "经济" },
  "société":{ pos: "n.f.",    meaning: "社会；公司" },
  "culture":{ pos: "n.f.",    meaning: "文化" },
  "article":{ pos: "n.m.",    meaning: "文章；冠词" },
  "journée":{ pos: "n.f.",    meaning: "一天（白天时段）" },
  "matin":{ pos: "n.m.",     meaning: "早晨、上午" },
  "soir": { pos: "n.m.",     meaning: "傍晚、晚上" },
  "travail":{ pos: "n.m.",    meaning: "工作、劳动" },
  "ville":{ pos: "n.f.",     meaning: "城市" },
  "guerre":{ pos: "n.f.",    meaning: "战争" },
  "paix": { pos: "n.f.",     meaning: "和平" },
  "mort": { pos: "n.f./adj.", meaning: "死亡；死的" },
  "nation":{ pos: "n.f.",    meaning: "民族、国家" }
};

/* 本地词典未收录时的友好兜底 */
function guessWord(word) {
  return { pos: "—", meaning: "（本地词典暂未收录）点击 🔍 用 AI 词典查看详情" };
}

/* 异步取词：目前用本地词典占位 + 模拟大模型查询延迟（setTimeout） */
function fetchWordMeaning(word) {
  const key = (word || "").toLowerCase();
  return new Promise((resolve) => {
    const delay = 220 + Math.random() * 360;   // 模拟大模型/网络往返延迟
    setTimeout(() => {
      resolve(LOCAL_DICT[key] || guessWord(word));
    }, delay);
  });
}

/* ---------------- 悬浮框实例与交互 ---------------- */
let wordTipEl = null;
let wordTipHideTimer = null;
let wordTipToken = 0;            // 防止快速划过多词时的竞态
let wordTipCurrentWord = null;
let wordTipAnchor = null;
let wordTipCurrentMeaning = "";   // 划词取到的核心释义，用于收藏时写入生词本

function getWordTipEl() {
  if (wordTipEl) return wordTipEl;
  wordTipEl = document.createElement("div");
  wordTipEl.className = "reading-word-tip";
  wordTipEl.setAttribute("role", "tooltip");
  wordTipEl.innerHTML =
    `<div class="rwt-row rwt-head">` +
      `<span class="rwt-word"></span>` +
      `<span class="rwt-pos"></span>` +
    `</div>` +
    `<div class="rwt-row rwt-meaning"></div>` +
    `<div class="rwt-row rwt-foot">` +
      `<button class="rwt-fav" type="button" title="收藏到生词本" aria-label="收藏到生词本">` +
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 17.9 6.6 19.6l1.2-6L3.3 9.4l6.1-.8z"/></svg>` +
      `</button>` +
      `<button class="rwt-jump" type="button" title="在词典中查看" aria-label="在词典中查看">` +
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` +
      `</button>` +
    `</div>`;
  document.body.appendChild(wordTipEl);
  // 鼠标移入悬浮框 → 取消隐藏；移出 → 延迟隐藏（防止移到框上时消失）
  wordTipEl.addEventListener("mouseenter", () => {
    if (wordTipHideTimer) { clearTimeout(wordTipHideTimer); wordTipHideTimer = null; }
  });
  wordTipEl.addEventListener("mouseleave", () => scheduleHideWordTip());
  // 左下 ⭐：直接收藏 / 取消收藏，与生词收藏夹 localStorage 实时联动
  wordTipEl.querySelector(".rwt-fav").addEventListener("click", (e) => {
    e.stopPropagation();
    const w = wordTipCurrentWord;
    if (!w) return;
    if (isFav(w)) { removeFav(w); showToast("已取消收藏：" + w); }
    else { addFav(w, wordTipCurrentMeaning || ""); showToast("已收藏：" + w); }
    setTipFavState(w);
    updateFavBar();                                  // 若同一词正在词典区显示，同步其收藏条
    const vf = document.getElementById("view-favorites");
    if (vf && !vf.classList.contains("hidden")) renderFavorites();   // 正在收藏夹页则即时刷新列表
  });
  // 仅点击「跳转图标」才触发核心联动：隐藏阅视界 → 切到词典 → 填入并查询
  wordTipEl.querySelector(".rwt-jump").addEventListener("click", (e) => {
    e.stopPropagation();
    const w = wordTipCurrentWord;
    hideWordTip();
    if (w) openWordInDictionary(w);
  });
  return wordTipEl;
}

/* 根据单词是否已收藏，更新悬浮框左下 ⭐ 的视觉状态（金色实心 / 灰色空心） */
function setTipFavState(word) {
  const btn = wordTipEl && wordTipEl.querySelector(".rwt-fav");
  if (!btn) return;
  const fav = isFav(word);
  btn.classList.toggle("is-fav", fav);
  btn.title = fav ? "已收藏 · 点击取消" : "收藏到生词本";
  btn.setAttribute("aria-pressed", fav ? "true" : "false");
}

/* 用 getBoundingClientRect 精确定位：默认单词正下方，空间不足翻到正上方，水平夹紧不越界 */
function positionWordTip(anchor) {
  const tip = wordTipEl;
  const rect = anchor.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight, margin = 8;
  const tipW = tipRect.width, tipH = tipRect.height;
  let top = rect.bottom + 10;
  let left = rect.left + rect.width / 2 - tipW / 2;
  let above = false;
  if (top + tipH > vh - margin) {            // 下方放不下 → 翻到上方
    top = rect.top - tipH - 10;
    above = true;
  }
  if (top < margin) top = margin;             // 上方仍越界 → 贴顶
  if (left < margin) left = margin;           // 水平夹紧
  if (left + tipW > vw - margin) left = vw - tipW - margin;
  tip.style.top = top + "px";
  tip.style.left = left + "px";
  tip.classList.toggle("above", above);
  // 小尖角对齐单词中心（相对卡片内部坐标）
  const arrowX = rect.left + rect.width / 2 - left;
  tip.style.setProperty("--rwt-arrow", Math.max(14, Math.min(tipW - 14, arrowX)) + "px");
}

function showWordTip(el) {
  const word = (el.getAttribute("data-word") || "").trim();
  if (!word) return;
  if (wordTipHideTimer) { clearTimeout(wordTipHideTimer); wordTipHideTimer = null; }
  const tip = getWordTipEl();
  if (wordTipCurrentWord === word && tip.classList.contains("show")) return; // 同一词已显示，避免抖动
  wordTipCurrentWord = word;
  wordTipAnchor = el;
  wordTipCurrentMeaning = "";        // 新词重置释义
  setTipFavState(word);              // 立即反映该词是否已收藏
  const token = ++wordTipToken;
  const wordEl = tip.querySelector(".rwt-word");
  const posEl = tip.querySelector(".rwt-pos");
  const meaningEl = tip.querySelector(".rwt-meaning");
  wordEl.textContent = word;
  posEl.textContent = "";
  meaningEl.classList.remove("loaded");
  meaningEl.innerHTML = `<span class="rwt-spinner"></span><span class="rwt-loading-text">查询中…</span>`;
  tip.classList.add("show");                  // 立即显示 Loading 状态（平滑淡入）
  positionWordTip(el);
  // 异步取词：拿到后更新词性/释义并淡入
  fetchWordMeaning(word).then(entry => {
    if (token !== wordTipToken) return;       // 已被更新的单词取代，丢弃
    posEl.textContent = entry.pos || "";
    meaningEl.textContent = entry.meaning || "（暂无释义）";
    meaningEl.classList.add("loaded");
    wordTipCurrentMeaning = entry.meaning || "";   // 记下释义，供收藏使用
    setTipFavState(word);                            // 释义返回后再次同步收藏态
    positionWordTip(wordTipAnchor);           // 内容变长后重新定位，防溢出
  }).catch(() => {
    if (token !== wordTipToken) return;
    posEl.textContent = "";
    meaningEl.textContent = "（查询失败，点击 🔍 用 AI 词典查询）";
    meaningEl.classList.add("loaded");
  });
}

function scheduleHideWordTip() {
  if (wordTipHideTimer) clearTimeout(wordTipHideTimer);
  wordTipHideTimer = setTimeout(() => hideWordTip(), 200);  // 延迟 200ms 隐藏
}

function hideWordTip() {
  if (wordTipHideTimer) { clearTimeout(wordTipHideTimer); wordTipHideTimer = null; }
  if (wordTipEl) wordTipEl.classList.remove("show");
  wordTipCurrentWord = null;
}

/* 全局委托：一次绑定，覆盖后续动态渲染的所有 .reading-word */
let _wordTipBound = false;
function bindWordTip() {
  if (_wordTipBound) return;
  _wordTipBound = true;
  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest && e.target.closest(".reading-word");
    if (el) showWordTip(el);
  });
  document.addEventListener("mouseout", (e) => {
    const el = e.target.closest && e.target.closest(".reading-word");
    if (el) scheduleHideWordTip();
  });
  // 触屏 / 无悬停场景：点击单词本身唤起释义卡（不跳转），仅图标跳转
  document.addEventListener("click", (e) => {
    const el = e.target.closest && e.target.closest(".reading-word");
    if (el) { showWordTip(el); }
  });
  // 滚动或缩放时收起，避免错位
  window.addEventListener("scroll", () => hideWordTip(), true);
  window.addEventListener("resize", () => hideWordTip());
}

/* 返回按钮：重新显示新闻列表，并销毁当前阅读视图 */
function destroyReading() {
  readingDetail.classList.add("hidden");
  readingDetail.innerHTML = "";          // 销毁阅读视图 DOM
  renderReadingCards();                  // 重新显示列表（保留当前分类）
}

/* 翻译区折叠控制：通过 display 切换 + 左栏占满，实现展开/收起 */
function toggleTranslation(btn) {
  const right = document.getElementById("article-right");
  const resizer = document.getElementById("article-resizer");
  const left = document.getElementById("article-left");
  if (!right) return;
  articleRightHidden = !articleRightHidden;
  if (articleRightHidden) {
    right.style.display = "none";
    if (resizer) resizer.style.display = "none";
    if (left) left.style.width = "100%";
    btn.textContent = "显示译文";
  } else {
    right.style.display = "";
    if (resizer) resizer.style.display = "";
    if (left) left.style.width = "60%";
    if (right) right.style.width = "40%";
    btn.textContent = "隐藏译文";
  }
}

/* 拖拽调节器：mousedown → mousemove → mouseup，动态修改左右栏宽度百分比。
   window 级的 mousemove/mouseup 只绑定一次（resizerBound 守卫），避免反复打开文章时累积监听。 */
let resizing = false;
let resizerBound = false;
function setupResizer() {
  const resizer = document.getElementById("article-resizer");
  if (!resizer) return;
  resizer.addEventListener("mousedown", (e) => {
    resizing = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  });
  if (!resizerBound) {
    resizerBound = true;
    window.addEventListener("mousemove", (e) => {
      if (!resizing) return;
      const container = document.getElementById("reading-article");
      const left = document.getElementById("article-left");
      const right = document.getElementById("article-right");
      if (!container || !left || !right) return;
      const rect = container.getBoundingClientRect();
      let pct = ((e.clientX - rect.left) / rect.width) * 100;
      if (pct < 20) pct = 20;            // 左栏最小 20%
      if (pct > 80) pct = 80;            // 即右栏最小 20%
      left.style.width = pct + "%";
      right.style.width = (100 - pct) + "%";
    });
    window.addEventListener("mouseup", () => {
      if (!resizing) return;
      resizing = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    });
  }
}

if (readingRefresh) {
  readingRefresh.addEventListener("click", () => renderReadingList());
}

/* ---------------- 影子跟读室 ---------------- */
const shadowText = document.getElementById("shadow-text");
const shadowPlay = document.getElementById("shadow-play");
const shadowStop = document.getElementById("shadow-stop");
const shadowRate = document.getElementById("shadow-rate");
const shadowRateVal = document.getElementById("shadow-rate-val");
const shadowStatus = document.getElementById("shadow-status");
const shadowSample = document.getElementById("shadow-sample");

const SAMPLES = [
  "Bonjour, comment allez-vous aujourd'hui ?",
  "Je m'appelle Marie et j'habite à Paris.",
  "Le chat noir mange une pomme rouge dans le jardin."
];

shadowRate.addEventListener("input", () =>
  shadowRateVal.textContent = shadowRate.value + "×");

shadowSample.addEventListener("click", () => {
  const pick = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
  shadowText.value = pick;
});

shadowPlay.addEventListener("click", () => {
  const text = shadowText.value.trim();
  if (!text) { shadowStatus.textContent = "请先输入要跟读的句子。"; return; }
  if (!("speechSynthesis" in window)) {
    shadowStatus.textContent = "当前浏览器不支持语音合成，建议使用 Chrome / Edge。";
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  u.rate = parseFloat(shadowRate.value);
  // 优先选择法语语音
  const voices = window.speechSynthesis.getVoices();
  const fr = voices.find(v => /fr/i.test(v.lang));
  if (fr) u.voice = fr;
  u.onstart = () => shadowStatus.textContent = "🔊 正在朗读，请准备跟读…";
  u.onend = () => shadowStatus.textContent = "朗读结束，现在轮到你了！";
  window.speechSynthesis.speak(u);
});

shadowStop.addEventListener("click", () => {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  shadowStatus.textContent = "";
});

// 某些浏览器需要触发一次 voices 加载
if ("speechSynthesis" in window) window.speechSynthesis.getVoices();

/* ---------------- 初始化 ---------------- */
/* ---------------- 每日随机金句（法语名言 / 谚语 / 金融 · 学习短句） ---------------- */
const frenchQuotes = [
  { fr: "Petit à petit, l’oiseau fait son nid.", cn: "不积跬步，无以至千里——每天进步一点点。" },
  { fr: "Le temps, c’est de l’argent.", cn: "时间就是金钱，惜时即惜财。" },
  { fr: "Qui veut la fin veut les moyens.", cn: "既已立志于终点，便须筹谋其路径。" },
  { fr: "L’habitude est une seconde nature.", cn: "习惯，是人的第二天性。" },
  { fr: "La patience est l’art d’espérer.", cn: "耐心，是一门关于希望的艺术。" },
  { fr: "On ne fait rien de grand sans beaucoup de patience.", cn: "没有极大的耐心，便成就不了伟大的事。" },
  { fr: "Chaque jour compte.", cn: "日拱一卒，每一天都算数。" },
  { fr: "Le savoir est la seule richesse que l’on ne peut voler.", cn: "知识是唯一无法被人夺走的财富。" },
  { fr: "Le meilleur investissement est en soi-même.", cn: "最稳妥的投资，是投资自己。" },
  { fr: "Il n’est jamais trop tard pour apprendre.", cn: "学习这件事，永远不嫌太晚。" },
  { fr: "La persévérance finit par vaincre.", cn: "坚持不懈，终将所向披靡。" },
  { fr: "Qui cherche trouve.", cn: "心有所求，行有所获——找的人总会找到。" },
  { fr: "Le talent sans le travail n’est rien.", cn: "没有日复一日的打磨，天赋便一文不值。" },
  { fr: "Mieux vaut tard que jamais.", cn: "迟做，总好过永远不做。" },
  { fr: "La fortune sourit aux audacieux.", cn: "命运，眷顾勇敢而下注的人。" },
  { fr: "Vouloir, c’est pouvoir.", cn: "心之所向，力之所及——有志者事竟成。" },
  { fr: "L’argent ne fait pas le bonheur.", cn: "金钱买不到幸福，知足方得安宁。" },
  { fr: "Apprendre, c’est réapprendre à voir.", cn: "学习，就是重新学会用双眼去看世界。" },
  { fr: "Le temps perdu ne se rattrape jamais.", cn: "流逝的光阴，永远无法被追回。" },
  { fr: "Ce qui compte n’est pas la vitesse, mais la régularité.", cn: "重要的从不是速度，而是日复一日的恒常。" }
];

let quoteTimer = null;
function updateQuote() {
  const q = frenchQuotes[Math.floor(Math.random() * frenchQuotes.length)];
  const els = ["cover-fr", "cover-zh", "banner-fr", "banner-cn"]
    .map(id => document.getElementById(id)).filter(Boolean);
  // 先淡出（0.25s）
  els.forEach(el => el.classList.add("is-fading"));
  if (quoteTimer) clearTimeout(quoteTimer);
  quoteTimer = setTimeout(() => {
    const frText = "« " + q.fr + " »";
    const map = { "cover-fr": frText, "cover-zh": q.cn, "banner-fr": frText, "banner-cn": q.cn };
    els.forEach(el => { el.textContent = map[el.id]; el.classList.remove("is-fading"); });
  }, 250);   // 0.25s 后切换文字并淡入，合计 0.5s 平滑过渡
}

function init() {
  initTheme();
  updateQuote();   // 首次加载：随机金句淡入（View A 封面）
  renderVerbChips();
  updateChips();
  renderWheel();
  startStudyStats();   // 开启学习计时（真实累计 + 落盘），并首次绘制数据卡
  paintHomeStats();
  checkService();  // 页面打开即探测本地服务，连不上时显示醒目横幅
  setupReadingTabs();  // 绑定分类 Tab 切换（纯前端关键字过滤）
  bindWordTip();    // 全局委托：阅视界单词的「悬停释义 + 点击图标跳转词典」
  // 默认仅显示 View A（由 HTML/CSS 保证：view-A 可见，view-B/view-C 为 display:none）
}

init();
