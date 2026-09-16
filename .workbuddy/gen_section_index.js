/**
 * 从 sidebars.js + 文档 frontmatter 生成 src/data/sections.js
 * 数据来源单一，避免手工维护 359 条链接出错。
 */
const fs = require("fs");
const path = require("path");

const ROOT = "C:/Users/Jarlin/Desktop/Github/wikiDoc";
const DOCS = path.join(ROOT, "docs");

const sidebars = require(path.join(ROOT, "sidebars.js"));
const tree = sidebars.tutorialSidebar;

// ---------- 文档元数据 ----------
const fmRe = /^---\r?\n([\s\S]*?)\r?\n---/;
const meta = {}; // docId -> {label,url}

function walkDocs(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkDocs(p);
    else if (e.name.endsWith(".mdx")) {
      const docId = path
        .relative(DOCS, p)
        .replace(/\\/g, "/")
        .replace(/\.mdx$/, "");
      const raw = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
      const m = fmRe.exec(raw);
      const fm = m ? m[1] : "";
      const grab = (k) => {
        const r = new RegExp("^" + k + ":\\s*(.*)$", "m").exec(fm);
        if (!r) return "";
        let v = r[1].trim();
        if (v.length >= 2 && v[0] === v[v.length - 1] && /["']/.test(v[0]))
          v = v.slice(1, -1);
        return v.trim();
      };
      const slug = grab("slug");
      let url;
      if (slug) url = slug.startsWith("/") ? slug : "/" + slug;
      else if (docId === "index") url = "/";
      else {
        const s = docId.split("/");
        url =
          s.length >= 2 && s[s.length - 1] === s[s.length - 2]
            ? "/" + s.slice(0, -1).join("/")
            : "/" + docId;
      }
      meta[docId] = { label: grab("sidebar_label") || grab("title") || docId, url };
    }
  }
}
walkDocs(DOCS);

// ---------- 分类元数据（图标 / 描述 / tagline） ----------
const CAT_ICON = {
  账户类型与选择: "🗂️",
  账户管理与安全: "🔐",
  入金与出金: "💳",
  交易品种与合约: "📊",
  交易平台与工具: "🖥️",
  交易操作与订单: "🎯",
  交易时间与市场规则: "🕒",
  错误与故障排除: "🛠️",
  其他: "📄",
  计划与入门: "🚀",
  佣金与返佣: "💰",
  个人专区与报告: "📈",
  资金与平台安全: "🛡️",
};
const CAT_DESC = {
  账户类型与选择: "标准、先锋、美分、零点、裸点账户的差异与选择依据",
  账户管理与安全: "账户验证文件、密码与 2FA、账户信息与地址变更",
  入金与出金: "支付渠道、到账时间、限额与出入金失败排查",
  交易品种与合约: "外汇、金属、指数、能源、股票与加密货币的合约细则",
  交易平台与工具: "MT4/MT5、网页终端、交易应用、VPS 与 EA",
  交易操作与订单: "下单、平仓、部分对冲、止损止盈与订单类型",
  交易时间与市场规则: "各市场交易时间、休市安排、隔夜与保证金规则",
  错误与故障排除: "登录、入金、订单执行等常见报错的定位与处理",
  其他: "未归入以上分组的文档",
  计划与入门: "合作计划介绍、加入流程与入门指引",
  佣金与返佣: "佣金框架、返佣规则与计算方式",
  个人专区与报告: "合作伙伴个人专区功能与报告查看",
  资金与平台安全: "资金安全、佣金提取与平台合规",
};

const SECTION_META = {
  "exness-trader": {
    icon: "📈",
    title: "EXNESS 客户帮助",
    tagline: "账户类型、开户验证、出入金、交易品种、平台终端、订单操作与故障排除",
  },
  "exness-agent": {
    icon: "🤝",
    title: "EXNESS 代理帮助",
    tagline: "合作伙伴计划、佣金与返佣、介绍经纪商 IB、推广与个人专区报告",
  },
  "nytimes": {
    icon: "📰",
    title: "纽时播报",
    tagline: "翻译与写作、留学与移民、自动化脚本等主题笔记",
  },
  "guides": {
    icon: "🧭",
    title: "深度指南",
    tagline: "面向决策的经纪商研究：监管合规、出入金、交易平台与账户选择",
  },
  "ai-tools": {
    icon: "🧠",
    title: "AI 与工具",
    tagline: "AI 助手用法与 EA 交易环境配置",
  },
};

const QUICK = {
  "exness-trader": [
    ["账户类型", "/exness-trader/账户类型"],
    ["入金须知", "/exness-trader/入金须知"],
    ["出金须知", "/exness-trader/出金须知"],
    ["MetaTrader：MT4 与 MT5 对比", "/exness-trader/metatrader-详解-对比-mt4-和-mt5"],
    ["杠杆和保证金要求", "/exness-trader/杠杆和保证金要求"],
    ["隔夜利息", "/exness-trader/隔夜利息"],
  ],
  "exness-agent": [
    ["合作伙伴佣金框架", "/exness-agent/合作伙伴佣金框架"],
    ["一般出金规则", "/exness-agent/一般出金规则"],
    ["最低和最高出金限额", "/exness-agent/最低和最高出金限额"],
  ],
  guides: [
    ["Exness 监管与合规全景", "/guides/exness-regulation"],
    ["Exness 出入金完整指南", "/guides/exness-deposit-withdrawal"],
    ["Exness 交易平台全解", "/guides/exness-platforms"],
    ["Exness 账户类型怎么选", "/guides/exness-account-types"],
  ],
};

// ---------- 解析侧栏树 ----------
const out = {};

function docEntry(id) {
  const m = meta[id];
  if (!m) return null;
  return [m.label, m.url];
}

for (const node of tree) {
  if (typeof node === "string" || node.type !== "category") continue;
  // 定位该一级分类对应的 key
  let key = null;
  for (const [k, v] of Object.entries(SECTION_META)) {
    if (v.title === node.label) key = k;
  }
  if (!key) continue;

  const groups = [];
  const flat = [];
  for (const it of node.items) {
    if (typeof it === "string") {
      const e = docEntry(it);
      if (e) flat.push(e);
    } else if (it.type === "category") {
      const items = [];
      for (const sub of it.items) {
        if (typeof sub !== "string") continue;
        const e = docEntry(sub);
        if (e) items.push(e);
      }
      if (items.length)
        groups.push({
          name: it.label,
          icon: CAT_ICON[it.label] || "📄",
          desc: CAT_DESC[it.label] || "",
          items,
        });
    }
  }
  if (flat.length) {
    groups.push({
      name: "文档",
      icon: "📚",
      desc: "",
      items: flat,
    });
  }

  out[key] = {
    ...SECTION_META[key],
    groups,
    quick: QUICK[key] || [],
  };
}

// ---------- 输出 ----------
const lines = [];
lines.push("/**");
lines.push(" * 一级目录索引页数据。由 .workbuddy/gen_section_index.js 自动生成，请勿手改。");
lines.push(" * 手工改这里会被下次生成覆盖；要改标题/图标/描述请改该脚本中的元数据表。");
lines.push(" */");
lines.push("");
lines.push("export const SECTIONS = " + JSON.stringify(out, null, 2) + ";");
lines.push("");
lines.push("export default SECTIONS;");
lines.push("");

const dest = path.join(ROOT, "src/data/sections.js");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, lines.join("\n"), "utf8");

for (const [k, v] of Object.entries(out)) {
  const total = v.groups.reduce((a, g) => a + g.items.length, 0);
  console.log(
    `${k.padEnd(16)} ${v.groups.length} 组 / ${total} 篇  [${v.groups.map((g) => g.name + ":" + g.items.length).join(", ")}]`
  );
}
console.log("\n已写入:", dest);
