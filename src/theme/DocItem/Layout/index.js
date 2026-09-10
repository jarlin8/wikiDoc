import React from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import DocItemLayout from "@theme-original/DocItem/Layout";

function toIso(v) {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function absolute(url, siteUrl) {
  if (!url) return undefined;
  if (/^https?:\/\//.test(url)) return url;
  return `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * 为每个文档页注入 TechArticle 结构化数据。
 *
 * 注意：必须 swizzle DocItem/Layout 而不是 DocItem ——
 * DocProvider 位于 DocItem 内部，在 DocItem 外层调用 useDoc() 会抛
 * ReactContextError 并导致全部 425 个页面 SSG 失败。
 *
 * 面包屑 BreadcrumbList 由 Docusaurus 自动输出，此处不重复。
 */
export default function DocItemLayoutWrapper(props) {
  const { metadata, frontMatter } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const { url, title: siteName, themeConfig } = siteConfig;

  const pageUrl = `${url}${metadata.permalink}`;
  const description =
    metadata.description || frontMatter.description || siteConfig.tagline;
  const image = absolute(frontMatter.image || themeConfig.image, url);

  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: metadata.title,
    name: metadata.title,
    description,
    inLanguage: "zh-Hans",
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: `${url}/`,
      logo: {
        "@type": "ImageObject",
        url: `${url}/img/og-default.png`,
      },
    },
    ...(image ? { image: [image] } : {}),
    ...(toIso(frontMatter.date) ? { datePublished: toIso(frontMatter.date) } : {}),
    ...(metadata.lastUpdatedAt
      ? { dateModified: new Date(metadata.lastUpdatedAt * 1000).toISOString() }
      : {}),
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(article)}</script>
      </Head>
      <DocItemLayout {...props} />
    </>
  );
}
