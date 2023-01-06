// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const wikiLinkPlugin = require('remark-wiki-link-plus');
const walkSync = require('walk-sync');
const { basename } = require('path');

const wikilink = [
  wikiLinkPlugin,
  {
    pageResolver: (/** @type {string} */ wikilink) => {
      const paths = walkSync('docs', {
        globs: ["**/" + wikilink + ".md"],
        directories: false,
      }).map((path) => basename(path, '.md'));
      if (paths.length) {
        return paths;
      } else {
        return ['404'];
      }
    },
    hrefTemplate: (/** @type {string} */ permalink) => `/${permalink}`,
    aliasDivider: '|'
  },
];

/** @type {import('@docusaurus/types').Config} */

const config = {
// const math = (await import('remark-math')).default;
// const katex = (await import('rehype-katex')).default;
  title: 'JoeLeon wikiDoc Site',
  tagline: 'Howdy Friend!',
  url: 'https://fendou.la',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jarlin8', // Usually your GitHub org/user name.
  projectName: 'wikiDoc', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
      docs: {
			remarkPlugins: [wikiLinkPlugin], //[math]
			// rehypePlugins: [katex],
			routeBasePath: '/', // Serve the docs at the site's root
			sidebarPath: require.resolve('./sidebars.js'),
      // Please change this to your repo.
      editUrl: 'https://github.com/jarlin8/wikiDoc/edit/main/',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
		blog: false,
      }),
    ],
  ],
//  stylesheets: [
// {
//  href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
//  type: 'text/css',
//    integrity:
//      'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
//    crossorigin: 'anonymous',
//  },
//],  

  themes: [
    ['mdx-v2', {customCss: [require.resolve('./src/css/custom.css')]}],],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'wikiDoc Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'html',
            position: 'left',
            value: `<h1 class="font-extrabold"><a>WikiDoc</a></h1>`
          },
          {
            type: 'dropdown',
            label: '做菜之前',
            position: 'left',
            items: [
            {
              type: 'doc',
              docId: 'tips/tips',
              label: '吃什么?',
            },
            {
              type: 'doc',
              docId: 'tips/learn/learn',
              label: '学习操作',
            },
            {
              type: 'doc',
              docId: 'tips/advanced/advanced',
              label: '大厨必备',
            },
            ],
          },
          {
            type: 'doc',
            docId: 'dishes/aquatic/aquatic',
            position: 'left',
            label: '水产',
          },
          {
            type: 'doc',
            docId: 'dishes/breakfast/breakfast',
            position: 'left',
            label: '早餐',
          },
          {
            type: 'doc',
            docId: 'dishes/condiment/condiment',
            position: 'left',
            label: '调味',
          },
          {
            type: 'doc',
            docId: 'dishes/dessert/dessert',
            position: 'left',
            label: '甜品',
          },
          {
            type: 'doc',
            docId: 'dishes/drink/drink',
            position: 'left',
            label: '饮料',
          },
          {
            type: 'doc',
            docId: 'dishes/meat_dish/meat_dish',
            position: 'left',
            label: '肉类',
          },
          {
            type: 'doc',
            docId: 'dishes/semi-finished/semi-finished',
            position: 'left',
            label: '半成品',
          },
          {
            type: 'doc',
            docId: 'dishes/soup/soup',
            position: 'left',
            label: '汤类',
          },
          {
            type: 'doc',
            docId: 'dishes/staple/staple',
            position: 'left',
            label: '主食',
          },
          {
            type: 'doc',
            docId: 'dishes/vegetable_dish/vegetable_dish',
            position: 'left',
            label: '蔬菜',
          },
        ],
        hideOnScroll: true,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      footer: {
        style: 'dark',
        copyright: `CC-BY-SA 4.0 © 2022 - ${new Date().getFullYear()} 版权所有 `,
      },
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
            docsRouteBasePath: '/',
          },
        ],
      ],
    };

module.exports = config;