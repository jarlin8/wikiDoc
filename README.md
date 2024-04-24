## 更新注意事项

`pakage.jason`**里面的两个插件千万注意不要胡乱更新**

- `"@mdx-js/react": "^2.3.0",` MDX 支持的
- `"prism-react-renderer": "^1.3.5",` 尤其重要，版本不要乱动

## 插入广告
通过全局配置，在 MDX 文件中直接注册使用组件。每种方法灵活应用，使 React 组件在文档中的管理更加方便。
[通过全局配置，在 MDX 文件中直接注册使用组件](https://jsnoteclub.com/blog/how-to-import-component-content-in-docusaurus/)

将其注册到全局作用域，这将使其在每个 MDX 文件中自动可用（注意时 .mdx 文件，不是 .md 文件），而无需任何导入语句。

官网链接：[docusaurus官方文档](https://docusaurus.io/zh-CN/docs/next/markdown-features/react#mdx-component-scope)

定义全局配置文件src/theme/MDXComponents.js

## Docusaurus 的默认侧边栏目录更改！插入图片或文字
通过以下步骤可轻松导入和使用 Docusaurus 主题组件。首先，在控制台中运行npm run swizzle命令，选择“@tarslib/docusaurus-theme”并导入所需组件，如 TOCItems （Unsafe）。通过浏览器控制台检查元素来快速定位组件。选择 Wrap （Unsafe）并确认，生成新组件后需重启项目。此后，您可以在组件中添加自定义内容。
[详细文本教程](https://jsnoteclub.com/blog/how-to-change-default-sidebar-docusaurus/)
[swizze](https://docusaurus.io/zh-CN/docs/swizzling)

## 自动推送站点地图到搜索引擎
[自动推送到搜索引擎](https://www.alanwang.site/posts/blog-guides/docusaurus-search-engines-urls-push)

``` YAML
name: search-engines-urls-push

on: deployment

jobs:
  search-engines-urls-push:
    runs-on: ubuntu-latest
    name: search-engines-urls-push
    steps:
      - name: search-engines-urls-push
        id: search-engines-urls-push
        # 使用最新的版本
        uses: 3Alan/search-engines-urls-push@v0.2.2
        with:
          site: ${{ secrets.SITE }}
          sitemap: ${{ secrets.SITEMAP }}
          count: ${{ secrets.COUNT }}
          bing-token: ${{ secrets.BING_TOKEN }}
          baidu-token: ${{ secrets.BAIDU_TOKEN }}
          google-client-email: ${{ secrets.GOOGLE_CLIENT_EMAIL }}
          google-private-key: ${{ secrets.GOOGLE_PRIVATE_KEY }}
```