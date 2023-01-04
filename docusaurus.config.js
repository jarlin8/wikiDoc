// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const wikiLinkPlugin = require('remark-wiki-link-plus');
const walkSync = require('walk-sync');
const { basename } = require('path');



/** @type {import('@docusaurus/types').Config} */

async function createConfig() {
const math = (await import('remark-math')).default;
const katex = (await import('rehype-katex')).default;
return {
  title: 'JoeLeon wikiDoc Site',
  tagline: 'Howdy Friend!',
  url: 'https://fendou.la',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jarlin8', // Usually your GitHub org/user name.
  projectName: 'wikiDoc', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
			remarkPlugins: [wikiLinkPlugin, math],
			rehypePlugins: [katex],
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
  stylesheets: [
  {
    href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
    type: 'text/css',
    integrity:
      'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
    crossorigin: 'anonymous',
  },
],  

  themes: [
    ['mdx-v2', {customCss: [require.resolve('./src/css/custom.css')]}],
    '@easyops-cn/docusaurus-search-local',],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'wikiDoc',
        logo: {
          alt: 'wikiDoc Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'index',
            position: 'left',
            label: '爱好',
          },
          {
            href: 'https://fendou.la/',
            label: '个人网站',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `CC-BY-SA 4.0 © 2022 - ${new Date().getFullYear()} 版权所有 `,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      }),
    };
}

module.exports = createConfig;