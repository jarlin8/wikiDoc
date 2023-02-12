/*! For license information please see 5395536e.03bc1984.js.LICENSE.txt */
"use strict";(self.webpackChunkjoeleon_wikidoc=self.webpackChunkjoeleon_wikidoc||[]).push([[54326],{81568:(n,e,s)=>{s.r(e),s.d(e,{assets:()=>d,contentTitle:()=>l,default:()=>j,frontMatter:()=>t,metadata:()=>c,toc:()=>o});s(67294);var r=s(85893),i=s(11151);const t={title:"\u5ba2\u6237\u652f\u4ed8\u6863\u6848 (CPP) \u987b\u77e5",date:"2023-01-10"},l=void 0,c={unversionedId:"exness-trader/\u5ba2\u6237\u652f\u4ed8\u6863\u6848-cpp-\u987b\u77e5",id:"exness-trader/\u5ba2\u6237\u652f\u4ed8\u6863\u6848-cpp-\u987b\u77e5",title:"\u5ba2\u6237\u652f\u4ed8\u6863\u6848 (CPP) \u987b\u77e5",description:"\u4e3a\u66f4\u597d\u5730\u7ba1\u7406\u60a8\u7684\u652f\u4ed8\u65b9\u5f0f\uff0c\u60a8\u53ef\u4ee5\u901a\u8fc7\u5ba2\u6237\u652f\u4ed8\u6863\u6848 (CPP) \u67e5\u770b\u3001\u521b\u5efa\u3001\u7ba1\u7406\u60a8\u7684\u652f\u4ed8\u6863\u6848\uff0c\u4ee5\u65b9\u4fbf\u5730\u5165\u91d1\u548c\u51fa\u91d1\u3002",source:"@site/docs/exness-trader/\u5ba2\u6237\u652f\u4ed8\u6863\u6848-cpp-\u987b\u77e5.md",sourceDirName:"exness-trader",slug:"/exness-trader/\u5ba2\u6237\u652f\u4ed8\u6863\u6848-cpp-\u987b\u77e5",permalink:"/exness-trader/\u5ba2\u6237\u652f\u4ed8\u6863\u6848-cpp-\u987b\u77e5",draft:!1,tags:[],version:"current",lastUpdatedBy:"jarlin8",lastUpdatedAt:1676181967,formattedLastUpdatedAt:"2023\u5e742\u670812\u65e5",frontMatter:{title:"\u5ba2\u6237\u652f\u4ed8\u6863\u6848 (CPP) \u987b\u77e5",date:"2023-01-10"},sidebar:"tutorialSidebar",previous:{title:"\u5982\u679c\u65e0\u6cd5\u5e73\u4ed3\u4ea4\u6613\uff0c\u6211\u8be5\u600e\u4e48\u505a\uff1f",permalink:"/exness-trader/\u5982\u679c\u65e0\u6cd5\u5e73\u4ed3\u4ea4\u6613\uff0c\u6211\u8be5\u600e\u4e48\u505a"},next:{title:"\u5ba2\u6237\u662f\u5426\u53ef\u4ee5\u4f7f\u7528\u5176\u5b83\u4ea4\u6613\u8d26\u6237\u5165\u91d1\u65f6\u4f7f\u7528\u7684\u652f\u4ed8\u5e73\u53f0\u8fdb\u884c\u51fa\u91d1\uff1f",permalink:"/exness-trader/\u5ba2\u6237\u662f\u5426\u53ef\u4ee5\u4f7f\u7528\u5176\u5b83\u4ea4\u6613\u8d26\u6237\u5165\u91d1\u65f6\u4f7f\u7528\u7684\u652f\u4ed8"}},d={},o=[{value:"<strong>\u67e5\u770b\u6240\u6709\u6863\u6848</strong>",id:"\u67e5\u770b\u6240\u6709\u6863\u6848",level:3},{value:"<strong>\u521b\u5efa\u6863\u6848</strong>",id:"\u521b\u5efa\u6863\u6848",level:3},{value:"<strong>\u4f7f\u7528\u6863\u6848\u5165\u91d1</strong>",id:"\u4f7f\u7528\u6863\u6848\u5165\u91d1",level:3},{value:"<strong>\u7ba1\u7406\u6863\u6848</strong>",id:"\u7ba1\u7406\u6863\u6848",level:3},{value:"<strong>\u67e5\u770b\u6863\u6848</strong>",id:"\u67e5\u770b\u6863\u6848",level:4},{value:"<strong>\u5220\u9664\u6863\u6848</strong>",id:"\u5220\u9664\u6863\u6848",level:4}];function h(n){const e=Object.assign({p:"p",blockquote:"blockquote",strong:"strong",ol:"ol",li:"li",ul:"ul",h3:"h3",img:"img",h4:"h4"},(0,i.ah)(),n.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(e.p,{children:"\u4e3a\u66f4\u597d\u5730\u7ba1\u7406\u60a8\u7684\u652f\u4ed8\u65b9\u5f0f\uff0c\u60a8\u53ef\u4ee5\u901a\u8fc7\u5ba2\u6237\u652f\u4ed8\u6863\u6848 (CPP) \u67e5\u770b\u3001\u521b\u5efa\u3001\u7ba1\u7406\u60a8\u7684\u652f\u4ed8\u6863\u6848\uff0c\u4ee5\u65b9\u4fbf\u5730\u5165\u91d1\u548c\u51fa\u91d1\u3002"}),"\n",(0,r.jsxs)(e.blockquote,{children:["\n",(0,r.jsxs)(e.p,{children:[(0,r.jsx)(e.strong,{children:"\u8bf7\u6ce8\u610f"}),"\uff1a\u60a8\u53ea\u6709\u5728\u6210\u529f\u5165\u91d1\u4e4b\u540e\u624d\u53ef\u4ee5\u4f7f\u7528\u5ba2\u6237\u652f\u4ed8\u6863\u6848 (CPP) \u3002 \u5982\u9700\u8fdb\u884c\u9996\u6b21\u5165\u91d1\uff0c\u8bf7\u70b9\u51fb",(0,r.jsx)(e.strong,{children:"\u6b64\u5904"}),"\u4e86\u89e3\u66f4\u591a\u8be6\u60c5\u3002"]}),"\n"]}),"\n",(0,r.jsx)(e.p,{children:"\u5ba2\u6237\u652f\u4ed8\u6863\u6848 (CPP) \u4f7f\u7528\u65b9\u6cd5"}),"\n",(0,r.jsxs)(e.ol,{children:["\n",(0,r.jsxs)(e.li,{children:["\u767b\u5f55",(0,r.jsx)(e.strong,{children:"\u4e2a\u4eba\u4e13\u533a"})]}),"\n",(0,r.jsxs)(e.li,{children:["\u70b9\u51fb",(0,r.jsx)(e.strong,{children:"\u5165\u91d1"}),"\u9009\u9879\u5361"]}),"\n"]}),"\n",(0,r.jsx)(e.p,{children:"\u60a8\u7684\u5ba2\u6237\u652f\u4ed8\u6863\u6848\u5c31\u4f4d\u4e8e\u5165\u91d1\u9875\u9762\uff0c\u60a8\u53ef\u4ee5\u5728\u6b64\u9875\u9762\u67e5\u770b\u6700\u8fd1\u4f7f\u7528\u8fc7\u548c\u8fc7\u53bb\u4fdd\u5b58\u7684\u652f\u4ed8\u65b9\u5f0f\u3002"}),"\n",(0,r.jsx)(e.p,{children:"\u5ba2\u6237\u652f\u4ed8\u6863\u6848 (CPP) \u7684\u4e3b\u8981\u529f\u80fd\u5982\u4e0b\uff1a"}),"\n",(0,r.jsxs)(e.ul,{children:["\n",(0,r.jsxs)(e.li,{children:["\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:"\u67e5\u770b\u6240\u6709\u6863\u6848"})}),"\n"]}),"\n",(0,r.jsxs)(e.li,{children:["\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:"\u521b\u5efa\u6863\u6848"})}),"\n"]}),"\n",(0,r.jsxs)(e.li,{children:["\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:"\u4f7f\u7528\u6863\u6848\u5165\u91d1"})}),"\n"]}),"\n",(0,r.jsxs)(e.li,{children:["\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:"\u7ba1\u7406\u6863\u6848"})}),"\n"]}),"\n",(0,r.jsxs)(e.li,{children:["\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:"\u67e5\u770b\u6863\u6848\u8be6\u60c5"})}),"\n"]}),"\n",(0,r.jsxs)(e.li,{children:["\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:"\u5220\u9664\u6863\u6848"})}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(e.h3,{id:"\u67e5\u770b\u6240\u6709\u6863\u6848",children:(0,r.jsx)(e.strong,{children:"\u67e5\u770b\u6240\u6709\u6863\u6848"})}),"\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:(0,r.jsx)(e.img,{src:"https://testingcf.jsdelivr.net/gh/jarlin8/OSS@main/exhelp/CSVP-4366-ZH.gif",alt:"CSVP-4366-ZH.gif"})})}),"\n",(0,r.jsxs)(e.p,{children:["\u5982\u9700\u67e5\u770b\u6240\u6709\u652f\u4ed8\u6863\u6848\uff0c\u70b9\u51fb",(0,r.jsx)(e.strong,{children:"\u5165\u91d1"}),"\u9009\u9879\u5361\u5373\u53ef\u3002 \u7136\u540e\u60a8\u5c31\u4f1a\u770b\u5230\u60a8\u6700\u8fd1\u4f7f\u7528\u8fc7\u548c\u8fc7\u53bb\u4fdd\u5b58\u7684\u652f\u4ed8\u6863\u6848\uff0c\u4ee5\u53ca\u6240\u6709\u5176\u4ed6\u53ef\u7528\u7684\u652f\u4ed8\u7cfb\u7edf\u3002"]}),"\n",(0,r.jsxs)(e.blockquote,{children:["\n",(0,r.jsx)(e.p,{children:"\u5982\u679c\u67d0\u652f\u4ed8\u65b9\u5f0f\u663e\u793a\u4e3a\u201c\u63a8\u8350\u201d\uff0c\u4ee3\u8868\u7740\u8be5\u652f\u4ed8\u65b9\u5f0f\u5728\u60a8\u6ce8\u518c\u7684\u5730\u533a\u5177\u6709\u8f83\u9ad8\u7684\u5165\u91d1\u6210\u529f\u7387\u3002"}),"\n"]}),"\n",(0,r.jsxs)(e.p,{children:["\u5982\u9700\u4e86\u89e3\u66f4\u591a\u5165\u91d1\u76f8\u5173\u8be6\u60c5\uff0c\u8bf7\u5728\u6b64\u9605\u8bfb",(0,r.jsx)(e.strong,{children:"\u5165\u91d1\u987b\u77e5\u3002"})]}),"\n",(0,r.jsx)(e.h3,{id:"\u521b\u5efa\u6863\u6848",children:(0,r.jsx)(e.strong,{children:"\u521b\u5efa\u6863\u6848"})}),"\n",(0,r.jsx)(e.p,{children:"\u7cfb\u7edf\u4f1a\u5728\u60a8\u6210\u529f\u5165\u91d1\u540e\u81ea\u52a8\u521b\u5efa\u652f\u4ed8\u6863\u6848\u3002 \u8be5\u6863\u6848\u968f\u5373\u5c31\u4f1a\u663e\u793a\u5728\u60a8\u7684\u5165\u91d1\u9875\u9762\u3002"}),"\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.img,{src:"https://testingcf.jsdelivr.net/gh/jarlin8/OSS@main/exhelp/CSVP-4369-ZH.gif",alt:"CSVP-4369-ZH.gif"})}),"\n",(0,r.jsx)(e.h3,{id:"\u4f7f\u7528\u6863\u6848\u5165\u91d1",children:(0,r.jsx)(e.strong,{children:"\u4f7f\u7528\u6863\u6848\u5165\u91d1"})}),"\n",(0,r.jsx)(e.p,{children:"\u5982\u9700\u5165\u91d1\uff0c\u60a8\u53ef\u4ee5\u9009\u62e9\u4f7f\u7528\u60a8\u504f\u597d\u7684\u652f\u4ed8\u6863\u6848\u8fdb\u884c\u652f\u4ed8\u3002 \u9009\u4e2d\u652f\u4ed8\u6863\u6848\u540e\uff0c\u7cfb\u7edf\u4f1a\u81ea\u52a8\u586b\u5199\u60a8\u7684\u8d26\u6237\u8d27\u5e01\u3001\u8d26\u53f7\u548c\u5168\u540d\u7b49\u5165\u91d1\u8be6\u60c5\u3002"}),"\n",(0,r.jsxs)(e.p,{children:["\u5982\u9700\u4e86\u89e3\u5982\u4f55\u7ed9\u8d26\u6237\u5165\u91d1\uff0c\u8bf7\u70b9\u51fb",(0,r.jsx)(e.strong,{children:"\u6b64\u5904"}),"\u9605\u8bfb\u66f4\u591a\u76f8\u5173\u5185\u5bb9\u3002"]}),"\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.img,{src:"https://testingcf.jsdelivr.net/gh/jarlin8/OSS@main/exhelp/CSVP-4373-ZH.gif",alt:"CSVP-4373-ZH.gif"})}),"\n",(0,r.jsx)(e.h3,{id:"\u7ba1\u7406\u6863\u6848",children:(0,r.jsx)(e.strong,{children:"\u7ba1\u7406\u6863\u6848"})}),"\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:(0,r.jsx)(e.img,{src:"https://testingcf.jsdelivr.net/gh/jarlin8/OSS@main/exhelp/CSVP-4376-ZH.gif",alt:"CSVP-4376-ZH.gif"})})}),"\n",(0,r.jsx)(e.p,{children:"\u8981\u7ba1\u7406\u60a8\u7684\u652f\u4ed8\u6863\u6848\uff0c\u53ea\u9700\u70b9\u51fb\u4f4d\u4e8e\u6863\u6848\u53f3\u4e0a\u89d2\u7684\u7531\u4e09\u4e2a\u5782\u76f4\u5706\u70b9\u7684\u83dc\u5355\u56fe\u6807\u5373\u53ef\u8c03\u51fa\u7ba1\u7406\u9009\u9879\uff1a"}),"\n",(0,r.jsxs)(e.ul,{children:["\n",(0,r.jsx)(e.li,{children:"\u67e5\u770b\u6863\u6848"}),"\n",(0,r.jsx)(e.li,{children:"\u5220\u9664\u6863\u6848"}),"\n"]}),"\n",(0,r.jsx)(e.h4,{id:"\u67e5\u770b\u6863\u6848",children:(0,r.jsx)(e.strong,{children:"\u67e5\u770b\u6863\u6848"})}),"\n",(0,r.jsx)(e.p,{children:"\u5728\u60a8\u67e5\u770b\u652f\u4ed8\u6863\u6848\u8be6\u60c5\u65f6\uff0c\u7cfb\u7edf\u4f1a\u5c4f\u853d\u67d0\u4e9b\u4fe1\u606f\u3002 \u6863\u6848\u8be6\u60c5\u65e0\u6cd5\u66f4\u6539\u3002 \u60a8\u8fd8\u53ef\u4ee5\u5728\u6b64\u5904\u5220\u9664\u6863\u6848\u3002"}),"\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.img,{src:"https://testingcf.jsdelivr.net/gh/jarlin8/OSS@main/exhelp/CSVP-4379-ZH.gif",alt:"CSVP-4379-ZH.gif"})}),"\n",(0,r.jsx)(e.h4,{id:"\u5220\u9664\u6863\u6848",children:(0,r.jsx)(e.strong,{children:"\u5220\u9664\u6863\u6848"})}),"\n",(0,r.jsx)(e.p,{children:"\u5982\u9700\u5220\u9664\u6863\u6848\uff0c\u60a8\u4e5f\u53ef\u4ee5\u70b9\u51fb\u6863\u6848\u83dc\u5355\u9009\u9879\u8fdb\u884c\u64cd\u4f5c\u3002 \u70b9\u51fb\u5220\u9664\u540e\uff0c\u7cfb\u7edf\u4f1a\u5f39\u51fa\u786e\u8ba4\u7a97\u53e3\uff0c\u8ba9\u60a8\u518d\u6b21\u786e\u8ba4\u64cd\u4f5c\u3002"}),"\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.img,{src:"https://testingcf.jsdelivr.net/gh/jarlin8/OSS@main/exhelp/CSVP-4382-ZH.gif",alt:"CSVP-4382-ZH.gif"})})]})}const j=function(n){void 0===n&&(n={});const{wrapper:e}=Object.assign({},(0,i.ah)(),n.components);return e?(0,r.jsx)(e,Object.assign({},n,{children:(0,r.jsx)(h,n)})):h(n)}},75251:(n,e,s)=>{s(27418);var r=s(67294),i=60103;if(e.Fragment=60107,"function"==typeof Symbol&&Symbol.for){var t=Symbol.for;i=t("react.element"),e.Fragment=t("react.fragment")}var l=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c=Object.prototype.hasOwnProperty,d={key:!0,ref:!0,__self:!0,__source:!0};function o(n,e,s){var r,t={},o=null,h=null;for(r in void 0!==s&&(o=""+s),void 0!==e.key&&(o=""+e.key),void 0!==e.ref&&(h=e.ref),e)c.call(e,r)&&!d.hasOwnProperty(r)&&(t[r]=e[r]);if(n&&n.defaultProps)for(r in e=n.defaultProps)void 0===t[r]&&(t[r]=e[r]);return{$$typeof:i,type:n,key:o,ref:h,props:t,_owner:l.current}}e.jsx=o,e.jsxs=o},85893:(n,e,s)=>{n.exports=s(75251)},11151:(n,e,s)=>{s.d(e,{Zo:()=>c,ah:()=>t});var r=s(67294);const i=r.createContext({});function t(n){const e=r.useContext(i);return r.useMemo((()=>"function"==typeof n?n(e):{...e,...n}),[e,n])}const l={};function c({components:n,children:e,disableParentContext:s}){let c=t(n);return s&&(c=n||l),r.createElement(i.Provider,{value:c},e)}}}]);