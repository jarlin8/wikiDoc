/*! For license information please see a063e96a.c411095e.js.LICENSE.txt */
"use strict";(self.webpackChunkwikidoc=self.webpackChunkwikidoc||[]).push([[41937],{38466:(n,e,s)=>{s.r(e),s.d(e,{assets:()=>c,contentTitle:()=>l,default:()=>x,frontMatter:()=>i,metadata:()=>o,toc:()=>d});s(67294);var r=s(85893),t=s(11151);const i={},l=void 0,o={unversionedId:"exness-agent/\u5408\u4f5c\u4f19\u4f34\u7c7b\u578b",id:"exness-agent/\u5408\u4f5c\u4f19\u4f34\u7c7b\u578b",title:"\u5408\u4f5c\u4f19\u4f34\u7c7b\u578b",description:"\u6210\u4e3aExness \u5408\u4f5c\u4f19\u4f34\u53ea\u662f\u4e00\u4e2a\u5f00\u59cb\uff1aEXNESS\u4e3a\u60a8\u51c6\u5907\u4e86\u591a\u79cd\u80fd\u7ed9\u60a8\u5e26\u6765\u4e30\u539a\u56de\u62a5\u7684\u5408\u4f5c\u4f19\u4f34\u7c7b\u578b\uff0c\u5e76\u4e14\u5728\u60a8\u8fdb\u6b65\u65f6\uff0c\u60a8\u7684\u5408\u4f5c\u4f19\u4f34\u7c7b\u578b\u4e5f\u5c06\u968f\u4e4b\u5347\u7ea7\u3002",source:"@site/docs/exness-agent/\u5408\u4f5c\u4f19\u4f34\u7c7b\u578b.md",sourceDirName:"exness-agent",slug:"/exness-agent/\u5408\u4f5c\u4f19\u4f34\u7c7b\u578b",permalink:"/exness-agent/\u5408\u4f5c\u4f19\u4f34\u7c7b\u578b",draft:!1,tags:[],version:"current",lastUpdatedBy:"Arielante Lee",lastUpdatedAt:1701655626,formattedLastUpdatedAt:"2023\u5e7412\u67084\u65e5",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"\u5408\u4f5c\u4f19\u4f34\u5982\u4f55\u77e5\u9053\u4ed6\u4eec\u4ecb\u7ecd\u7ecf\u7eaa\u5546IB\u6c34\u5e73\u7684\u53d8\u5316",permalink:"/exness-agent/\u5408\u4f5c\u4f19\u4f34\u5982\u4f55\u77e5\u9053\u4ed6\u4eec\u4ecb\u7ecd\u7ecf\u7eaa\u5546IB\u6c34\u5e73\u7684\u53d8\u5316"},next:{title:"\u5408\u4f5c\u4f19\u4f34\u94fe\u63a5\u548c\u5408\u4f5c\u4f19\u4f34\u8d26\u6237",permalink:"/exness-agent/\u5408\u4f5c\u4f19\u4f34\u94fe\u63a5\u548c\u5408\u4f5c\u4f19\u4f34\u8d26\u6237"}},c={},d=[{value:"CPA",id:"cpa",level:2},{value:"CPL",id:"cpl",level:2},{value:"\u8054\u76df\u8425\u9500\u5408\u4f5c\u4f19\u4f34\u7684\u4f18\u52bf",id:"\u8054\u76df\u8425\u9500\u5408\u4f5c\u4f19\u4f34\u7684\u4f18\u52bf",level:2}];function a(n){const e=Object.assign({p:"p",strong:"strong",ul:"ul",li:"li",h2:"h2"},(0,t.ah)(),n.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(e.p,{children:["\u6210\u4e3a",(0,r.jsx)(e.strong,{children:"Exness \u5408\u4f5c\u4f19\u4f34\u53ea\u662f\u4e00\u4e2a\u5f00\u59cb"}),"\uff1aEXNESS\u4e3a\u60a8\u51c6\u5907\u4e86\u591a\u79cd\u80fd\u7ed9\u60a8\u5e26\u6765\u4e30\u539a\u56de\u62a5\u7684\u5408\u4f5c\u4f19\u4f34\u7c7b\u578b\uff0c\u5e76\u4e14\u5728\u60a8\u8fdb\u6b65\u65f6\uff0c\u60a8\u7684\u5408\u4f5c\u4f19\u4f34\u7c7b\u578b\u4e5f\u5c06\u968f\u4e4b\u5347\u7ea7\u3002\n\u4e24\u5927\u5408\u4f5c\u4f19\u4f34\u8ba1\u5212\u5206\u4e3a\u662f\uff1a\n",(0,r.jsx)(e.strong,{children:"\u4ecb\u7ecd\u7ecf\u7eaa\u5546 (Ib) \u8ba1\u5212"})]}),"\n",(0,r.jsxs)(e.p,{children:[(0,r.jsx)(e.strong,{children:"\u4ea4\u6613\u5408\u4f5c\u4f19\u4f34"}),"\n\u6ce8\u518c\u6210\u4e3a\u4ecb\u7ecd\u7ecf\u7eaa\u5546\u540e\uff0c\u60a8\u9996\u5148\u4f1a\u83b7\u5f97\u4ea4\u6613\u5408\u4f5c\u4f19\u4f34\u7684\u8eab\u4efd\uff0c\u8fd9\u4e5f\u662f\u6b64\u7c7b\u578b\u5408\u4f5c\u4f19\u4f34\u7684\u7b2c\u4e00\u5c42\u7ea7\u3002 \u521d\u59cb",(0,r.jsx)(e.strong,{children:"\u4f63\u91d1\u6bd4\u4f8b"}),"\u4e3a 20%\uff0c\u5373\uff0c\u60a8\u53ef\u4ee5\u83b7\u5f97\u63a8\u4ecb\u7528\u6237\u4ea4\u6613\u6d3b\u52a8\u6240\u5e26\u6765\u7684\u6240\u6709\u5229\u6da6\u7684 20% \u5728\u6b64\u7b49\u7ea7\u4e0a\uff0c\u6700\u91cd\u8981\u7684\u8861\u91cf\u6307\u6807\u662f",(0,r.jsx)(e.strong,{children:"\u5e73\u5747****\u4ea4\u6613\u91cf\uff08ATV\uff09"}),"\uff0c\u7531\u63a8\u4ecb\u5ba2\u6237\u7684\u603b\u4ea4\u6613\u91cf\u8ba1\u7b97\u5f97\u51fa\u3002\n\u6b64\u7b49\u7ea7\u5206\u4e3a\u4ea4\u6613\u5408\u4f5c\u4f19\u4f34\uff0820%\uff09\u548c\u9ad8\u7ea7\u5408\u4f5c\u4f19\u4f34\uff0825%\uff09\u4e24\u79cd\u3002\n",(0,r.jsx)(e.strong,{children:"\u4ecb\u7ecd\u7ecf\u7eaa\u5546 (IB)"}),"\n\u8981\u60f3\u6210\u4e3a\u4ecb\u7ecd\u7ecf\u7eaa\u5546\uff0c\u9700\u8981\u63a5\u53d7\u5bf9",(0,r.jsx)(e.strong,{children:"\u5e73\u5747\u4ea4\u6613\u91cf"}),"\u548c",(0,r.jsx)(e.strong,{children:"\u8fc7\u53bb 90 \u5929\u7684\u6d3b\u8dc3\u5ba2\u6237\u6570\u91cf"}),"\u7684\u7efc\u5408\u8003\u6838\u3002 \u4ecb\u7ecd\u7ecf\u7eaa\u5546\u7684\u8d77\u59cb\u4f63\u91d1\u6bd4\u4f8b\u4e3a 33%\uff0c\u6700\u591a\u53ef\u8fbe 40%\u3002\n\u4ecb\u7ecd\u7ecf\u7eaa\u5546\u5206\u4e3a\u5982\u4e0b\u7b49\u7ea7\uff1a\u9752\u94dc\u5408\u4f5c\u4f19\u4f34\uff0833%\uff09\u3001\u767d\u94f6\u5408\u4f5c\u4f19\u4f34\uff0835%\uff09\u3001\u9ec4\u91d1\u5408\u4f5c\u4f19\u4f34\uff0837%\uff09\u548c\u5353\u8d8a\u5408\u4f5c\u4f19\u4f34\uff0840%\uff09\u3002\n\u70b9\u51fb\u6b64\u94fe\u63a5\u4e86\u89e3",(0,r.jsx)(e.strong,{children:"\u5982\u4f55\u6210\u4e3a\u4ecb\u7ecd\u7ecf\u7eaa\u5546"}),"\u3002\n",(0,r.jsx)(e.strong,{children:"\u4ecb\u7ecd\u7ecf\u7eaa\u5546\u7684\u4f18\u52bf"})]}),"\n",(0,r.jsxs)(e.ul,{children:["\n",(0,r.jsx)(e.li,{children:"\u4f63\u91d1\u6bcf\u65e5\u53d1\u653e\uff0c\u5e26\u6765\u83b7\u5f97\u6301\u7eed\u6027\u88ab\u52a8\u6536\u5165\u7684\u53ef\u80fd\u3002"}),"\n",(0,r.jsx)(e.li,{children:"\u6709\u4ea4\u6613\u5c31\u6709\u6536\u76ca\uff0c\u4e5f\u5c31\u662f\u8bf4\u4e00\u540d\u8f6c\u4ecb\u5ba2\u6237\u5c31\u53ef\u80fd\u5e26\u6765\u957f\u671f\u6536\u76ca\u3002"}),"\n",(0,r.jsxs)(e.li,{children:["\u6700\u591a\u53ef\u83b7\u5f97 40% \u7684\u5229\u6da6\u5206\u6210\uff0c\u4e1a\u754c\u6700\u9ad8\u4f63\u91d1\u6bd4\u4f8b\u4e4b\u4e00\u3002\n",(0,r.jsx)(e.strong,{children:"\u6570\u5b57\u8054\u76df\u8425\u9500\u8ba1\u5212"})]}),"\n"]}),"\n",(0,r.jsx)(e.h2,{id:"cpa",children:"CPA"}),"\n",(0,r.jsxs)(e.p,{children:[(0,r.jsx)(e.strong,{children:"CPA"}),"\uff0c\u53c8\u79f0",(0,r.jsx)(e.strong,{children:"\u6bcf\u884c\u52a8\u6210\u672c"}),"\uff0c\u662f\u4e00\u79cd",(0,r.jsx)(e.strong,{children:"\u8054\u76df"}),"\u8425\u9500\u5408\u4f5c\u4f19\u4f34\u6a21\u5f0f\u3002\u5728\u8fd9\u79cd\u6a21\u5f0f\u4e0b\uff0c\u5982\u5408\u4f5c\u4f19\u4f34\u7684\u8f6c\u4ecb\u5ba2\u6237\u5b8c\u6210",(0,r.jsx)(e.strong,{children:"\u7b2c\u4e00\u6b21\u5165\u91d1"}),"\u5e76\u6ee1\u8db3\u6700\u4f4e\u4ea4\u6613\u8981\u6c42\uff0c\u5c31\u53ef\u4ee5\u6309\u6708\u83b7\u5f97\u4f63\u91d1\u62a5\u916c\uff08\u4ea4\u6613\u5408\u4f5c\u4f19\u4f34\u7684\u4f63\u91d1\u5219\u6309\u5929\u652f\u4ed8\uff09\u3002\n\u8054\u76df\u8425\u9500\u5408\u4f5c\u4f19\u4f34\u7684\u5177\u4f53",(0,r.jsx)(e.strong,{children:"\u4f63\u91d1"}),"\u91d1\u989d\u53d6\u51b3\u4e8e\u5176\u8f6c\u4ecb\u5ba2\u6237\u7684\u56fd\u5bb6\u548c\u9996\u6b21\u5165\u91d1\u91d1\u989d\u3002"]}),"\n",(0,r.jsx)(e.h2,{id:"cpl",children:"CPL"}),"\n",(0,r.jsxs)(e.p,{children:[(0,r.jsx)(e.strong,{children:"CPL"}),"\uff0c\u53c8\u79f0",(0,r.jsx)(e.strong,{children:"\u5f15\u5bfc\u6210\u672c"}),"\uff0c\u662f\u4e00\u79cd\u8054\u76df\u8425\u9500\u5408\u4f5c\u4f19\u4f34\u8ba1\u5212\u3002\u5728\u8fd9\u79cd\u8ba1\u5212\u4e4b\u4e0b\uff0c\u5982\u679c\u8f6c\u4ecb\u5ba2\u6237\u6ce8\u518c\u6210\u4e3aExness\u7684\u65b0\u5ba2\u6237\uff0c\u5408\u4f5c\u4f19\u4f34\u5c31\u53ef\u4ee5\u83b7\u5f97\u4e00\u7b14\u76f8\u5e94\u7684\u4f63\u91d1\u3002 \u8fd9\u4e9b\u8f6c\u4ecb\u5ba2\u6237\u9700\u8981\u5b8c\u6210",(0,r.jsx)(e.strong,{children:"\u4e00\u7cfb\u5217\u7684\u64cd\u4f5c"}),"\u540e\uff0c\u624d\u80fd\u7b97\u4e3a\u6709\u6548\u5ba2\u6237\u3002\nEXNESS\u63a5\u53d7\u7f51\u9875\u4e0a\u3001iOS\u548c\u5b89\u5353\u5e73\u53f0\u4e0a\u7684\u6ce8\u518c\uff0c\u4f63\u91d1\u6309\u6708\u652f\u4ed8\u3002"]}),"\n",(0,r.jsx)(e.h2,{id:"\u8054\u76df\u8425\u9500\u5408\u4f5c\u4f19\u4f34\u7684\u4f18\u52bf",children:"\u8054\u76df\u8425\u9500\u5408\u4f5c\u4f19\u4f34\u7684\u4f18\u52bf"}),"\n",(0,r.jsxs)(e.ul,{children:["\n",(0,r.jsx)(e.li,{children:"\u53ef\u4eab\u4e1a\u754c\u6700\u9ad8\u7684\u4f63\u91d1\u6c34\u5e73"}),"\n",(0,r.jsx)(e.li,{children:"\u4f63\u91d1\u6708\u7ed3\u53ef\u66f4\u597d\u5730\u5e2e\u52a9\u5408\u4f5c\u4f19\u4f34\u89c4\u5212\u9884\u7b97"}),"\n",(0,r.jsx)(e.li,{children:"\u91cd\u70b9\u5173\u6ce8\u83b7\u53d6\u5ba2\u6237\u6ce8\u518c\u91cf\u548c\u6ee1\u8db3\u9996\u6b21\u5165\u91d1\u8981\u6c42\uff0c\u65e0\u9700\u987e\u53ca\u8f6c\u4ecb\u5ba2\u6237\u7684\u957f\u671f\u4ea4\u6613\u6d3b\u52a8"}),"\n",(0,r.jsx)(e.li,{children:"\u5b9e\u65f6\u8ba1\u7b97\u5ba2\u6237\uff0c\u9632\u5e7f\u544a\u8bc8\u9a97\u63aa\u65bd"}),"\n",(0,r.jsx)(e.li,{children:"\u53ef\u5728CPA\u548cCPL\u4e4b\u95f4\u9009\u62e9\u66f4\u9002\u5408\u81ea\u5df1\u7684\u4f63\u91d1\u6a21\u5f0f"}),"\n",(0,r.jsx)(e.li,{children:"\u53ef\u4f7f\u7528\u56de\u4f20\u529f\u80fd\u83b7\u53d6\u8f6c\u4ecb\u5ba2\u6237\u7684\u884c\u52a8\u7684\u76f8\u5173\u4fe1\u606f"}),"\n"]})]})}const x=function(n){void 0===n&&(n={});const{wrapper:e}=Object.assign({},(0,t.ah)(),n.components);return e?(0,r.jsx)(e,Object.assign({},n,{children:(0,r.jsx)(a,n)})):a(n)}},75251:(n,e,s)=>{s(27418);var r=s(67294),t=60103;if(e.Fragment=60107,"function"==typeof Symbol&&Symbol.for){var i=Symbol.for;t=i("react.element"),e.Fragment=i("react.fragment")}var l=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,o=Object.prototype.hasOwnProperty,c={key:!0,ref:!0,__self:!0,__source:!0};function d(n,e,s){var r,i={},d=null,a=null;for(r in void 0!==s&&(d=""+s),void 0!==e.key&&(d=""+e.key),void 0!==e.ref&&(a=e.ref),e)o.call(e,r)&&!c.hasOwnProperty(r)&&(i[r]=e[r]);if(n&&n.defaultProps)for(r in e=n.defaultProps)void 0===i[r]&&(i[r]=e[r]);return{$$typeof:t,type:n,key:d,ref:a,props:i,_owner:l.current}}e.jsx=d,e.jsxs=d},85893:(n,e,s)=>{n.exports=s(75251)},11151:(n,e,s)=>{s.d(e,{Zo:()=>o,ah:()=>i});var r=s(67294);const t=r.createContext({});function i(n){const e=r.useContext(t);return r.useMemo((()=>"function"==typeof n?n(e):{...e,...n}),[e,n])}const l={};function o({components:n,children:e,disableParentContext:s}){let o;return o=s?"function"==typeof n?n({}):n||l:i(n),r.createElement(t.Provider,{value:o},e)}}}]);