// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

// 注意：此插件不可移除。它负责把 [[页面|别名]] 编译成 <a class="internal">，
// 而 `internal` 是悬浮预览弹窗（static/wikiPreviewBox.fixed.js）唯一的挂载点。
// 全站 609 处 wiki 链接与弹窗功能都依赖它。
const wikiLinkPlugin = require("remark-wiki-link-plus");

// 已删除：原先这里定义过一个 `wikilink` 配置数组（配合 walkSync 做 pageResolver），
// 但它从未被 remarkPlugins 引用，是死代码。之所以不能直接"接上"使用：
// 其 glob 只匹配 `**/*.md`，而 docs/ 下是 425 个 .mdx、0 个 .md，
// 会命中兜底分支返回 ["404"]，导致 609 处链接全部指向 /404，
// 且 basename() 还会丢掉子目录前缀。当前保留插件默认行为，已验证线上链接正常。

/** @type {import('@docusaurus/types').Config} */

const config = {
  scripts: [
    {
      src: "/wikiPreviewBox.fixed.js",
      defer: true,
    },
  ],
  // const math = (await import('remark-math')).default;
  // const katex = (await import('rehype-katex')).default;
  // 原先为 "wikiDoc"（小写 w），与 navbar 显示的 "WikiDoc" 不一致；
  // 页面 <title> 会输出「标准账户 | wikiDoc」，统一为 WikiDoc。
  title: "WikiDoc",
  tagline: "全职交易员关注的吃喝/交易,帮助文档和代理佣金说明!",
  url: "https://wiki.ssgg.net",
  baseUrl: "/",
  trailingSlash: false, // 去掉url结尾的/
  onBrokenLinks: "throw",
  favicon: "img/favicon.svg",

  // 根级 onBrokenMarkdownLinks 在 3.9 已弃用、v4 将移除，迁到 markdown.hooks
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "jarlin8", // Usually your GitHub org/user name.
  projectName: "wikiDoc", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          remarkPlugins: [wikiLinkPlugin], //[math]
          // rehypePlugins: [katex],
          routeBasePath: "/", // Serve the docs at the site's root
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // editUrl: 'https://github.com/jarlin8/wikiDoc/edit/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          // 已移除 changefreq / priority：Google 已明确声明不参考这两个字段，
          // 且 425 篇帮助文档全标 changefreq: daily 是错误信号。
          // lastmod: 'date' 依赖 git 历史，需配合 CI 的 fetch-depth: 0 才准确。
          lastmod: "date",
          ignorePatterns: ["/tags/**", "/search"],
          filename: "sitemap.xml",
        },
        blog: false,
      }),
    ],
  ],

  // 已移除 `themes: [["mdx-v2", ...]]`（docusaurus-theme-mdx-v2）：
  // 该包停更于 2022-07-20，是 Docusaurus v2 时代提前启用 MDX v2 的兼容 shim，
  // 而 3.x 已原生使用 MDX v3，功能被完全覆盖。它无 peerDependencies 声明，
  // 是升级 3.10.2 乃至未来 v4 时最可能的兼容性阻塞点。
  // 移除它同时解决了 custom.css 被重复注入的问题 ——
  // preset 的 theme.customCss 已经加载过同一份文件。

  // Docusaurus Faster：切换到 Rspack + SWC + Lightning CSS。
  // 425 个 MDX 加上 showLastUpdateAuthor，让构建同时承受 webpack 打包
  // 与数千次 git log 子进程调用的双重瓶颈。
  // 刻意只开 v4.removeLegacyPostBuildHeadAttribute 而不用 `v4: true` 简写 ——
  // 后者会一并开启 mdx1CompatDisabledByDefault，要求内容使用严格 MDX 语法，
  // 需要单独验证 425 个文件后再全量开启。
  future: {
    v4: { removeLegacyPostBuildHeadAttribute: true },
    faster: true,
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        // 使用原生 title：渲染为 <b class="navbar__title"> 而非 <h1>，
        // 语义正确，且自带跳转首页的链接。
        // 原先是 type:"html" 注入 <h1 class="font-extrabold">，与每页正文标题形成双 h1。
        title: "WikiDoc",
        logo: {
          alt: "WikiDoc Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "dropdown",
            label: "EXNESS",
            position: "left",
            items: [
              {
                type: "doc",
                docId: "exness-trader/exness-trader",
                label: "💯 EXNESS客户帮助",
              },
              {
                type: "doc",
                docId: "exness-agent/exness-agent",
                label: "🎯 EXNESS代理帮助",
              },
            ],
          },
        ],
        hideOnScroll: true,
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      //      footer: {
      //        style: 'dark',
      //        copyright: `CC-BY-SA 4.0 © 2022 - ${new Date().getFullYear()} 版权所有 `,
      //      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
    }),
  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        // 站点 i18n 只配置了 zh-Hans 一种语言，不存在 en 索引；
        // 保留 en 只会让 Lunr 额外加载英文分词/词干规则，干扰中文检索质量
        language: ["zh"],
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],
};

module.exports = config;
