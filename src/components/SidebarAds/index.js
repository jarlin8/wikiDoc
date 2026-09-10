import React from 'react';
import styles from './styles.module.css';

export default function SidebarAds() {
  return (
    <div className={styles.sidebarAds}>
      <a
        className={styles.adCard}
        href="https://s.ifttt.fun/atfx"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* 显式 width/height 提供 596:523 的固有宽高比（取自 SVG viewBox），
            让浏览器在图片下载前预留空间，避免挤压布局（CLS）。
            原 className="size-full wp-image-24489 aligncenter" 是 WordPress 残留，已移除。 */}
        <img
          className={styles.adImage}
          src="https://cdn.fendou.la/bluehost/ATFX-ads.svg"
          alt="ATFX侧边栏广告"
          width="596"
          height="523"
        />
      </a>
      <a
        className={styles.adLink}
        href="https://s.ifttt.fun/jsmt4"
        target="_blank"
        rel="noopener noreferrer"
      >
        嘉盛集团
        <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
          ></path>
        </svg>
      </a>
    </div>
  );
}
