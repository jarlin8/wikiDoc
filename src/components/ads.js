// ads.js
import React from 'react';

const adstyle = {
    display: 'inline-block',
    width: '728px',
    height: '90px',
};
const Ads = () => {
  return (
    <a 
      href="https://s.ifttt.fun/jsmt4" 
      target="_blank" 
      rel="noopener noreferrer"
      style={adstyle} // 将样式对象应用到链接上
    >
      <img 
        className="aligncenter wp-image-24477" 
        src="https://testingcf.jsdelivr.net/gh/jarlin8/img@main/imgHD/1617860184554-forexgif.gif" 
        alt="XM外汇基础点差广告" 
        width="870" 
        height="224" 
        loading="lazy" 
        fetchpriority="low" 
      />
    </a>
  );
};

export default Ads;