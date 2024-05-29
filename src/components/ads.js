import React from 'react';

const adstyle = {
    display: 'inline-block',
    width: '880px',
    height: '138px',
};

const containerStyle = {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    padding: '1em',
    margin: '.6em',
    borderRadius: '8px',
    fontFamily: 'sans-serif',
    display: 'flex',
    transition: 'box-shadow 0.3s ease',
};

const imgContainerStyle = {
    width: '20%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
};

const imgStyle = {
    height: 'auto',
    maxWidth: '100%',
    marginBottom: '10px',
};

const linkStyle = {
    backgroundColor: '#057B5B',
    color: 'white',
    padding: '.5px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '16px',
};

const textStyle = {
    width: '80%',
    paddingLeft: '20px',
    fontSize: '17px',
    lineHeight: '1.5',
    fontWeight: '600',
    color: 'deeppink',
};

const Ads = () => {
  return (
    <div>
      <div style={containerStyle} className="atfx-container">
        <div style={imgContainerStyle}>
          <img src="https://cdn.fendou.la/tuoss/ATFX.svg" alt="ATFX Logo" style={imgStyle} />
          <a href="https://s.ifttt.fun/atfx" target="_blank" rel="noopener noreferrer" style={linkStyle}>官网开户</a>
        </div>
        <div style={textStyle}>
          <p>2014年成立，总部位于英国伦敦，FCA监管，提供外汇、贵金属、原油、股票等超过100种差价合约交易产品，银联出入金高效安全最高杠杆400倍，香港办事处服务中国客户。</p>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 767px) {
          .atfx-container {
            flex-direction: column;
          }
          .atfx-container > div:first-child {
            margin-bottom: 1em;
            width: 100% !important;
          }
          .atfx-container > div:first-child > img {
            height: auto !important;
            margin-right: 10px;
          }
          .atfx-container > div:first-child > a {
            white-space: nowrap; 
            font-weight: bold;
          }
          .atfx-container > div:last-child {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Ads;