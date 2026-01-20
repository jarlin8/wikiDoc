// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const wikiLinkPlugin = require("remark-wiki-link-plus");
const walkSync = require("walk-sync");
const { basename } = require("path");

const wikilink = [
  wikiLinkPlugin,
  {
    pageResolver: (/** @type {string} */ wikilink) => {
      const paths = walkSync("docs", {
        globs: ["**/" + wikilink + ".md"],
        directories: false,
      }).map((path) => basename(path, ".md"));
      if (paths.length) {
        return paths;
      } else {
        return ["404"];
      }
    },
    hrefTemplate: (/** @type {string} */ permalink) => `/${permalink}`,
    aliasDivider: "|",
  },
];

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
  title: "wikiDoc",
  tagline: "全职交易员关注的吃喝/交易,帮助文档和代理佣金说明!",
  url: "https://wiki.ssgg.net",
  baseUrl: "/",
  trailingSlash: false, // 去掉url结尾的/
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.svg",

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
          changefreq: "daily",
          priority: 0.8,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
        blog: false,
      }),
    ],
  ],

  themes: [
    ["mdx-v2", { customCss: [require.resolve("./src/css/custom.css")] }],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: "wikiDoc Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "html",
            position: "left",
            value: `<h1 class="font-extrabold"><a>WikiDoc</a></h1>`,
          },
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
        language: ["zh", "en"],
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
