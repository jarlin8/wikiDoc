import React from "react";
import Link from "@docusaurus/Link";
import { SECTIONS } from "@site/src/data/sections";
import styles from "./styles.module.css";

/**
 * 一级目录索引页组件。
 * 样式与首页 src/components/Homepage 保持一致（Hero + 卡片网格 + 分组链接）。
 * 数据来自 src/data/sections.js，用法：<SectionIndex section="exness-trader" />
 */
export default function SectionIndex({ section }) {
  const data = SECTIONS[section];
  if (!data) {
    return (
      <p>
        数据缺失：请在 <code>src/data/sections.js</code> 中定义 <code>{section}</code>。
      </p>
    );
  }
  const { icon, title, tagline, groups = [], quick = [] } = data;
  // 只有一个分组且名为「文档」时，说明该分类下没有子分类，直接平铺，不渲染卡片网格
  const single = groups.length === 1 && groups[0].name === "文档";

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {icon ? <span className={styles.titleIcon}>{icon}</span> : null}
          {title}
        </h1>
        {tagline ? <p className={styles.tagline}>{tagline}</p> : null}
      </header>

      {!single && (
        <nav className={styles.grid} aria-label="分组导航">
          {groups.map((g, i) => (
            <a key={g.name} className={styles.card} href={`#g-${i}`}>
              <div className={styles.cardHead}>
                <span className={styles.cardIcon} aria-hidden="true">
                  {g.icon || "📄"}
                </span>
                <span className={styles.badge}>{g.items.length} 篇</span>
              </div>
              <h3 className={styles.cardTitle}>{g.name}</h3>
              {g.desc ? <p className={styles.cardDesc}>{g.desc}</p> : null}
              <span className={styles.cardMore}>查看 →</span>
            </a>
          ))}
        </nav>
      )}

      {groups.map((g, i) => (
        <section key={g.name} className={styles.section}>
          {!single && (
            <h2 id={`g-${i}`} className={styles.sectionTitle}>
              {g.icon ? (
                <span className={styles.sectionIcon} aria-hidden="true">
                  {g.icon}
                </span>
              ) : null}
              {g.name}
              <span className={styles.badge}>{g.items.length} 篇</span>
            </h2>
          )}
          <ul className={single ? `${styles.links} ${styles.linksSingle}` : styles.links}>
            {g.items.map(([label, to]) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {quick.length > 0 && (
        <section className={styles.quick}>
          <h2 className={styles.quickTitle}>常用入口</h2>
          <ul className={styles.quickList}>
            {quick.map(([label, to]) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
