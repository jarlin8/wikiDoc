// ads.js
import React from 'react';

const adstyle = {
    display: 'inline-block',
    width: '880px',
    height: '138px',
};
const Ads = () => {
  return (
    <a 
      href="https://s.ifttt.fun/jsmt4" 
      target="_blank" 
      style={adstyle} // 将样式对象应用到链接上
    >
      <img 
        src="https://testingcf.jsdelivr.net/gh/jarlin8/img@main/imgHD/1617860184554-forexgif.gif" 
        alt="XM外汇基础点差广告" 
        loading="lazy" 
        fetchpriority="low" 
      />
    </a>
  );
};

export default Ads;