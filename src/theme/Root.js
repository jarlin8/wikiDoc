import React from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

/**
 * 全站结构化数据：WebSite（含站内搜索）+ Organization。
 * 注：面包屑 BreadcrumbList 由 Docusaurus 的 DocBreadcrumbs 自动输出，此处不重复。
 */
export default function Root({ children }) {
  const { siteConfig } = useDocusaurusContext();
  const { url, title } = siteConfig;

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: title,
    url: `${url}/`,
    inLanguage: "zh-Hans",
    description: siteConfig.tagline,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: title,
    url: `${url}/`,
    logo: `${url}/img/og-default.png`,
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(website)}</script>
        <script type="application/ld+json">
          {JSON.stringify(organization)}
        </script>
      </Head>
      {children}
    </>
  );
}
