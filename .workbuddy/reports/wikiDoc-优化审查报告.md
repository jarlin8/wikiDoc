# wikiDoc 项目审查报告：依赖更新与配置优化

- 项目：`C:\Users\Jarlin\Desktop\Github\wikiDoc` → https://wiki.ssgg.net
- 审查日期：2026-09-09
- 规模：425 个 `.mdx`（1.13 MB 正文，平均 2.7 KB/篇）、4 个内容目录、Docusaurus 3.9.2
- 核验手段：读取全部配置与源码；依赖版本取自 npm registry；漏洞数据取自 npm 官方 advisory bulk 接口并逐版本比对语义化区间；**对线上页面 https://wiki.ssgg.net 做了实际抓取验证**；对全部外部资源域名做了可用性与延迟实测

---

## 结论摘要

按影响面排序，本项目有三类问题：

**第一类：全站 425 页系统性 SEO 缺陷（影响最大，成本最低）**

线上抓取 `/exness-trader/标准账户` 实测确认了两个问题：

1. 每个页面有 **两个 `<h1>`**，且 navbar 注入的 `<h1 class="font-extrabold"><a>WikiDoc</a></h1>` 在 DOM 顺序上排在页面真实标题之前。搜索引擎优先采信第一个 h1 —— 也就是说 425 个页面对外呈现的主标题全都是「WikiDoc」，而非各自的实际主题。
2. `description` frontmatter 覆盖率仅 **0.7%（3/425）**。缺失时 Docusaurus 自动截取正文开头，实测该页输出的是 `<meta name="description" content="- 标准账户最适合哪些交易者？">` —— **连 Markdown 列表符号 `- ` 都带进了搜索摘要**。422 个页面处于这个状态。

**第二类：确定性代码缺陷（已在生产环境生效，但不易察觉）**

`src/css/custom.css` 有 3 处失效代码（含一个拼写错误导致正文字体从未生效、代码块被设成非等宽字体、脚注字号 1px）；`src/components/ads.js` 使用了 Docusaurus 不支持的 Next.js `<style jsx>` 语法，影响 360 个页面；CI 的 `set NODE_OPTIONS=` 在 ubuntu 上静默失效，8 GB 堆上限从未生效。

**关于「悬浮预览弹窗」——这是一条完整的在线功能链路，相关依赖与资源都不能删**

`remark-wiki-link-plus` → 生成 `class="internal"` → `wikiPreviewBox.fixed.js` 绑定 hover → 从 `niu.fendou.la` 拉取样式弹窗。四环缺一不可，已在生产环境运行：

- 线上页面实测渲染出 `<a class="internal new" href="/exness-trader/股票">股票</a>`，这个 `internal` 类名来自插件源码的 `wikiLinkClassName` 默认值，**是弹窗唯一的挂载点**。
- `remark-wiki-link-plus` **必须保留**。删掉它，609 处 wiki 链接会退化成纯文本，内部链接预览弹窗彻底失效。
- `static/wikiPrevBox/` **不是死文件**，它是弹窗样式（`wikiPreviewBox.min.css`）的本地副本 —— 实测与 CDN 上那份 **MD5 完全一致**。正确做法是把它改成自托管源，而不是删掉。
- `wikiPreviewBox.fixed.js` 自身有一个真实缺陷：对所有维基百科链接无条件调用 `event.preventDefault()`，导致 85 处维基外链**点击无反应**。

详见 2.3 缺陷 6 与 2.5。

**第三类：工程卫生与供应链**

CI 里 `yarn add` 绕过 lockfile 直接拉最新版；双 lockfile 并存且 `yarn.lock` 被 16 处 `@ai-sdk/*` 污染；`docusaurus-theme-mdx-v2` 停更 4 年；4 个未使用依赖；两个 Python 数据脚本写入 `docs/` 且会触发全站重建。

依赖漏洞共 **2 critical / 40 high / 36 moderate / 10 low，涉及 39 个包**，但全部位于构建链，不进入浏览器产物 —— 实际风险为低到中，属卫生问题而非紧急事故。

### 建议处理顺序

| 优先级 | 事项 | 影响面 | 成本 |
|---|---|---|---|
| P0 | 移除 navbar 注入的 `<h1>` | 425 页 SEO | 改 3 行 |
| P0 | 补全 `description` frontmatter | 422 页 SEO | 可脚本半自动 |
| P1 | 修 CI：`yarn add` / `fetch-depth` / `NODE_OPTIONS` | 构建可复现性与正确性 | 改 1 文件 |
| P1 | 修 `custom.css` 三处失效代码 | 全站排版 | 改 4 行 |
| P1 | 重构 `ads.js` 的 `<style jsx>` | 360 页 | 改 1 文件 |
| P1 | 修复弹窗拦截维基外链点击 | 85 处外链失效 | 改 3 行 |
| P2 | 清理死依赖 / 死代码（**保留 `remark-wiki-link-plus`**） | 维护性 | 纯删除 |
| P2 | 弹窗 CSS/图标改本地自托管 | 消除第三方运行时依赖 | 改 3 行 + 补 1 个 svg |
| P2 | 升级 3.10.2 + 启用 Faster | 构建速度 | 中等 |
| P3 | `yarn dedupe` 消除陈旧传递依赖 | 安全卫生 | 一条命令 |
| P3 | wiki 链接改用 `markdownFolder: "docs"` | 消掉 609 处误标的 `new` 类 | 改 1 行，需回归验证 |

---

# 第一部分：依赖更新分析

## 1.1 直接依赖现状

| 包 | 当前声明 | npm 最新 | 判定 |
|---|---|---|---|
| `@docusaurus/core` | `3.9.2` | 3.10.2 | 落后一个 minor，建议升 |
| `@docusaurus/preset-classic` | `3.9.2` | 3.10.2 | 同上，必须与 core 同版本 |
| `@docusaurus/module-type-aliases` | `^3.9.2` | 3.10.2 | 同上 |
| `@easyops-cn/docusaurus-search-local` | `^0.52.2` | 0.55.3 | **落后 3 个 minor**，建议升 |
| `docusaurus-theme-mdx-v2` | `0.1.2` | 0.1.2 | **应删除**，见 1.2 |
| `@mdx-js/react` | `^3.1.0` | 3.1.1 | 区间已覆盖，无需动 |
| `clsx` | `^2.0.0` | 2.1.1 | 区间已覆盖 |
| `prism-react-renderer` | `^2.3.0` | 2.4.1 | 区间已覆盖 |
| `react` / `react-dom` | `^18.2.0` | 19.2.8 | 主版本落后，见 1.5 |
| `remark-wiki-link-plus` | `^1.1.1` | 1.1.1 | 在用，但配置未生效（见 2.3 缺陷 3） |
| `rehype-katex` | `^7.0.0` | — | **未使用，应删** |
| `remark-math` | `^6.0.0` | — | **未使用，应删** |
| `hast-util-is-element` | `^3.0.0` | — | **未使用，应删** |
| `walk-sync` | `^3.0.0` | — | **仅被死代码引用，应删** |

## 1.2 必须移除的依赖：`docusaurus-theme-mdx-v2`

**现状**：`package.json` 固定 `"docusaurus-theme-mdx-v2": "0.1.2"`，并在 config 中注册：

```js
themes: [["mdx-v2", { customCss: [require.resolve("./src/css/custom.css")] }]],
```

**依据**：npm registry 查询显示该包 `time.modified` 为 **2022-07-20**，至今近 4 年零更新，且未声明任何 `peerDependencies`（意味着它对 Docusaurus 版本毫无约束，兼容性完全靠运气）。

**为什么它现在没有意义**：这个主题是 Docusaurus **v2** 时代用来提前启用 MDX v2 的兼容 shim。而 Docusaurus **3.x 已原生使用 MDX v3**，功能被完全覆盖。继续挂着它只带来两个后果：

1. 它是升级 3.10.2 乃至未来 v4 时最可能的兼容性阻塞点（无 peer 声明 = 不会有任何警告，只会在运行时炸）。
2. `customCss` 被**重复注入**：preset 的 `theme.customCss` 已经加载了 `src/css/custom.css`，这里又加载一次，同一份 CSS 在产物中出现两遍。

**方案**：从 `package.json` 删除该依赖，并删除 config 中整个 `themes: [...]` 块。这一步同时解决 CSS 重复注入。

## 1.3 未使用依赖清理

三个包在整个仓库中除 `package.json` 外**零引用**：

| 包 | 证据 |
|---|---|
| `rehype-katex` | 仅出现在 `docusaurus.config.js:41` 的注释 `// const katex = (await import('rehype-katex')).default;`，以及 `:71` 的 `// rehypePlugins: [katex],` |
| `remark-math` | 仅出现在 `docusaurus.config.js:40` 的注释 |
| `hast-util-is-element` | 全仓库搜索仅命中 `package.json:23` 自身 |

`walk-sync` 略有不同：它在 `docusaurus.config.js:9` 被 `require`，但只服务于第 12–29 行那段**从未被引用**的 `wikilink` 配置（详见 2.3 缺陷 3）。删除死代码后它也应一并移除。

数学公式渲染目前是关闭状态。若将来要开启，届时再装 `remark-math` + `rehype-katex` 并按官方文档补 KaTeX 的 CSS `stylesheets` 配置 —— 注意当前即便取消注释也**不会正常工作**，因为缺少 KaTeX 样式表引入。

> **⚠️ 反过来，有一个依赖绝对不能删：`remark-wiki-link-plus`。**
>
> 它不在上面的清理清单里，这里单独强调，因为它和悬浮预览弹窗是同一条链路。解包核对 `remark-wiki-link-plus@1.1.1` 的 `dist/index.cjs.js` 源码：
>
> ```js
> var newClassName     = opts.newClassName     || 'new';
> var wikiLinkClassName = opts.wikiLinkClassName || 'internal';   // ← 弹窗的选择器
> ```
>
> 而 `static/wikiPreviewBox.fixed.js:226` 正是：
>
> ```js
> var allLinkerLinks = document.querySelectorAll(".internal:not(.LinkerLink-bound)");
> ```
>
> 也就是说：**`class="internal"` 是弹窗唯一的挂载点，且全站只有这一个来源。** 线上页面实测渲染结果 `<a class="internal new" href="/exness-trader/股票">股票</a>` 与此完全吻合。删除该插件 → 609 处 wiki 链接退化为纯文本 → 内部链接预览弹窗全站失效。

## 1.4 安全更新

对 `package-lock.json`（v3 格式，1558 个包，解析出 1146 个具名包）逐版本比对 npm 官方漏洞库，**确认命中**（非潜在）如下：

| 严重度 | 条数 |
|---|---|
| critical | 2 |
| high | 40 |
| moderate | 36 |
| low | 10 |
| **受影响包数** | **39** |

两个 critical：

| 包 | 版本 | 问题 | 引入方 |
|---|---|---|---|
| `shell-quote` | 1.8.3 | 命令注入 | `launch-editor`（dev-server 的「在编辑器中打开」功能） |
| `websocket-driver` | 0.7.4 | 报文损坏（协议长度头滥用） | `sockjs` / `faye-websocket`（dev-server 热更新通道） |

**风险定级的关键限定**：这 88 条公告涉及的包**全部是构建期依赖**（webpack、babel、terser、svgo、postcss、dev-server 链路），不出现在访客下载的 JS 产物中。可利用路径只有两条：

1. 攻击者能向仓库注入恶意内容文件 —— 此时已有仓库写权限，漏洞不是主要问题；
2. 攻击者能访问本机 `yarn start` 开启的 dev-server —— 仅本地开发场景。

因此实际风险为**低到中**。但仍建议处理，因为绝大部分是「补丁早已发布、只因 lockfile 未刷新而滞留」，属纯卫生问题：

```bash
# 先按 1.2 / 1.3 清理依赖并统一包管理器（见 2.4 缺陷 5），再执行
yarn dedupe
yarn install
yarn build
```

`yarn dedupe` 只在现有 semver 区间内合并重复副本，不改 `package.json`，是风险最低的修复手段。

## 1.5 主版本升级评估

### Docusaurus 3.9.2 → 3.10.2（建议升级）

同一 major 内的 minor 升级，无破坏性变更。三个具体收益：

1. **`future.faster` 转正为稳定字段**（3.10 之前叫 `experimental_faster`）。对 425 页的站点，这是本项目最大的性能杠杆，详见 2.2。
2. **新增 `faster.gitEagerVcs`**：一次性读取整个 git 仓库来获取提交信息，替代逐文件 `git log` shell 调用。本项目同时开启了 `showLastUpdateTime` 与 `showLastUpdateAuthor`，425 个文件意味着构建期会 fork 数千次子进程 —— 这个开关正是为此设计的。
3. 明确了 `onBrokenMarkdownLinks` 的替代路径（见 2.4 缺陷 8）。

**升级前必须先完成 1.2**（移除 `docusaurus-theme-mdx-v2`），否则那个无 peer 声明的 4 年前主题是最可能的失败点。

### React 18 → 19（建议暂缓）

- **兼容性无阻碍**：`@docusaurus/core@3.10.2` 的 React peer 区间为 `^18.0.0 || ^19.0.0`，`@easyops-cn/docusaurus-search-local@0.55.3` 为 `^16.14.0 || ^17 || ^18 || ^19`，两者都已放行。
- **本项目的自定义 React 代码**共 4 个文件：`src/components/ads.js`、`src/components/HomepageFeatures/index.js`、`src/theme/MDXComponents.js`、`src/theme/TOCItems/index.js`。均为纯函数组件，未使用 `ref` 转发、`ReactDOM.render`、`findDOMNode` 或 legacy Context —— React 19 的移除项都没碰到。
- **但有一个风险点**：`ads.js` 的 `<style jsx>` 会向 DOM 传递非法布尔属性，React 19 对此类警告更严格。**建议先修完 2.3 缺陷 6，再考虑 React 19**。
- **收益近乎为零**：Docusaurus 3.x 未使用任何 React 19 独有能力，升级不带来性能或功能提升。

**结论**：真正的升级时机是 Docusaurus v4 发布时一并处理。registry 查询确认 `@docusaurus/core` 目前 `latest` 为 3.10.2，**不存在任何 4.x 版本**，v4 仍在开发中。

### 建立自动化依赖管理（强烈建议）

本项目落后 3 个 minor、留着 4 年前的停更主题、lockfile 陈旧 —— 根因是缺少自动化机制。新建 `.github/dependabot.yml`：

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
    groups:
      docusaurus:
        patterns: ["@docusaurus/*"]
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: monthly
```

配套建议增加一个 PR 触发的构建校验工作流（当前仓库只有 push 触发的部署，**没有任何 PR 校验**），这样 Dependabot 的升级 PR 能自动验证 425 页是否构建通过：

```yaml
name: CI
on:
  pull_request:
    branches: [main]
permissions:
  contents: read
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      NODE_OPTIONS: --max-old-space-size=8192
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: yarn
      - run: yarn install --frozen-lockfile
      - run: yarn build
```

---

# 第二部分：配置优化建议

## 2.1 SEO：两个全站级缺陷（最高优先级）

这一节的两条是本次审查中**投入产出比最高**的改动，均已通过线上抓取验证。

### 缺陷 1：navbar 注入的 `<h1>` 抢占了全站 425 页的主标题

**现状**：`docusaurus.config.js:105–109`

```js
{
  type: "html",
  position: "left",
  value: `<h1 class="font-extrabold"><a>WikiDoc</a></h1>`,
},
```

**线上实测**（抓取 `https://wiki.ssgg.net/exness-trader/标准账户`，按 DOM 顺序）：

```html
<h1 class="font-extrabold"><a>WikiDoc</a></h1>   ← navbar，排在前面
<h1>标准账户</h1>                                  ← 页面真实标题
```

**三个问题**：

1. **每页两个 h1**。HTML 规范虽允许多个 h1，但搜索引擎在判定页面主题时优先采信文档流中第一个 h1。结果是 425 个页面对外声明的主标题全是「WikiDoc」，各页实际主题（「标准账户」「如何入金」……）被降格。对一个靠长尾关键词获取搜索流量的帮助文档站，这是结构性损失。
2. **`<a>` 没有 `href`**。无 href 的锚点在 HTML 中不是链接，不可聚焦、不可点击、无语义，屏幕阅读器会读出一个无目标的链接。
3. 该元素还需要 `custom.css` 里的 `.font-extrabold`（`font-weight: 800; font-size: 1.7rem`）配合，与 navbar 的 logo（`.navbar__logo { height: 3rem; margin-right: -1.8rem }` —— 负边距硬调位）耦合在一起，属于用 CSS 硬凑的布局。

**方案**：navbar 品牌名应使用 Docusaurus 原生的 `title` 字段，它渲染为 `<b class="navbar__title">` 而非 `<h1>`，语义正确且自带跳转到首页的链接：

```js
navbar: {
  title: "WikiDoc",              // 新增，替代 type:"html" 的 h1 注入
  logo: {
    alt: "wikiDoc Logo",
    src: "img/logo.svg",
  },
  items: [
    // 删除整个 type:"html" 项
    {
      type: "dropdown",
      label: "EXNESS",
      // ...保持不变
    },
  ],
  hideOnScroll: true,
},
```

同时删除 `custom.css` 中的 `.font-extrabold` 规则，并把 `.navbar__logo` 的负边距（`margin-right: -1.8rem`）改为正常值 —— 那个负值是为了让注入的 h1 贴近 logo 才加的，移除 h1 后它会导致 logo 与 title 重叠。

**顺带说明**：`siteConfig.title` 当前是 `"wikiDoc"`（小写 w），而 navbar 注入的是 `"WikiDoc"`（大写 W）。页面 `<title>` 实测输出 `标准账户 | wikiDoc`。建议统一为 `WikiDoc` 一种写法。

### 缺陷 2：`description` 覆盖率 0.7%，搜索摘要里带着 Markdown 符号

**现状**：扫描全部 425 个文件的 frontmatter，完备度如下：

| 字段 | 覆盖数 | 覆盖率 |
|---|---|---|
| `title` | 365 | 85.9% |
| **`description`** | **3** | **0.7%** |
| `keywords` | 1 | 0.2% |
| `tags` | 5 | 1.2% |
| `sidebar_position` | 1 | 0.2% |
| `sidebar_label` | 0 | 0% |
| （完全无 frontmatter） | 60 | 14.1% |

**线上实测后果**：缺 `description` 时 Docusaurus 自动截取正文开头。该页输出：

```html
<meta name="description" content="- 标准账户最适合哪些交易者？">
<meta property="og:description" content="- 标准账户最适合哪些交易者？">
```

注意开头的 `- ` —— **Markdown 列表符号被原样带进了搜索结果摘要和社交分享描述**。422 个页面处于这个状态。

**方案**：这是 425 个文件的批量工作，建议分两步：

1. **先补 60 个无 frontmatter 的文件**。这些文件的 `title` 目前由文件名推导，而本项目文件名普遍是被截断的长句（如 `为什么我个人专区中可用保证金的金额与交易平台.mdx`、`如果我在自己的-vps-上安装智能交易ea，是否需要.mdx` —— 明显截断），推导出的标题质量差。补 `title` 的收益比补 `description` 更直接。
2. **再批量补 `description`**。可以写一个脚本提取每篇正文的第一段有效文字（跳过 `<Ads>`、wiki 链接行、列表符号），清理 Markdown 语法后截断到 150 字符，写入 frontmatter，然后人工抽查修订。425 篇纯手写不现实，脚本生成 + 抽查是合理路径。

**不建议补的**：`keywords`。Google 早已不使用 meta keywords，收益极低，不值得为 425 个文件投入。`tags` 同理 —— 而且启用 tags 会生成大量聚合页，反而需要额外处理抓取预算（见 2.5）。

### 已经正确的部分（不用改）

线上抓取确认以下 SEO 基础项 Docusaurus 已自动处理妥当，无需干预：

- `<link rel="canonical">` 正确输出且与 `trailingSlash: false` 一致
- `hreflang` 输出 `zh-Hans` 与 `x-default` 两条，符合单语言站点的预期
- `BreadcrumbList` JSON-LD 自动生成，层级正确
- `<html lang="zh-Hans" dir="ltr">` 正确
- `og:url` / `og:locale` / `og:title` 齐备
- 无外链脚本注入（`<script src="https://...">` 为 0）

## 2.2 性能优化

### 优化 1：启用 Docusaurus Faster（本项目收益最大的一项）

**现状**：未安装 `@docusaurus/faster`，未配置 `future`。构建走默认 webpack + Babel + Terser + cssnano 链路。425 个 MDX 文件 + `showLastUpdateAuthor: true` 的组合让构建期同时承受两个瓶颈：webpack 打包，以及数千次 `git log` 子进程调用。

**依据**：`future.faster` 在 3.10 已转正为稳定字段，切换到 Rspack + SWC + Lightning CSS。官方给出的量级是冷构建快 3–4 倍、Rspack 内存占用显著下降。其中 `gitEagerVcs` 直接针对本项目的 git 瓶颈。

**本项目适配性评估**：

| 检查项 | 结果 |
|---|---|
| 自定义插件是否用 `configureWebpack` | **无**（config 里只有 search-local 一个插件，官方已列入 Faster 兼容清单） |
| 是否用 `postBuild({head})` | **无** → 可安全开启 `removeLegacyPostBuildHeadAttribute` |
| 自定义 remark 插件 | `remark-wiki-link-plus` —— 纯 AST 变换，不涉及 bundler，兼容 |
| swizzle 组件 | `MDXComponents.js` / `TOCItems/index.js` —— 均为 wrapper 模式，兼容 |
| **阻塞项** | **`docusaurus-theme-mdx-v2`** —— 必须先按 1.2 移除 |

**方案**（顺序不能颠倒）：

```bash
# 1. 先移除停更主题（1.2）
yarn remove docusaurus-theme-mdx-v2
# 2. 升级到 3.10.2
yarn up "@docusaurus/core@3.10.2" "@docusaurus/preset-classic@3.10.2" "@docusaurus/module-type-aliases@^3.10.2"
# 3. 再装 faster
yarn add @docusaurus/faster
```

```js
future: {
  v4: { removeLegacyPostBuildHeadAttribute: true },
  faster: true,
},
```

开启后 SWC 取代 Babel，**`babel.config.js` 变为冗余，Docusaurus 会打印告警提示删除** —— 本项目的 `babel.config.js` 只有一行 preset 引用，可直接删。

**注意**：这里刻意只开 `v4.removeLegacyPostBuildHeadAttribute` 而**不用 `v4: true` 简写**。因为 `v4: true` 会一并开启 `mdx1CompatDisabledByDefault`，要求内容使用严格 MDX 语法。本项目内容侧的 v4 兼容性其实不错（见 2.6），但 425 个文件建议单独验证后再全量开启。

**CI 补充**：Rspack 持久化缓存写在 `node_modules/.cache`，CI 每次全新安装拿不到。若要让 CI 也受益：

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules/.cache
    key: docusaurus-${{ hashFiles('yarn.lock') }}-${{ github.sha }}
    restore-keys: docusaurus-${{ hashFiles('yarn.lock') }}-
```

### 优化 2：`favicon.ico` 105 KB

**现状**：`static/img/favicon.ico` 为 **105,718 字节**，是整个 `static/` 目录（220 KB）中最大的单个文件，占比接近一半。

**问题**：favicon 在每个页面首次访问时都会被请求。105 KB 的 `.ico` 通常意味着打包了多个尺寸的未压缩位图（常见 16/32/48/64/128/256 全尺寸 BMP）。

**方案**：项目已有 `static/img/favicon.svg`（4,391 字节）。现代做法是以 SVG 为主、保留一个精简 `.ico` 兜底：

```js
favicon: 'img/favicon.svg',   // 当前已是此配置，无需改
```

配置本身没问题 —— 但 105 KB 的 `.ico` 仍会被复制进产物，且浏览器可能按 `/favicon.ico` 约定路径请求它。建议用工具重新生成一个只含 16×16 与 32×32 的 `.ico`（通常 <5 KB），或确认无需兜底后直接删除。

### 优化 3：340 处图片依赖 jsDelivr 的非官方测试子域

**现状**：扫描 425 个文件，外部资源引用分布如下：

| 域名 | 引用次数 |
|---|---|
| `testingcf.jsdelivr.net` | **340** |
| `cdn.fendou.la` | 4 |
| `www.youtube-nocookie.com` | 3 |
| `www.youtube.com` | 2 |

**实测数据（各 5 次采样）**：

| 域名 | 延迟范围 | 中位数 |
|---|---|---|
| `testingcf.jsdelivr.net`（当前使用） | 1.15 – 3.38 s | ~1.40 s |
| `cdn.jsdelivr.net`（官方） | 0.93 – 4.62 s | ~1.73 s |

**必须说明**：两者延迟**没有显著差异**，波动都很大。我最初单次采样得到 6.36 s vs 1.91 s，据此判断「非官方域慢 3.3 倍」—— 多次采样后这个结论不成立，已撤回。**速度不是问题所在。**

**真正的问题是可用性保障**：`testingcf.jsdelivr.net` 是 jsDelivr 的测试子域（`testingcf` = testing + Cloudflare），不在其正式 SLA 覆盖范围内，随时可能调整或下线。340 张图片全部指向这一个域，构成单点故障 —— 一旦该子域变更，全站图片同时裂掉。

**方案**（按成本递增）：

1. **最低成本**：全库替换 `testingcf.jsdelivr.net` → `cdn.jsdelivr.net`。延迟相当，但换到官方域后有 SLA 保障。一条 `sed` 即可，340 处一次搞定。
2. **更稳妥**：图片本就存在自己的 GitHub 仓库 `jarlin8/OSS`，可考虑迁到对象存储 + 自有 CDN，摆脱对 jsDelivr 的依赖（jsDelivr 在国内的可达性历史上有波动）。
3. 无论选哪种，建议同时给 Markdown 图片补上尺寸信息以消除布局偏移（CLS）—— Docusaurus 支持 `![alt](url#width=800&height=600)` 语法。

**关于 `cdn.fendou.la`**：初测返回 HTTP 000，我一度判断为生产故障。经排查该失败源于本机 Windows schannel 的证书吊销检查脱机（`CRYPT_E_REVOCATION_OFFLINE`），跳过校验后复测为 HTTP 200 / 0.88 s，**服务端正常**。同样已撤回误判。

## 2.3 确定性代码缺陷

以下都是已在生产环境生效、但不易察觉的问题。

### 缺陷 3：`custom.css` 三处失效代码

**（a）拼写错误导致正文字体从未生效** —— `src/css/custom.css:23`

```css
--ifm-font-famliy-base: "Trebuchet MS", ...;   /* famliy → family */
```

Infima 的变量名是 `--ifm-font-family-base`。当前拼写下这个自定义变量从未被任何样式消费，站点正文一直在用 Infima 默认字体栈。**修正拼写前请先确认这是否是你想要的效果** —— 有可能默认字体栈的中文显示其实更好，那就应该直接删掉这一行而不是修拼写。

**（b）代码块被设成非等宽字体** —— `:21–22`

```css
--ifm-font-family-monospace: "Trebuchet MS", "Lucida Sans Unicode",
  "Lucida Grande", "Lucida Sans", Arial, sans-serif;
```

这里列出的全是**比例字体**，没有一个是等宽字体。后果是所有代码块、行内代码的字符宽度不一致，缩进和对齐全部错乱 —— 对一个含 MT4/MT5 配置说明、参数表的文档站，这直接影响可读性。同样的问题在 `:65–68` 的 `code` 规则里重复了一次。

建议改回等宽栈：

```css
--ifm-font-family-monospace: ui-monospace, SFMono-Regular, "SF Mono",
  Menlo, Consolas, "Liberation Mono", monospace;
```

**（c）脚注引用字号 1px** —— `:71–77`

```css
.footnote-ref {
  ...
  font-size: 1px;   /* 疑似应为 1rem 或 0.75rem */
}
```

`1px` 的文字在实际渲染中不可读、也几乎无法点击。这看起来是 `1rem` 漏写单位造成的。

**（d）附带两个非缺陷但值得处理的问题**：

- **主色与派生色不匹配**：`--ifm-color-primary: #0bb45b`（亮绿），但 `-dark` / `-darker` / `-darkest` / `-light` / `-lighter` / `-lightest` 六个派生变量仍是脚手架默认的 `#29784c` 系列（暗绿）。后果是按钮/链接的 hover、active 状态会出现色调跳变。建议用 Docusaurus 官方的 Infima 配色生成器重算一整套。
- **`button` 全局选择器污染主题** — `:56–63`：

  ```css
  button { font-size: 16px; color: white; background: #1877f2; border-radius: 8px; ... }
  ```

  这会命中 Docusaurus 主题内**所有** `<button>` 元素 —— 包括侧边栏折叠按钮、暗色模式切换、代码块复制按钮、搜索框、移动端汉堡菜单。它们会全部变成蓝底白字。建议改为带类名的选择器，只作用于内容区自定义按钮。

- `:root` 中有 6 处 `!important`（字号与侧边栏宽度）。`!important` 会阻断后续通过更具体选择器做局部调整的可能，建议去掉 —— 这些变量本身优先级已经足够。

### 缺陷 4：`ads.js` 使用了 Docusaurus 不支持的 `<style jsx>`，影响 360 个页面

**现状**：`src/components/ads.js` 末尾：

```jsx
<style jsx>{`
  @media (max-width: 767px) {
    .atfx-container { flex-direction: column; }
    ...
  }
`}</style>
```

**问题**：`<style jsx>` 是 **Next.js 的 styled-jsx** 语法，需要对应的 Babel 插件才能编译成作用域 CSS。Docusaurus 使用 CSS Modules，**不含该插件**。因此：

1. `jsx` 会被当作普通 DOM 属性传给 `<style>`，React 抛出警告 `Received 'true' for a non-boolean attribute 'jsx'`。
2. **CSS 不会被作用域化**，而是以全局样式注入。这里因为选择器带 `.atfx-container` 前缀所以实际影响有限，但机制上是样式泄漏。

**影响面**：扫描确认 **360 个 `.mdx` 文件（占 425 的 84.7%）使用了 `<Ads>` 组件**（通过 `src/theme/MDXComponents.js` 全局注册）。

**方案**：改用 CSS Modules。新建 `src/components/ads.module.css` 存放媒体查询，组件内 `import styles from './ads.module.css'`，把 `className="atfx-container"` 换成 `className={styles.atfxContainer}`。同时可把现有的一堆内联 style 对象一并迁进去 —— 内联样式无法写媒体查询和伪类，这也是当初不得不引入 `<style jsx>` 的原因。

**同一文件的另外两个问题**：

- **`adstyle` 是死变量**（`:3–7`，定义了 `width: '880px'` 但从未使用）—— 可删。
- **`containerStyle.backgroundColor: 'white'` 硬编码**。站点 `colorMode.defaultMode` 是 `'dark'`，暗色模式下这 360 个页面会出现一块白底方块。同理 `textStyle.color: 'deeppink'` 在暗色背景上也很突兀。应改用 Infima 变量：`var(--ifm-background-surface-color)` 与 `var(--ifm-font-color-base)`。

### 缺陷 5：`TOCItems` 侧边栏广告的暗色模式与布局偏移

**现状**：`src/theme/TOCItems/index.js` 注入了两个广告，问题有三：

```jsx
<img style={{ ..., background: 'white', ... }}     // 暗色模式白块
     src="https://cdn.fendou.la/bluehost/ATFX-ads.svg"   // 无 width/height
     className="size-full wp-image-24489 aligncenter"    // WordPress 残留类名
/>
```

1. `background: 'white'` 硬编码 —— 与缺陷 4 同因，出现在**所有**文档页的右侧目录下方。
2. `<img>` 无 `width`/`height`，且资源来自外部域 —— 图片加载完成时会挤压布局，产生累积布局偏移（CLS）。这是 Core Web Vitals 的三大指标之一。
3. `className="size-full wp-image-24489 aligncenter"` 是从 WordPress 复制过来的类名，在本项目中无对应样式定义，纯噪声。

第二个「嘉盛集团」链接直接裸放在 TOC 下面，无任何容器或间距样式，与上方广告卡片风格不一致。

**方案**：把两个广告块抽成一个组件（如 `src/components/SidebarAds/`）配 CSS Module，统一：用 Infima 背景变量、补明确尺寸、去掉 WordPress 类名、给两个广告统一间距。

### 缺陷 6：wiki 链接配置是死代码，且若「修好」会立刻全站崩链

**现状**：`docusaurus.config.js:12–29` 定义了完整的 `wikilink` 配置数组：

```js
const wikilink = [
  wikiLinkPlugin,
  {
    pageResolver: (wikilink) => {
      const paths = walkSync("docs", {
        globs: ["**/" + wikilink + ".md"],     // 注意：只匹配 .md
        directories: false,
      }).map((path) => basename(path, ".md"));
      return paths.length ? paths : ["404"];
    },
    hrefTemplate: (permalink) => `/${permalink}`,
    aliasDivider: "|",
  },
];
```

但第 70 行实际写的是：

```js
remarkPlugins: [wikiLinkPlugin],   // 传的是裸插件，不是配置好的 wikilink
```

**`wikilink` 这个变量从头到尾没有被引用过** —— 整段配置连同 `walk-sync` 依赖都是死代码。

**站点为什么仍然正常**：我解包核对了 `remark-wiki-link-plus@1.1.1` 的 dist 源码，其内置默认值恰好与死代码里写的一致 —— `aliasDivider` 默认 `'|'`（`index.esm.js:439`），`hrefTemplate` 默认 `` `/${permalink}` ``（`:28–30`）。因此 609 处 wiki 链接（其中 608 处使用 `[[页面|别名]]` 别名语法）**侥幸工作**。

**真正危险的是：如果把这段配置接上去，wiki 链接会立刻全部指向 `/404`。** 原因是 `globs` 只匹配 `.md`，而 `docs/` 下**有 425 个 `.mdx`、0 个 `.md`** —— glob 匹配不到任何文件，`paths.length` 恒为 0，`pageResolver` 一律返回 `["404"]`。

**附带发现：609 处链接全部带着多余的 `new` 类。** 插件源码中 `exists` 的判定依赖 `permalinks` 选项，而裸插件没传，`permalinks` 退化为 `[]`，导致 `permalink` 永远找不到、`exists` 恒为 `false`，于是每个链接都被追加 `new` 类（`classNames += ' ' + newClassName`）。`'new'` 的语义是「目标页面不存在」—— 但这些页面其实是存在的。**目前 609 个链接全都被误标为「页面缺失」**（链接本身能正常跳转，只是类名不对）。如果 CSS 里有 `.new { color: ... }` 之类的样式，视觉上也会被误伤。

**方案（分两步，第一步必须做，第二步可选）**：

**第一步 —— 删除死代码（必做）**：删除 `:12–29` 的 `wikilink` 定义、`:9` 的 `walkSync` 引入、`:10` 的 `basename` 引入，以及 `package.json` 里的 `walk-sync`。**不要按原样「修复」这段配置** —— 它会把所有链接打到 `/404`。

**第二步 —— 用 `markdownFolder` 替代（可选，推荐）**：如果希望在保留弹窗的同时消掉误标的 `new` 类，正确写法不是自己写 `pageResolver`，而是用插件内置的 `markdownFolder` 选项。解包源码确认它能正确处理 `.mdx`：

```js
// remark-wiki-link-plus@1.1.1  dist/index.cjs.js:476-478
permalinks: opts.markdownFolder
  ? getFiles(opts.markdownFolder).map((file) => file.replace(/\.mdx?$/, ''))  // 同时认 .md 和 .mdx
  : opts.permalinks
```

`docusaurus.config.js` 改一行即可（注意 `getFiles` 基于 `process.cwd()`，路径写 `'docs'`）：

```js
const wikiLinkPlugin = require("remark-wiki-link-plus");

// ...
remarkPlugins: [[wikiLinkPlugin, { markdownFolder: "docs", aliasDivider: "|" }]],
```

这样 425 个 `.mdx` 会被自动收进 `permalinks`，`exists` 判定为 `true`，`new` 类消失，且 `hrefTemplate` 仍走内置的 `` `/${permalink}` `` 默认值 —— 与现有线上 URL 完全一致，不会造成任何链接变化。**改完后务必抽查若干页面，确认 wiki 链接的 `href` 与改动前逐字一致。**

## 2.4 CI 与构建可复现性

### 缺陷 7：CI 里 `yarn add` 绕过 lockfile，构成供应链风险

**现状**：`.github/workflows/run-npm.yml`

```yaml
- run: yarn install --check-files
- run: yarn add @easyops-cn/docusaurus-search-local    # ← 问题所在
- run: yarn build
```

**三个问题**：

1. **`yarn add` 每次构建都从 registry 拉取当时的最新版本**，完全绕过 lockfile。这意味着上游任何一次发布 —— 包括被投毒的版本 —— 都会在下一次部署时直接进入生产产物，没有任何人工审核环节。而该包**已在 `package.json` 的 `dependencies` 中声明**（`^0.52.2`），这一步纯属冗余。
2. **`--check-files` 是 Yarn Classic 语法，只校验 `node_modules` 完整性，不锁定版本**。锁定版本应用 `--frozen-lockfile`（Yarn 1）或 `--immutable`（Yarn Berry）。
3. **`actions/checkout@v4` 缺 `fetch-depth: 0`**（默认浅克隆，只有 1 个提交）。而本项目同时开启了 `showLastUpdateTime: true` 和 `showLastUpdateAuthor: true` —— 构建时 `git log` 拿不到真实历史，425 个文件的「最后更新于」会全部退化成同一个时间（最近一次部署时间），作者信息也不准。

   **附带确认**：你本地这份仓库也是浅克隆（`.git/shallow` 存在，`git rev-list --count HEAD` = 1），所以**本地 `yarn build` 时这两个字段同样是失效的**。

### 缺陷 8：`set NODE_OPTIONS=` 在 ubuntu CI 上静默失效

**现状**：`package.json` 的三个脚本：

```json
"start": "set NODE_OPTIONS=--max-old-space-size=8192 && docusaurus start",
"build": "set NODE_OPTIONS=--max-old-space-size=8192 && docusaurus build",
"serve": "set NODE_OPTIONS=--max-old-space-size=8192 && docusaurus serve"
```

**问题**：`set VAR=value &&` 是 cmd.exe 语法。CI 跑在 `ubuntu-latest`，shell 是 bash —— bash 把 `set NODE_OPTIONS=--max-old-space-size=8192` 解析为内建命令 `set` 带一个参数，**静默成功但不设置任何环境变量**，随后 `docusaurus build` 以 Node 默认堆上限运行。

也就是说：**你为 425 个 MDX 文件准备的 8 GB 堆上限，在 CI 里从未生效过**。目前没爆是运气 —— 内容量继续增长会出现难以定位的 OOM。

**方案**：环境变量交给 CI 设置，脚本保持干净（跨平台）：

```json
"start": "docusaurus start",
"build": "docusaurus build",
"serve": "docusaurus serve"
```

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      NODE_OPTIONS: --max-old-space-size=8192
```

本地若需要更大堆，用 `cross-env` 或直接在 shell 里 export。注意：按 2.2 启用 Rspack 后内存占用会显著下降，这个上限可能就不再需要了。

### 缺陷 9：双 lockfile 并存，且 `yarn.lock` 已被污染

**现状**：仓库同时存在：

- `package-lock.json` —— npm v3 格式，1558 个包
- `yarn.lock` —— **Yarn Classic v1** 格式

CI 用 yarn（`cache: yarn`），但 npm lockfile 仍在版本控制中。任何用 `npm install` 的人会得到与 CI 完全不同的依赖树。

**更明确的证据**：`yarn.lock` 中出现了 **16 处 `@ai-sdk/*` 条目**（如 `@ai-sdk/gateway@2.0.27`）—— 这些包与 Docusaurus 站点毫无关系，说明该 lockfile 曾被无关的安装操作污染。

**方案**：

```bash
# 确定用 yarn（与 CI 一致）
rm package-lock.json
rm -rf node_modules yarn.lock
yarn install          # 重建干净的依赖树
```

并在 `package.json` 加 `packageManager` 字段固定版本，避免团队成员/CI 用不同 yarn 大版本：

```json
"packageManager": "yarn@1.22.22"
```

若打算迁到 Yarn Berry（4.x），需同步把 CI 的 `--frozen-lockfile` 改为 `--immutable` 并加 `.yarnrc.yml`。**建议先做清理，迁 Berry 单独排期。**

### 缺陷 10：Python 数据脚本写入 `docs/`，会触发全站重建

**现状**：仓库根目录有两个与文档站无关的股票数据脚本，配三个定时/手动工作流（`dragon.yml`、`wencai.yml`、`dragon-score.yml`）。关键在输出路径：

```python
# wencai.py:28
file_path = './docs/data_' + mtime + '.csv'
# dragonrank.py:28
file_path = './docs/dragon_' + mtime + '.csv'
```

**三个条件叠加成一个定时炸弹**：

1. 输出目标是 `./docs/` —— Docusaurus 的内容目录，且文件名带日期戳，**会无限累积**。
2. `.gitignore` **未排除** `*.csv`，所以这些文件会被 git 跟踪并永久留在历史里。
3. `run-npm.yml` 的触发条件是 `on: push: branches: [main]`，**没有 `paths` / `paths-ignore` 过滤**。

结果：`wencai.yml` 按 `cron: "30 10 * * 1,2,3,4,5"` 每个交易日运行 → 往 `docs/` 写 CSV 并提交 → 触发 `run-npm.yml` → **每个交易日把 425 页站点完整重建部署一次**。同时 git 历史每天多一个提交，`docs/` 目录逐日膨胀。

**当前状态**：`docs/` 下暂无 CSV（`find docs -name "*.csv"` = 0），本地仓库是浅克隆所以无法从历史确认是否曾运行过。但代码路径是确定的。

**方案**（三处都要改）：

1. **改输出路径**，离开 `docs/`：
   ```python
   file_path = './data/wencai_' + mtime + '.csv'
   ```
2. **`.gitignore` 排除数据产物**（若不需要版本化）：
   ```
   /data/*.csv
   ```
3. **给部署工作流加路径过滤**，让股票数据提交不再触发站点重建：
   ```yaml
   on:
     push:
       branches: [main]
       paths:
         - 'docs/**'
         - 'src/**'
         - 'static/**'
         - 'docusaurus.config.js'
         - 'sidebars.js'
         - 'package.json'
         - 'yarn.lock'
   ```

**更根本的建议**：股票数据抓取与文档站是两件不相干的事，共用一个仓库会持续制造这类耦合。若这些脚本还在用，建议拆到独立仓库；若已不用，直接删除脚本与三个工作流。

## 2.5 配置细节与静态资源

### `sitemap` 使用了无效字段

```js
sitemap: {
  changefreq: "daily",    // Google 已明确声明不使用
  priority: 0.8,          // 同上
  ignorePatterns: ["/tags/**"],
  filename: "sitemap.xml",
}
```

`changefreq` 与 `priority` 是纯噪声，Google 官方多次说明不参考这两个字段。建议设为 `null`。另外 425 页全部标 `changefreq: daily` 反而是错误信号 —— 帮助文档不会每天变。

同时建议启用 `lastmod`（依赖 `fetch-depth: 0` 修复后才准确）：

```js
sitemap: {
  lastmod: 'date',
  changefreq: null,
  priority: null,
  ignorePatterns: ["/tags/**", "/search"],
  filename: "sitemap.xml",
}
```

### `onBrokenMarkdownLinks` 已弃用

`docusaurus.config.js:48` 使用根级 `onBrokenMarkdownLinks: "warn"`。官方配置文档（3.10.2）标注：*"Deprecated in Docusaurus v3.9, and will be removed in Docusaurus v4. Replaced by `siteConfig.markdown.hooks.onBrokenMarkdownLinks`"*。当前会打印弃用告警，v4 直接失效。

```js
markdown: {
  hooks: {
    onBrokenMarkdownLinks: 'warn',
    onBrokenMarkdownImages: 'throw',
  },
},
onBrokenAnchors: 'warn',      // 未设置，默认 warn；425 页 + 609 wiki 链接，建议先保持 warn 观察
onDuplicateRoutes: 'throw',   // 未设置
```

注意：`onBrokenLinks` 已经是 `"throw"`，但 `onBrokenAnchors` 建议**先用 `warn`** —— 609 处 wiki 链接中有大量带 `#锚点` 的形式（如 `[[ea-setup#限制手数跑波动|跑波段]]`），直接设 `throw` 可能让构建大面积失败，应先看告警量再决定。

### 搜索索引包含了不存在的语言

```js
language: ["zh", "en"],
```

站点 `i18n.locales` 只有 `["zh-Hans"]`，没有英文版本。同时索引英文会让 `@easyops-cn/docusaurus-search-local` 额外生成英文分词索引，增大索引体积与首次搜索的加载量。

不过需要注意：本项目内容里混有大量英文技术词（MT4、Exness、VPS、CFD 等）。`language: ["zh", "en"]` 可能是刻意为之，用于让这些英文词能被正确分词检索。**如果搜索英文关键词的场景确实存在，应保留**；若只搜中文，改为 `["zh"]` 可减小索引。建议实测后决定。

另外可补两个体验项：`searchResultLimits`（默认 8，425 页的站点可以调大到 12）与 `searchBarShortcut`（默认已开启 Ctrl/Cmd+K）。

### `static/wikiPrevBox/` 是在线弹窗的自托管源，不是死文件（原判有误，已更正）

> **更正说明**：初版报告将此目录定性为「88 KB 死文件，可以整目录删除」。这个判断是错的 —— 我把它当成了孤立文件，没有追到它服务的那条功能链路。实际核查后：**弹窗功能是在线的、被依赖的，这个目录是它的样式来源副本。**

**功能链路（四环，缺一不可）**：

```
① remark-wiki-link-plus（构建期）
      ↓ 把 [[页面|别名]] 编译成 <a class="internal" href="/xxx">
② Docusaurus 输出 HTML
      ↓
③ docusaurus.config.js:34-39  scripts 注入 /wikiPreviewBox.fixed.js（运行期）
      ↓ 500ms 后扫描 .internal / [href*=wikipedia.org]，绑定 hover
④ 从 https://niu.fendou.la/wikiPrevBox/ 拉取 .min.css + w.svg + starlink.svg
      ↓
   悬浮预览弹窗
```

**逐环实测核验**：

| 环节 | 验证方式 | 结果 |
|---|---|---|
| ① 插件产出 `internal` 类 | 解包 `remark-wiki-link-plus@1.1.1` 源码 | `wikiLinkClassName` 默认值即 `'internal'`，确认 |
| ① 线上确实渲染出该类 | 抓取 `/exness-trader/标准账户` | `<a class="internal new" href="/exness-trader/股票">股票</a>` |
| ③ 脚本被加载 | 同一页面 HTML | `<script src="/wikiPreviewBox.fixed.js" defer="defer"></script>`，确认 |
| ④ CSS 可达 | curl 实测 | HTTP 200 / 3846 B |
| ④ `starlink.svg` 可达 | curl 实测 | HTTP 200 / 1590 B，是有效 SVG |
| 弹窗内容容器存在 | 页面 HTML | `class="theme-doc-markdown markdown"` —— 与脚本里的 `doc.querySelector('.markdown')` 匹配，内部预览能取到内容 |

**本地副本与 CDN 是同一份东西**：把 `static/wikiPrevBox/wikiPreviewBox.min.css` 与 CDN 上那份做 MD5 比对，**完全一致**（`4031f0092b016fbb906bee4d01a689cc`，3846 B）。所以改自托管是零风险的等价替换。

**建议（不是删除，是改自托管）**：把 `wikiPreviewBox.fixed.js` 里的三个外链改成本地路径，消除对第三方域的运行时依赖：

```js
// static/wikiPreviewBox.fixed.js:27
- 'https://niu.fendou.la/wikiPrevBox/wikiPreviewBox.min.css'
+ '/wikiPrevBox/wikiPreviewBox.min.css'

// :172  维基弹窗页脚 logo
- "https://niu.fendou.la/wikiPrevBox/w.svg"
+ "/wikiPrevBox/w.svg"

// :286  内部链接弹窗页脚 logo
- "https://niu.fendou.la/wikiPrevBox/starlink.svg"
+ "/wikiPrevBox/starlink.svg"
```

配套的收尾动作：

1. `starlink.svg` **本地没有**，需从 CDN 下载一份放进 `static/wikiPrevBox/`（1590 B）。
2. `w.svg` 本地 776 B vs CDN 815 B，**版本略有出入**，建议用 CDN 那份覆盖。
3. 以下确属 MkDocs 时代遗留、与当前弹窗无关，可删：`mkdoc.min.js`(14 KB)、`mkdoc.min.css`(5.7 KB)、`js-preview.js`(11.6 KB)、`popup.js`(4.8 KB)、`SegoeWP-Semilight.woff2`(20 KB)、`wiki-W.woff2`(2.9 KB)、`bullet.gif`。非压缩版 `wikiPreviewBox.js` / `wikiPreviewBox.css` 建议保留作可读源。

**为什么值得改**：目前弹窗样式挂在 `niu.fendou.la` 这个第三方域上，没有 SRI、没有版本锁定、没有可用性保障。该域一旦下线或证书到期，弹窗会以无样式状态渲染在页面上（容器仍会插入，但失去定位与外观），直接干扰阅读。改成本地 `static/` 后，资源随站点一起构建、一起缓存、一起版本化。

> **⚠️ 实施时才发现的坑：只改 JS 里的 3 个 URL 是不够的。**
>
> `wikiPreviewBox.min.css` 自身还内嵌了 **4 处** CDN 引用（实测 `grep url()` 结果）：
>
> ```
> url(https://niu.fendou.la/wikiPrevBox/w.svg)          × 1
> url(https://niu.fendou.la/wikiPrevBox/bullet.gif)     × 2
> url(https://niu.fendou.la/wikiPrevBox/starlink.svg)   × 1
> ```
>
> 只把 JS 的 `<link href>` 指向本地，CSS 里的图标仍会回源第三方域 —— 自托管等于只做了一半。必须把 `min.css` 内的 `https://niu.fendou.la/wikiPrevBox/` 前缀**也整体替换**为 `/wikiPrevBox/`。
>
> 另外两个字体（`SegoeWP-Semilight.woff2` 20 KB、`wiki-W.woff2` 2.9 KB）只出现在**未压缩的** `wikiPreviewBox.css` 的 `@font-face` 里，`min.css` 中并没有 —— 也就是说实际生效的样式根本不加载它们，属于可清理项。版本化。

### 弹窗脚本自身的三个缺陷（在 2.5 性能项里一并处理）

| 缺陷 | 位置 | 后果 |
|---|---|---|
| **维基百科外链点击被无条件拦截** | `wikiPreviewBox.fixed.js:99-101`，`link.addEventListener("click", e => e.preventDefault())` | 全站 **85 处**维基百科外链**点了没反应**，用户无法跳转。建议改为：仅当弹窗可见且鼠标在链接上时才拦截，或加 `e.metaKey/ctrlKey` 放行 |
| 每次 hover 都 `fetch` 整页 HTML，无防抖、无缓存 | `:247 → :257 getLinkerPreviewData` | 同一个链接反复悬停会重复下载整页（单页 HTML 实测 130 KB+）。建议加 200 ms 防抖 + `Map` 结果缓存 |
| `setInterval(checkUrlChange, 500)` 永久运行 | `:340` | 每 500 ms 做一次字符串比较，与 `popstate` / `pushState` 钩子 / MutationObserver 三重冗余。SPA 路由下 `popstate` + `pushState` 已足够，可去掉该定时器 |

### `src/pages/` 下的两个残留文件

| 文件 | 问题 |
|---|---|
| `src/pages/index.module.css` | **孤儿文件**。`src/pages/` 下没有 `index.js`（首页由 `docs/index.mdx` + `routeBasePath: "/"` 提供），这个 CSS Module 无任何消费者 |
| `src/pages/markdown-page.md` | **Docusaurus 脚手架残留**，内容是 "You don't need React to write simple standalone pages."。它会生成 `/markdown-page` 路由并被 sitemap 收录 —— 一个对外可见的示例垃圾页 |

两个都建议删除。删除 `markdown-page.md` 后记得确认 sitemap 已不含该 URL。

同时 `src/components/HomepageFeatures/` 也需要核实：首页是 `docs/index.mdx`，而 `HomepageFeatures` 通常由 `src/pages/index.js` 消费 —— 若确认无引用，可一并删除（它还引用了 `clsx`）。

## 2.6 Docusaurus v4 迁移面（内容侧状况良好）

3.10 发布说明提出「Strict MDX」方向，v4 将默认关闭 `markdown.mdx1Compat`。对本项目 425 个文件的实际存量统计：

| 待处理项 | 命中数量 | 评价 |
|---|---|---|
| `.mdx` 扩展名占比 | **425 / 425（100%）** | 完全符合 v4 方向，无需改名 |
| HTML 注释 `<!-- -->` | **0 处** | 无需处理 |
| 专有 heading ID `{#id}` | **0 处** | 无需处理 |
| 已弃用的 `:::caution` | **0 处** | 无需处理 |
| 专有 admonition 标题 `:::type 标题` | **1 处** | 改成 `:::type[标题]` 即可 |

**内容侧的 v4 兼容性几乎是满分** —— 唯一的实质阻塞是 `docusaurus-theme-mdx-v2`（见 1.2）。这意味着完成依赖清理后，本项目升级 v4 的成本会非常低。

**一个需要留意的变量**：609 处 `[[wiki 链接]]` 依赖 `remark-wiki-link-plus@1.1.1`。该包生态活跃度不高，v4 升级时需验证它与新版 MDX 编译链的兼容性。建议在 v4 发布后先用一个分支验证这 609 处链接是否仍正常解析。

**这一项的验证重点不是「链接能不能跳转」，而是 `class="internal"` 是否还在。** 该类名是悬浮预览弹窗唯一的挂载点（见 2.5）。v4 若更换 MDX 编译链导致插件失效，链接可能仍然渲染成 `<a>` 而类名丢失 —— 那样跳转正常、弹窗静默失效，很容易在验收时被漏掉。回归时应直接检查渲染产物中是否存在 `class="internal"`。

## 2.7 建议执行顺序

分四批，每批内部可合并成一个提交。前两批不改变站点行为或只做纯收益修复，可以放心推进。

**第一批：SEO 修复（收益最大）**
1. 移除 navbar 的 `type: "html"` h1 注入，改用 `navbar.title`；同步删除 `custom.css` 的 `.font-extrabold` 与 `.navbar__logo` 负边距
2. 统一 `siteConfig.title` 与 navbar 品牌名大小写
3. 补全 60 个无 frontmatter 文件的 `title`
4. 脚本批量生成 422 个文件的 `description`，人工抽查

**第二批：确定性缺陷修复**
5. `custom.css`：修 `--ifm-font-famliy-base` 拼写（或删除）、`--ifm-font-family-monospace` 改回等宽栈、`.footnote-ref` 字号、去掉 `button` 全局选择器、重算主色派生系列
6. `ads.js`：`<style jsx>` 改 CSS Module、删 `adstyle` 死变量、白底改 Infima 变量
7. `TOCItems`：抽成组件 + CSS Module，补图片尺寸，去 WordPress 类名
8. 修 CI：去掉 `yarn add`、`--check-files` → `--frozen-lockfile`、加 `fetch-depth: 0`、`NODE_OPTIONS` 移入 `env`、npm 脚本去掉 `set`

**第三批：清理（纯删除，无行为变更）**
9. 删 `docusaurus-theme-mdx-v2` 及 config 的 `themes` 块（同时解决 CSS 重复注入）
10. 删未使用依赖：`rehype-katex`、`remark-math`、`hast-util-is-element`、`walk-sync`
11. 删 `wikilink` 死代码块（`:12–29`）及 `walkSync`/`basename` 引入
12. 删 `src/pages/index.module.css`、`src/pages/markdown-page.md`；核实后删 `HomepageFeatures`
13. 处理 `static/wikiPrevBox/`（整删，或改 fixed.js 为本地路径后只删无用副本）
14. 重新生成精简 `favicon.ico`
15. 二选一保留 lockfile，重建依赖树，加 `packageManager`

**第四批：升级与优化**
16. 升级 `@docusaurus/*` → 3.10.2、`search-local` → 0.55.3
17. 迁移 `onBrokenMarkdownLinks` 到 `markdown.hooks`；修 sitemap 的 `changefreq`/`priority`
18. 装 `@docusaurus/faster`，开启 `future.faster: true` + `v4.removeLegacyPostBuildHeadAttribute`；删 `babel.config.js`
19. `yarn dedupe` 消除陈旧传递依赖
20. 全库替换 `testingcf.jsdelivr.net` → `cdn.jsdelivr.net`（340 处）
21. Python 脚本输出路径移出 `docs/`，部署工作流加 `paths` 过滤
22. 新增 `dependabot.yml` 与 PR 构建校验工作流

**验证方式**：每批完成后跑 `yarn build`，并抽查 3–5 个页面的 `<h1>` 数量与 `meta description` 内容 —— 这两项是本次审查的核心指标。
