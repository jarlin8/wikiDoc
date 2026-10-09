import React from 'react';
import styles from './ads.module.css';

const Ads = () => {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.imgContainer}>
          {/* 显式 width/height 提供 4:1 固有宽高比（取自 SVG viewBox="0 0 400 100"），
              让浏览器在图片下载前预留空间，避免布局偏移（CLS） */}
          <img
            src="https://cdn.fendou.la/tuoss/ATFX.svg"
            alt="ATFX Logo"
            className={styles.img}
            width="400"
            height="100"
          />
          <a
            href="https://s.ifttt.fun/atfx"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            官网开户
          </a>
        </div>
        <div className={styles.text}>
          <p>2014年成立，总部位于英国伦敦，FCA监管，提供外汇、贵金属、原油、股票等超过100种差价合约交易产品，银联出入金高效安全最高杠杆400倍，香港办事处服务中国客户。</p>
        </div>
      </div>
    </div>
  );
};

export default Ads;
