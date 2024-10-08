import React from 'react';
import TOCItems from '@theme-original/TOCItems';
export default function TOCItemsWrapper(props) {
  return (
    <>
      <TOCItems {...props} />
      <a target="_blank" href="https://s.ifttt.fun/atfx" rel="noopener noreferrer">
        <img
          style={{
            border: '1px solid #ddd',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            padding: '18px',
            borderRadius: '8px',
            background: 'white',
            marginTop: '1.25em'
          }}
          className="size-full wp-image-24489 aligncenter"
          src="https://cdn.fendou.la/bluehost/ATFX-ads.svg"
          alt="ATFX侧边栏广告"
        />
      </a>
      <a href="https://s.ifttt.fun/jsmt4" target="_blank" rel="noopener noreferrer">
        嘉盛集团
        <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" className="iconExternalLink_nPIU">
          <path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path>
        </svg>
      </a>
    </>
  );
}