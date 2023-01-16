/*! For license information please see 268d3d33.eacaf882.js.LICENSE.txt */
"use strict";(self.webpackChunkjoeleon_wikidoc=self.webpackChunkjoeleon_wikidoc||[]).push([[12600],{45138:(n,e,r)=>{r.r(e),r.d(e,{assets:()=>c,contentTitle:()=>t,default:()=>a,frontMatter:()=>l,metadata:()=>d,toc:()=>h});r(67294);var s=r(85893),i=r(11151);const l={title:"\u5982\u4f55\u4f7f\u7528\u5b89\u5353\u7248 MetaTrader 5",date:"2023-01-10"},t=void 0,d={unversionedId:"EXNESS\u5ba2\u6237\u5e2e\u52a9/\u5982\u4f55\u4f7f\u7528\u5b89\u5353\u7248-metatrader-5",id:"EXNESS\u5ba2\u6237\u5e2e\u52a9/\u5982\u4f55\u4f7f\u7528\u5b89\u5353\u7248-metatrader-5",title:"\u5982\u4f55\u4f7f\u7528\u5b89\u5353\u7248 MetaTrader 5",description:"\u5982\u679c\u60a8\u7684\u79fb\u52a8\u8bbe\u5907\u4f7f\u7528\u7684\u662f\u5b89\u5353\u64cd\u4f5c\u7cfb\u7edf\uff0c\u90a3\u4e48\u60a8\u9700\u8981\u4e0b\u8f7d\u5b89\u5353\u7248 MetaTrader 5 \u5e73\u53f0\u3002",source:"@site/docs/EXNESS\u5ba2\u6237\u5e2e\u52a9/\u5982\u4f55\u4f7f\u7528\u5b89\u5353\u7248-metatrader-5.md",sourceDirName:"EXNESS\u5ba2\u6237\u5e2e\u52a9",slug:"/EXNESS\u5ba2\u6237\u5e2e\u52a9/\u5982\u4f55\u4f7f\u7528\u5b89\u5353\u7248-metatrader-5",permalink:"/EXNESS\u5ba2\u6237\u5e2e\u52a9/\u5982\u4f55\u4f7f\u7528\u5b89\u5353\u7248-metatrader-5",draft:!1,tags:[],version:"current",lastUpdatedBy:"jarlin8",lastUpdatedAt:1673875686,formattedLastUpdatedAt:"2023\u5e741\u670816\u65e5",frontMatter:{title:"\u5982\u4f55\u4f7f\u7528\u5b89\u5353\u7248 MetaTrader 5",date:"2023-01-10"},sidebar:"tutorialSidebar",previous:{title:"\u5982\u4f55\u4f7f\u7528\u5b89\u5353\u7248 MetaTrader 4",permalink:"/EXNESS\u5ba2\u6237\u5e2e\u52a9/\u5982\u4f55\u4f7f\u7528\u5b89\u5353\u7248-metatrader-4"},next:{title:"\u5982\u4f55\u4f7f\u7528\u65e5\u672c\u6216\u97e9\u56fd\u94f6\u884c\u5361\u51fa\u91d1?",permalink:"/EXNESS\u5ba2\u6237\u5e2e\u52a9/\u5982\u4f55\u4f7f\u7528\u65e5\u672c\u6216\u97e9\u56fd\u94f6\u884c\u5361\u51fa\u91d1"}},c={},h=[{value:"<strong>\u4e0b\u8f7d\u3001\u5b89\u88c5\u548c\u8bbe\u7f6e MetaTrader 5 \u5e94\u7528</strong>",id:"\u4e0b\u8f7d\u5b89\u88c5\u548c\u8bbe\u7f6e-metatrader-5-\u5e94\u7528",level:2},{value:"<strong>\u4f53\u9a8c MT5 \u5b89\u5353\u7248\u5e94\u7528</strong>",id:"\u4f53\u9a8c-mt5-\u5b89\u5353\u7248\u5e94\u7528",level:3},{value:"\u5b89\u5353\u7248 MT5 \u7684\u7279\u522b\u529f\u80fd",id:"\u5b89\u5353\u7248-mt5-\u7684\u7279\u522b\u529f\u80fd",level:3},{value:"<strong>\u8d26\u6237\u7ba1\u7406</strong>",id:"\u8d26\u6237\u7ba1\u7406",level:2},{value:"<strong>\u6dfb\u52a0\u4e00\u4e2a\u4ea4\u6613\u8d26\u6237\uff1a</strong>",id:"\u6dfb\u52a0\u4e00\u4e2a\u4ea4\u6613\u8d26\u6237",level:4},{value:"<strong>\u5207\u6362\u6709\u6548\u4ea4\u6613\u8d26\u6237\uff1a</strong>",id:"\u5207\u6362\u6709\u6548\u4ea4\u6613\u8d26\u6237",level:4},{value:"<strong>\u5728 MT5 \u4e2d\u7ba1\u7406\u8ba2\u5355</strong>",id:"\u5728-mt5-\u4e2d\u7ba1\u7406\u8ba2\u5355",level:2},{value:"\u5982\u4f55\u4e0b\u8ba2\u5355\uff1a",id:"\u5982\u4f55\u4e0b\u8ba2\u5355",level:4},{value:"\u5e73\u4ed3\u6216\u4fee\u6539\u8ba2\u5355\uff1a",id:"\u5e73\u4ed3\u6216\u4fee\u6539\u8ba2\u5355",level:4},{value:"<strong>\u6dfb\u52a0\u3001\u5220\u9664\u6216\u91cd\u65b0\u6392\u5e8f\u4ea4\u6613\u54c1\u79cd\uff1a</strong>",id:"\u6dfb\u52a0\u5220\u9664\u6216\u91cd\u65b0\u6392\u5e8f\u4ea4\u6613\u54c1\u79cd",level:2}];function o(n){const e=Object.assign({p:"p",ul:"ul",li:"li",strong:"strong",h2:"h2",a:"a",h3:"h3",h4:"h4",ol:"ol",img:"img"},(0,i.ah)(),n.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(e.p,{children:"\u5982\u679c\u60a8\u7684\u79fb\u52a8\u8bbe\u5907\u4f7f\u7528\u7684\u662f\u5b89\u5353\u64cd\u4f5c\u7cfb\u7edf\uff0c\u90a3\u4e48\u60a8\u9700\u8981\u4e0b\u8f7d\u5b89\u5353\u7248 MetaTrader 5 \u5e73\u53f0\u3002"}),"\n",(0,s.jsx)(e.p,{children:"\u64cd\u4f5c\u975e\u5e38\u7b80\u5355\uff0c\u5b8c\u6210\u4ee5\u4e0b\u51e0\u4e2a\u6b65\u9aa4\u5373\u53ef\uff1a"}),"\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.strong,{children:"\u4e0b\u8f7d\u3001\u5b89\u88c5\u548c\u914d\u7f6e MetaTrader 5 \u5e94\u7528"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.strong,{children:"\u8d26\u6237\u7ba1\u7406"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.strong,{children:"\u5728 MT5 \u4e2d\u7ba1\u7406\u8ba2\u5355"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.strong,{children:"\u5982\u4f55\u6dfb\u52a0\u3001\u5220\u9664\u6216\u91cd\u65b0\u6392\u5e8f\u4ea4\u6613\u54c1\u79cd"})}),"\n"]}),"\n",(0,s.jsx)(e.h2,{id:"\u4e0b\u8f7d\u5b89\u88c5\u548c\u8bbe\u7f6e-metatrader-5-\u5e94\u7528",children:(0,s.jsx)(e.strong,{children:"\u4e0b\u8f7d\u3001\u5b89\u88c5\u548c\u8bbe\u7f6e MetaTrader 5 \u5e94\u7528"})}),"\n",(0,s.jsx)(e.p,{children:"\u8bf7\u89c2\u770b\u4e0b\u65b9\u7684\u7b80\u6613\u89c6\u9891\u6559\u7a0b\uff0c\u4e86\u89e3\u6709\u5173\u4e0b\u8f7d\u3001\u5b89\u88c5\u548c\u9996\u6b21\u6253\u5f00\u4f7f\u7528\u5b89\u5353\u7248 MT5 \u7684\u6240\u6709\u76f8\u5173\u5185\u5bb9\uff1a"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.a,{href:"https://www.iqiyi.com/v_1j1bm303gis.html",children:"\u89c6\u9891\u6f14\u793a"})}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"\u7acb\u5373\u4e0b\u8f7d\u5b89\u5353\u7248 MT5 \u5e94\u7528\uff01"})}),"\n",(0,s.jsx)(e.h3,{id:"\u4f53\u9a8c-mt5-\u5b89\u5353\u7248\u5e94\u7528",children:(0,s.jsx)(e.strong,{children:"\u4f53\u9a8c MT5 \u5b89\u5353\u7248\u5e94\u7528"})}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.a,{href:"https://www.iqiyi.com/v_1bzangp1xh4.html",children:"\u89c6\u9891\u6f14\u793a"})}),"\n",(0,s.jsx)(e.h3,{id:"\u5b89\u5353\u7248-mt5-\u7684\u7279\u522b\u529f\u80fd",children:"\u5b89\u5353\u7248 MT5 \u7684\u7279\u522b\u529f\u80fd"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.a,{href:"https://www.iqiyi.com/v_1rrhf33vp18.html",children:"\u89c6\u9891\u6f14\u793a"})}),"\n",(0,s.jsx)(e.h2,{id:"\u8d26\u6237\u7ba1\u7406",children:(0,s.jsx)(e.strong,{children:"\u8d26\u6237\u7ba1\u7406"})}),"\n",(0,s.jsx)(e.p,{children:"\u60a8\u53ef\u4ee5\u901a\u8fc7 MT5 \u7ba1\u7406\u591a\u4e2a\u4ea4\u6613\u8d26\u6237\uff0c\u4f46\u662f\u4e0d\u80fd\u540c\u65f6\u8fdb\u884c\u3002 \u6309\u7167\u4ee5\u4e0b\u6b65\u9aa4\u5c06\u66f4\u591a\u4ea4\u6613\u8d26\u6237\u6dfb\u52a0\u81f3\u60a8\u7684\u5e94\u7528\u3002"}),"\n",(0,s.jsx)(e.h4,{id:"\u6dfb\u52a0\u4e00\u4e2a\u4ea4\u6613\u8d26\u6237",children:(0,s.jsx)(e.strong,{children:"\u6dfb\u52a0\u4e00\u4e2a\u4ea4\u6613\u8d26\u6237\uff1a"})}),"\n",(0,s.jsxs)(e.ol,{children:["\n",(0,s.jsxs)(e.li,{children:["\u6253\u5f00 MetaTrader 5\uff0c\u9009\u62e9\u4e3b\u83dc\u5355\u7684",(0,s.jsx)(e.strong,{children:"\u8d26\u6237\u7ba1\u7406"}),"\u3002"]}),"\n",(0,s.jsxs)(e.li,{children:["\u70b9\u51fb**+ icon**\uff0c\u5728\u641c\u7d22\u6846\u4e2d\u8f93\u5165",(0,s.jsx)(e.strong,{children:"Exness Technologies Ltd"}),"\uff0c\u7136\u540e\u70b9\u51fb\u3002"]}),"\n",(0,s.jsxs)(e.li,{children:["\u8f93\u5165\u60a8\u7684\u4ea4\u6613\u8d26\u6237\u53f7\u548c\u5bc6\u7801\u4ee5\u53ca\u6b63\u786e\u7684\u670d\u52a1\u5668\uff0c\u7136\u540e\u70b9\u51fb",(0,s.jsx)(e.strong,{children:"\u767b\u5f55"}),"\u3002"]}),"\n",(0,s.jsxs)(e.li,{children:["\u4ea4\u6613\u8d26\u6237\u88ab\u6dfb\u52a0\u5230",(0,s.jsx)(e.strong,{children:"\u8d26\u6237"}),"\u9009\u9879\u5361\u3002"]}),"\n"]}),"\n",(0,s.jsx)(e.h4,{id:"\u5207\u6362\u6709\u6548\u4ea4\u6613\u8d26\u6237",children:(0,s.jsx)(e.strong,{children:"\u5207\u6362\u6709\u6548\u4ea4\u6613\u8d26\u6237\uff1a"})}),"\n",(0,s.jsxs)(e.ol,{children:["\n",(0,s.jsxs)(e.li,{children:["\u6253\u5f00 MetaTrader 5\uff0c\u9009\u62e9\u4e3b\u83dc\u5355\u7684",(0,s.jsx)(e.strong,{children:"\u8d26\u6237\u7ba1\u7406"}),"\u3002"]}),"\n",(0,s.jsxs)(e.li,{children:["\u5728",(0,s.jsx)(e.strong,{children:"\u8d26\u6237"}),"\u9009\u9879\u5361\u4e2d\u70b9\u51fb\u60a8\u5e0c\u671b\u6fc0\u6d3b\u7684\u4ea4\u6613\u8d26\u6237\uff0c\u5982\u5f39\u51fa\u5bf9\u8bdd\u6846\uff0c\u8f93\u5165\u4ea4\u6613\u8d26\u6237\u53f7\u548c\u5bc6\u7801\uff0c\u7136\u540e",(0,s.jsx)(e.strong,{children:"\u767b\u5f55"}),"\u3002"]}),"\n",(0,s.jsx)(e.li,{children:"\u6b64\u65f6\u53ef\u7528\u8be5\u4ea4\u6613\u8d26\u6237\u767b\u5f55 MetaTrader 5\u3002"}),"\n"]}),"\n",(0,s.jsx)(e.h2,{id:"\u5728-mt5-\u4e2d\u7ba1\u7406\u8ba2\u5355",children:(0,s.jsx)(e.strong,{children:"\u5728 MT5 \u4e2d\u7ba1\u7406\u8ba2\u5355"})}),"\n",(0,s.jsx)(e.p,{children:"\u4f7f\u7528\u5b89\u5353\u7248 MT5 \u65f6\uff0c\u5173\u952e\u662f\u8981\u4e86\u89e3\u5176\u8ba2\u5355\u7ba1\u7406\u65b9\u6cd5\uff0c\u9700\u8981\u8bb0\u4f4f\u8bb8\u591a\u91cd\u8981\u7684\u64cd\u4f5c\u6b65\u9aa4\u3002 \u8bf7\u60a8\u7ee7\u7eed\u9605\u8bfb\uff0c\u4e86\u89e3\u5b89\u5353\u7248 MT5 \u5e94\u7528\u5404\u79cd\u529f\u80fd\u7684\u4f7f\u7528\u6b65\u9aa4\u3002"}),"\n",(0,s.jsx)(e.h4,{id:"\u5982\u4f55\u4e0b\u8ba2\u5355",children:"\u5982\u4f55\u4e0b\u8ba2\u5355\uff1a"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.img,{src:"https://testingcf.jsdelivr.net/gh/jarlin8/OSS@main/exhelp/CSVP-1611-ZH.gif",alt:"CSVP-1611-ZH.gif"})}),"\n",(0,s.jsxs)(e.ol,{children:["\n",(0,s.jsxs)(e.li,{children:["\u524d\u5f80",(0,s.jsx)(e.strong,{children:"\u884c\u60c5"}),"\u3002"]}),"\n",(0,s.jsxs)(e.li,{children:["\u70b9\u51fb\u9700\u8981\u4ea4\u6613\u7684\u54c1\u79cd\uff0c\u7136\u540e\u70b9\u51fb",(0,s.jsx)(e.strong,{children:"\u65b0\u8ba2\u5355"}),"\u3002"]}),"\n",(0,s.jsx)(e.li,{children:"\u8bbe\u7f6e\u8ba2\u5355\u53c2\u91cf\uff08\u4f8b\u5982 \u6b62\u635f\u3001\u83b7\u5229\u3001\u504f\u5dee\u7b49\uff09\u3002"}),"\n",(0,s.jsxs)(e.li,{children:["\u5982\u679c\u9700\u8981\u5f00\u7acb\u5e02\u4ef7\u8ba2\u5355\uff0c\u8bf7\u70b9\u51fb",(0,s.jsx)(e.strong,{children:"\u4e70\u5165"}),"\u6216",(0,s.jsx)(e.strong,{children:"\u5356\u51fa"}),"\u3002"]}),"\n",(0,s.jsxs)(e.li,{children:["\u5982\u9700\u8bbe\u7f6e\u6302\u5355\uff0c\u8bf7\u70b9\u51fb",(0,s.jsx)(e.strong,{children:"\u5373\u65f6\u6267\u884c"}),"\u6216",(0,s.jsx)(e.strong,{children:"\u5e02\u573a\u6267\u884c"}),"\uff08\u53d6\u51b3\u4e8e\u60a8\u7684\u8d26\u6237\u7c7b\u578b\u548c\u4ea4\u6613\u54c1\u79cd\uff09\u8c03\u51fa\u8ba2\u5355\u7c7b\u578b\u5217\u8868\u3002"]}),"\n",(0,s.jsx)(e.li,{children:"\u4ece\u4e0b\u62c9\u83dc\u5355\u4e2d\u9009\u62e9\u6302\u5355\u7c7b\u578b\uff0c\u5e76\u8bbe\u7f6e\u8ba2\u5355\u53c2\u91cf\uff08\u4f8b\u5982 \u4ef7\u683c\u3001\u6b62\u635f\u3001\u83b7\u5229\u7b49\uff09\u3002"}),"\n",(0,s.jsxs)(e.li,{children:["\u70b9\u51fb",(0,s.jsx)(e.strong,{children:"\u4e0b\u5355"}),"\u3002"]}),"\n"]}),"\n",(0,s.jsx)(e.p,{children:"\u60a8\u5c06\u6536\u5230\u8ba2\u5355\u6210\u529f\u5f00\u7acb\u7684\u901a\u77e5\u3002"}),"\n",(0,s.jsx)(e.h4,{id:"\u5e73\u4ed3\u6216\u4fee\u6539\u8ba2\u5355",children:"\u5e73\u4ed3\u6216\u4fee\u6539\u8ba2\u5355\uff1a"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.img,{src:"https://testingcf.jsdelivr.net/gh/jarlin8/OSS@main/exhelp/CSVP-1607-ZH.gif",alt:"CSVP-1607-ZH.gif"})}),"\n",(0,s.jsxs)(e.ol,{children:["\n",(0,s.jsxs)(e.li,{children:["\u524d\u5f80",(0,s.jsx)(e.strong,{children:"\u4ea4\u6613"}),"\u3002"]}),"\n",(0,s.jsx)(e.li,{children:"\u70b9\u51fb\u4efb\u610f\u8ba2\u5355\u67e5\u770b\u8ba2\u5355\u8be6\u60c5\uff08\u5f00\u4ed3\u4ef7\u3001\u6b62\u635f\u3001\u83b7\u5229\u3001\u8ba2\u5355\u53f7\u7b49\uff09\u3002"}),"\n",(0,s.jsxs)(e.li,{children:["\u5982\u9700\u4fee\u6539\u8ba2\u5355\u6216\u5e73\u4ed3\uff0c\u957f\u6309\u8ba2\u5355\uff0c\u70b9\u51fb",(0,s.jsx)(e.strong,{children:"\u4fee\u6539\u4ef7\u4f4d"}),"\u6216",(0,s.jsx)(e.strong,{children:"\u5e73\u4ed3"}),"\u3002"]}),"\n",(0,s.jsxs)(e.li,{children:["\u4fee\u6539\u5b8c\u6210\u540e\u70b9\u51fb",(0,s.jsx)(e.strong,{children:"\u4fee\u6539"}),"\u6216",(0,s.jsx)(e.strong,{children:"\u83b7\u5229/\u4e8f\u635f\u65f6\u5e73\u4ed3"}),"\uff0c\u786e\u8ba4\u76f8\u5e94\u64cd\u4f5c\u3002"]}),"\n",(0,s.jsx)(e.li,{children:"\u60a8\u4f1a\u6536\u5230\u8ba2\u5355\u5df2\u5e73\u4ed3\u7684\u901a\u77e5\u3002"}),"\n"]}),"\n",(0,s.jsx)(e.h2,{id:"\u6dfb\u52a0\u5220\u9664\u6216\u91cd\u65b0\u6392\u5e8f\u4ea4\u6613\u54c1\u79cd",children:(0,s.jsx)(e.strong,{children:"\u6dfb\u52a0\u3001\u5220\u9664\u6216\u91cd\u65b0\u6392\u5e8f\u4ea4\u6613\u54c1\u79cd\uff1a"})}),"\n",(0,s.jsx)(e.p,{children:"\u5728\u884c\u60c5\u9009\u9879\u5361\u4e2d\u6dfb\u52a0\u4ea4\u6613\u54c1\u79cd\u975e\u5e38\u7b80\u5355\u3002"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.img,{src:"https://testingcf.jsdelivr.net/gh/jarlin8/OSS@main/exhelp/CSVP-2452-ZH.gif",alt:"CSVP-2452-ZH.gif"})}),"\n",(0,s.jsxs)(e.ol,{children:["\n",(0,s.jsxs)(e.li,{children:["\u70b9\u51fb",(0,s.jsx)(e.strong,{children:"\u884c\u60c5"}),"\u3002"]}),"\n",(0,s.jsx)(e.li,{children:"\u70b9\u51fb**+ \u53f7**\uff0c\u7136\u540e\u4ece\u5c4f\u5e55\u4e0a\u663e\u793a\u51fa\u6765\u7684\u4ea4\u6613\u54c1\u79cd\u7ec4\u4e2d\u627e\u5230\u76f8\u5e94\u7684\u4ea4\u6613\u54c1\u79cd\u3002"}),"\n",(0,s.jsxs)(e.li,{children:["\u70b9\u51fb\u9700\u8981\u6dfb\u52a0\u7684\u4efb\u610f\u4ea4\u6613\u54c1\u79cd\uff0c\u76f8\u5e94\u4ea4\u6613\u54c1\u79cd\u5373\u4f1a\u6dfb\u52a0\u8fdb",(0,s.jsx)(e.strong,{children:"\u884c\u60c5"}),"\u9009\u9879\u5361\u4e0b\u7684\u5217\u8868\u4e4b\u4e2d\u3002"]}),"\n",(0,s.jsxs)(e.li,{children:["\u5982\u9700\u5bf9\u4ea4\u6613\u54c1\u79cd\u8fdb\u884c\u91cd\u65b0\u6392\u5e8f\uff0c\u8bf7\u70b9\u51fb",(0,s.jsx)(e.strong,{children:"\u94c5\u7b14\u56fe\u6807"}),"\u542f\u52a8\u7f16\u8f91\u529f\u80fd\uff0c\u7136\u540e\u60a8\u5c31\u53ef\u4ee5\u79fb\u52a8\u8fd9\u4e9b\u4ea4\u6613\u54c1\u79cd\u5bf9\u5176\u8fdb\u884c\u91cd\u65b0\u6392\u5e8f\u4e86\u3002"]}),"\n",(0,s.jsxs)(e.li,{children:["\u5982\u9700\u79fb\u9664\u4ea4\u6613\u54c1\u79cd\uff0c\u8bf7\u70b9\u51fb",(0,s.jsx)(e.strong,{children:"\u5783\u573e\u6876\u56fe\u6807"}),"\u542f\u52a8\u5220\u9664\u529f\u80fd\uff0c\u7136\u540e\u4f7f\u7528",(0,s.jsx)(e.strong,{children:"\u53cc\u52fe\u56fe\u6807"}),"\u9009\u62e9\u6240\u6709\u4ea4\u6613\u54c1\u79cd\u6216\u70b9\u51fb\u9009\u62e9\u4e2a\u522b\u7684\u4ea4\u6613\u54c1\u79cd\u3002"]}),"\n",(0,s.jsxs)(e.li,{children:["\u518d\u70b9\u51fb\u4e00\u6b21",(0,s.jsx)(e.strong,{children:"\u5783\u573e\u6876\u56fe\u6807"}),"\u786e\u8ba4\u79fb\u9664\u9009\u4e2d\u7684\u4ea4\u6613\u54c1\u79cd\u3002"]}),"\n"]}),"\n",(0,s.jsx)(e.p,{children:"\u606d\u559c\uff0c\u73b0\u5728\u60a8\u5c31\u53ef\u4ee5\u653e\u5fc3\u4f7f\u7528\u5b89\u5353\u7248 MT5 \u5e94\u7528\u4e86\u3002"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.a,{href:"https://download.metatrader.com/cdn/web/exness.technologies.ltd/mt5/exness5setup.exe",children:(0,s.jsx)(e.strong,{children:"\u7acb\u5373\u4e0b\u8f7d\u5b89\u5353\u7248 MT5 \u5e94\u7528\uff01"})})})]})}const a=function(n){void 0===n&&(n={});const{wrapper:e}=Object.assign({},(0,i.ah)(),n.components);return e?(0,s.jsx)(e,Object.assign({},n,{children:(0,s.jsx)(o,n)})):o(n)}},75251:(n,e,r)=>{r(27418);var s=r(67294),i=60103;if(e.Fragment=60107,"function"==typeof Symbol&&Symbol.for){var l=Symbol.for;i=l("react.element"),e.Fragment=l("react.fragment")}var t=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d=Object.prototype.hasOwnProperty,c={key:!0,ref:!0,__self:!0,__source:!0};function h(n,e,r){var s,l={},h=null,o=null;for(s in void 0!==r&&(h=""+r),void 0!==e.key&&(h=""+e.key),void 0!==e.ref&&(o=e.ref),e)d.call(e,s)&&!c.hasOwnProperty(s)&&(l[s]=e[s]);if(n&&n.defaultProps)for(s in e=n.defaultProps)void 0===l[s]&&(l[s]=e[s]);return{$$typeof:i,type:n,key:h,ref:o,props:l,_owner:t.current}}e.jsx=h,e.jsxs=h},85893:(n,e,r)=>{n.exports=r(75251)},11151:(n,e,r)=>{r.d(e,{Zo:()=>d,ah:()=>l});var s=r(67294);const i=s.createContext({});function l(n){const e=s.useContext(i);return s.useMemo((()=>"function"==typeof n?n(e):{...e,...n}),[e,n])}const t={};function d({components:n,children:e,disableParentContext:r}){let d=l(n);return r&&(d=n||t),s.createElement(i.Provider,{value:d},e)}}}]);