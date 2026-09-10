import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const SECTIONS = [
  {
    icon: "📈",
    title: "EXNESS 客户帮助",
    desc: "账户类型、入金出金、交易品种与合约细则、平台与终端、常见错误处理",
    to: "/exness-trader",
    badge: "359 篇",
  },
  {
    icon: "🤝",
    title: "EXNESS 代理帮助",
    desc: "合作伙伴计划、佣金与返佣、介绍经纪商 IB、推广与个人专区报告",
    to: "/exness-agent",
    badge: "57 篇",
  },
  {
    icon: "🧠",
    title: "AI 与工具",
    desc: "ChatGPT 用法合集、EA 参数设置、纽时写作风格与翻译笔记",
    to: "/chatgpt-edgegpt",
    badge: "8 篇",
  },
];

const QUICK_LINKS = [
  { label: "账户类型对比", to: "/exness-trader/账户类型" },
  { label: "MetaTrader：MT4 与 MT5 对比", to: "/exness-trader/metatrader-详解-对比-mt4-和-mt5" },
  { label: "出入金到账需要多长时间", to: "/exness-trader/出入金到账需要多长时间" },
  { label: "合作伙伴佣金框架", to: "/exness-agent/合作伙伴佣金框架" },
  { label: "EA 相关参数设置", to: "/ea-setup" },
  { label: "纽时播报", to: "/nytimes" },
];

export default function Homepage() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>WikiDoc</h1>
        <p className={styles.heroTagline}>
          全职交易员关注的吃喝 / 交易，帮助文档与代理佣金说明
        </p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryBtn} to="/exness-trader">
            EXNESS 客户帮助
          </Link>
          <Link className={styles.secondaryBtn} to="/exness-agent">
            EXNESS 代理帮助
          </Link>
        </div>
      </section>

      <section className={styles.sections}>
        {SECTIONS.map((s) => (
          <Link key={s.to} className={styles.card} to={s.to}>
            <div className={styles.cardHead}>
              <span className={styles.cardIcon} aria-hidden="true">
                {s.icon}
              </span>
              <span className={styles.cardBadge}>{s.badge}</span>
            </div>
            <h2 className={styles.cardTitle}>{s.title}</h2>
            <p className={styles.cardDesc}>{s.desc}</p>
            <span className={styles.cardMore}>进入 →</span>
          </Link>
        ))}
      </section>

      <section className={styles.quick}>
        <h2 className={styles.quickTitle}>常用入口</h2>
        <ul className={styles.quickList}>
          {QUICK_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
