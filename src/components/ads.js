import React from 'react';

const adstyle = {
    display: 'inline-block',
    width: '880px',
    height: '138px',
};

const Ads = () => {
  return (
    <div>
      <ul>
        <li><strong><span style={{ fontSize: '16px' }}>🎈<span style={{ backgroundColor: '#fefefe' }}><a href="https://s.ifttt.fun/atfx" target="_blank" rel="noopener">ATFX开户</a></span>🎈</span>做外汇黄金原油，FCA监管，高流动性无滑点！</strong></li>
        <li><strong><span style={{ backgroundColor: '#fefefe' }}><a style={{ backgroundColor: '#fefefe' }} href="https://we.laowei8.com/compare-table" target="_blank" rel="noopener noreferrer" data-darkreader-inline-color="">正规交易平台排行榜</a></span><span style={{ fontSize: '16px' }}>找最适合自己的平台，<span style={{ backgroundColor: '#fefefe' }}><a style={{ backgroundColor: '#fefefe' }} href="https://cdn.fendou.la/welaowei8/2021/08/wechat.png" target="_blank" rel="noopener">联系我！</a></span></span></strong></li>
      </ul>
      <a 
        href="https://s.ifttt.fun/jsmt4" 
        target="_blank" 
      >
        <img 
          src="https://testingcf.jsdelivr.net/gh/jarlin8/img@main/imgHD/1617860184554-forexgif.gif" 
          alt="嘉盛集团广告" 
          loading="lazy" 
          fetchpriority="low" 
          style={adstyle}
        />
      </a>
    </div>
  );
};

export default Ads;