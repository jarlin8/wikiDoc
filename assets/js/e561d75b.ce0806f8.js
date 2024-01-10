/*! For license information please see e561d75b.ce0806f8.js.LICENSE.txt */
"use strict";(self.webpackChunkwikidoc=self.webpackChunkwikidoc||[]).push([[3247],{26502:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>o,contentTitle:()=>c,default:()=>h,frontMatter:()=>s,metadata:()=>d,toc:()=>t});n(67294);var i=n(85893),l=n(11151);const s={},c="MQ4\u51fd\u6570\u89e3\u6790\u7b14\u8bb0",d={unversionedId:"nytimes/MQ4\u5404\u79cd\u51fd\u6570\u53c2\u6570\u7b14\u8bb0",id:"nytimes/MQ4\u5404\u79cd\u51fd\u6570\u53c2\u6570\u7b14\u8bb0",title:"MQ4\u51fd\u6570\u89e3\u6790\u7b14\u8bb0",description:"\u5173\u95ed\u8ba2\u5355\u7684\u51fd\u6570OrderClosePrice()",source:"@site/docs/nytimes/MQ4\u5404\u79cd\u51fd\u6570\u53c2\u6570\u7b14\u8bb0.md",sourceDirName:"nytimes",slug:"/nytimes/MQ4\u5404\u79cd\u51fd\u6570\u53c2\u6570\u7b14\u8bb0",permalink:"/nytimes/MQ4\u5404\u79cd\u51fd\u6570\u53c2\u6570\u7b14\u8bb0",draft:!1,tags:[],version:"current",lastUpdatedBy:"joe",lastUpdatedAt:1704892689,formattedLastUpdatedAt:"2024\u5e741\u670810\u65e5",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"\u7ebd\u65f6\u64ad\u62a5",permalink:"/nytimes/"},next:{title:"\u6e05\u6670\u7b80\u6d01\u7684\u8bed\u8a00\u548c\u6e05\u6670\u81ea\u7136\u7684\u8bed\u8a00\u5728\u7ffb\u8bd1\u4e2d\u90fd\u6709\u5176\u4f18\u70b9",permalink:"/nytimes/concise-vs-natrue"}},o={},t=[{value:"\u5173\u95ed\u8ba2\u5355\u7684\u51fd\u6570<code>OrderClosePrice()</code>",id:"\u5173\u95ed\u8ba2\u5355\u7684\u51fd\u6570ordercloseprice",level:2},{value:"\u8bbe\u7f6e\u6b62\u76c8\u548c\u6b62\u635f",id:"\u8bbe\u7f6e\u6b62\u76c8\u548c\u6b62\u635f",level:2},{value:"\u4e0b\u5355\u7684\u51fd\u6570\u53ca\u5199\u6cd5",id:"\u4e0b\u5355\u7684\u51fd\u6570\u53ca\u5199\u6cd5",level:2},{value:"for\u5faa\u73af\u7684\u8ff7\u60d1",id:"for\u5faa\u73af\u7684\u8ff7\u60d1",level:2}];function a(e){const r=Object.assign({h1:"h1",h2:"h2",code:"code",p:"p",pre:"pre",ul:"ul",li:"li",strong:"strong",blockquote:"blockquote"},(0,l.ah)(),e.components);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(r.h1,{id:"mq4\u51fd\u6570\u89e3\u6790\u7b14\u8bb0",children:"MQ4\u51fd\u6570\u89e3\u6790\u7b14\u8bb0"}),"\n",(0,i.jsxs)(r.h2,{id:"\u5173\u95ed\u8ba2\u5355\u7684\u51fd\u6570ordercloseprice",children:["\u5173\u95ed\u8ba2\u5355\u7684\u51fd\u6570",(0,i.jsx)(r.code,{children:"OrderClosePrice()"})]}),"\n",(0,i.jsxs)(r.p,{children:["\u8be6\u7ec6\u89e3\u91ca\u4e00\u4e0b MarketInfo(OrderSymbol(), MODE_BID) MarketInfo(OrderSymbol(), MODE_ASK) \u3001ask \u3001bid\u3001\u4e0e",(0,i.jsx)(r.code,{children:"OrderClosePrice()"}),"  \u5e76\u89e3\u91ca\u7528\u54ea\u4e00\u4e2a\u5173\u6389\u8ba2\u5355\u6700\u5408\u9002?"]}),"\n",(0,i.jsx)(r.p,{children:"MarketInfo(OrderSymbol(), MODE_BID) \u548c MarketInfo(OrderSymbol(), MODE_ASK) \u662f\u7528\u6765\u83b7\u53d6\u5f53\u524d\u4ea4\u6613\u54c1\u79cd\u7684\u4e70\u5165\u4ef7\u548c\u5356\u51fa\u4ef7\u7684\u51fd\u6570\u3002\u5176\u4e2d\uff0cMODE_BID \u8868\u793a\u4e70\u5165\u4ef7\uff0cMODE_ASK \u8868\u793a\u5356\u51fa\u4ef7\u3002\u4e70\u5165\u4ef7\u6307\u7684\u662f\u4ea4\u6613\u5546\u613f\u610f\u4ee5\u8be5\u4ef7\u683c\u4e70\u5165\u8d27\u5e01\u5bf9\u7684\u6700\u9ad8\u4ef7\u683c\uff0c\u5356\u51fa\u4ef7\u6307\u7684\u662f\u4ea4\u6613\u5546\u613f\u610f\u4ee5\u8be5\u4ef7\u683c\u5356\u51fa\u8d27\u5e01\u5bf9\u7684\u6700\u4f4e\u4ef7\u683c\u3002\u8fd9\u4e24\u4e2a\u4ef7\u683c\u4e4b\u95f4\u7684\u5dee\u8ddd\u79f0\u4e3a\u4ef7\u5dee\uff08\u6216\u8005\u53eb\u505a\u70b9\u5dee\uff09\uff0c\u662f\u4ea4\u6613\u5546\u7684\u76c8\u5229\u6765\u6e90\u4e4b\u4e00\u3002"}),"\n",(0,i.jsx)(r.p,{children:"OrderClosePrice() \u662f\u7528\u6765\u83b7\u53d6\u5df2\u7ecf\u5173\u95ed\u7684\u8ba2\u5355\u7684\u5e73\u4ed3\u4ef7\u683c\u7684\u51fd\u6570\u3002\u5f53\u6211\u4eec\u4f7f\u7528 OrderClose() \u51fd\u6570\u6765\u5173\u95ed\u4e00\u4e2a\u8ba2\u5355\u65f6\uff0c\u53ef\u4ee5\u901a\u8fc7 OrderClosePrice() \u51fd\u6570\u6765\u83b7\u53d6\u8be5\u8ba2\u5355\u7684\u5e73\u4ed3\u4ef7\u683c\u3002"}),"\n",(0,i.jsx)(r.p,{children:"\u5982\u679c\u6211\u4eec\u60f3\u8981\u5173\u95ed\u4e00\u4e2a\u4e70\u5355\uff0c\u90a3\u4e48\u5e94\u8be5\u4f7f\u7528\u5356\u51fa\u4ef7\u6765\u8ba1\u7b97\u5e73\u4ed3\u4ef7\u683c\uff0c\u56e0\u4e3a\u5356\u51fa\u4ef7\u6bd4\u4e70\u5165\u4ef7\u66f4\u63a5\u8fd1\u5f53\u524d\u5e02\u573a\u4ef7\u683c\uff0c\u800c\u5356\u51fa\u4ef7\u4e5f\u662f\u4ea4\u6613\u5546\u613f\u610f\u4ee5\u8be5\u4ef7\u683c\u5356\u51fa\u8d27\u5e01\u5bf9\u7684\u6700\u4f4e\u4ef7\u683c\u3002\u56e0\u6b64\uff0c\u5728\u5173\u95ed\u4e70\u5355\u65f6\uff0c\u5e94\u8be5\u4f7f\u7528 MarketInfo(OrderSymbol(), MODE_ASK) \u6765\u83b7\u53d6\u5356\u51fa\u4ef7\uff0c\u5e76\u5c06\u5176\u4f5c\u4e3a\u5e73\u4ed3\u4ef7\u683c\u3002"}),"\n",(0,i.jsx)(r.p,{children:"\u540c\u7406\uff0c\u5982\u679c\u6211\u4eec\u60f3\u8981\u5173\u95ed\u4e00\u4e2a\u5356\u5355\uff0c\u90a3\u4e48\u5e94\u8be5\u4f7f\u7528\u4e70\u5165\u4ef7\u6765\u8ba1\u7b97\u5e73\u4ed3\u4ef7\u683c\uff0c\u56e0\u4e3a\u4e70\u5165\u4ef7\u6bd4\u5356\u51fa\u4ef7\u66f4\u63a5\u8fd1\u5f53\u524d\u5e02\u573a\u4ef7\u683c\uff0c\u800c\u4e70\u5165\u4ef7\u4e5f\u662f\u4ea4\u6613\u5546\u613f\u610f\u4ee5\u8be5\u4ef7\u683c\u4e70\u5165\u8d27\u5e01\u5bf9\u7684\u6700\u9ad8\u4ef7\u683c\u3002\u56e0\u6b64\uff0c\u5728\u5173\u95ed\u5356\u5355\u65f6\uff0c\u5e94\u8be5\u4f7f\u7528 MarketInfo(OrderSymbol(), MODE_BID) \u6765\u83b7\u53d6\u4e70\u5165\u4ef7\uff0c\u5e76\u5c06\u5176\u4f5c\u4e3a\u5e73\u4ed3\u4ef7\u683c\u3002"}),"\n",(0,i.jsxs)(r.p,{children:["\u76f4\u63a5\u4f7f\u7528\u5185\u7f6e\u51fd\u6570",(0,i.jsx)(r.code,{children:"OrderClosePrice()"}),"\u4f5c\u4e3a\u5173\u95ed\u8ba2\u5355\u7684\u4f9d\u636e\uff0c\u7a0b\u5e8f\u4f1a\u81ea\u52a8\u5224\u65ad\u7528Ask\u8fd8\u662fBid\uff0c\u65e0\u9700\u624b\u52a8\u6216\u4f7f\u7528\u6761\u4ef6\u8bed\u53e5\u5224\u65ad\u3002"]}),"\n",(0,i.jsx)(r.h2,{id:"\u8bbe\u7f6e\u6b62\u76c8\u548c\u6b62\u635f",children:"\u8bbe\u7f6e\u6b62\u76c8\u548c\u6b62\u635f"}),"\n",(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:"language-c++",originalType:"code",children:"// \u8ba1\u7b97\u6b62\u635f\u548c\u6b62\u76c8\ndouble SL = 0;\ndouble TP = 0;\n\nif(OrderType() == OP_BUY)\n{\n    SL = BuyLimitPrice - stopLoss * Point;\n    TP = BuyLimitPrice + takeProfit * Point;\n}\nelse if(OrderType() == OP_SELL)\n{\n    SL = SellLimitPrice + stopLoss * Point;\n    TP = SellLimitPrice - takeProfit * Point;\n}\n"})}),"\n",(0,i.jsxs)(r.p,{children:["\u4ee3\u7801\u653e\u5728\u7b56\u7565\u4e2d\u9700\u8981\u8ba1\u7b97\u6b62\u635f\u548c\u6b62\u76c8\u6c34\u5e73\u7684\u5730\u65b9\u3002\u5982\u679c\u5e0c\u671b\u5728\u6bcf\u4e2a\u65b0\u7684tick\u5230\u6765\u65f6\u91cd\u65b0\u8ba1\u7b97\u6b62\u635f\u548c\u6b62\u76c8\u6c34\u5e73\uff0c\u90a3\u4e48\u53ef\u4ee5\u5c06\u5176\u653e\u5728",(0,i.jsx)(r.code,{children:"ontick()"}),"\u51fd\u6570\u4e2d\u3002\u5982\u679c\u53ea\u5e0c\u671b\u5728\u5f00\u4ed3\u65f6\u8ba1\u7b97\u4e00\u6b21\uff0c\u90a3\u4e48\u53ef\u4ee5\u5c06\u5176\u653e\u5728\u5168\u5c40\u4e2d\u3002"]}),"\n",(0,i.jsx)(r.h2,{id:"\u4e0b\u5355\u7684\u51fd\u6570\u53ca\u5199\u6cd5",children:"\u4e0b\u5355\u7684\u51fd\u6570\u53ca\u5199\u6cd5"}),"\n",(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{originalType:"code",children:' int BuyTicket = OrderSend(Symbol(), OP_BUYLIMIT, CurrentBuyLotSize, BuyLimitPrice, 3, 0, 0, "WinLimit-Buy", MagicNumber, 0, clrGreen);\n int SellTicket = OrderSend(Symbol(), OP_SELLLIMIT, CurrentSellLotSize, SellLimitPrice, 3, 0, 0, "WinLimit-Sell", MagicNumber, 0, clrRed);\n'})}),"\n",(0,i.jsxs)(r.p,{children:["\u4e0a\u9762\u8fd9\u6bb5\u4ee3\u7801\u662f\u7528\u6765\u5728MetaTrader 4\u5e73\u53f0\u4e0a\u4e0b\u9650\u4ef7\u4e70\u5356\u5355\u7684\u3002",(0,i.jsx)(r.code,{children:"OrderSend"}),"\u51fd\u6570\u7684\u5404\u4e2a\u53c2\u6570\u7684\u610f\u4e49\u5982\u4e0b\uff1a"]}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"Symbol()"}),"\uff1a\u4ea4\u6613\u54c1\u79cd\uff0c\u8fd9\u91cc\u4f7f\u7528\u5f53\u524d\u56fe\u8868\u7684\u4ea4\u6613\u54c1\u79cd\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"OP_BUYLIMIT"}),"\uff1a\u8ba2\u5355\u7c7b\u578b\uff0c\u8fd9\u91cc\u662f\u9650\u4ef7\u4e70\u5355\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"CurrentBuyLotSize"}),"\uff1a\u4ea4\u6613\u624b\u6570\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"BuyLimitPrice"}),"\uff1a\u9650\u4ef7\u4e70\u5355\u7684\u4ef7\u683c\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"3"}),"\uff1a\u6b62\u635f\u548c\u6b62\u76c8\u7684\u8ddd\u79bb\uff0c\u4ee5\u70b9\u4e3a\u5355\u4f4d\u3002\u8fd9\u91cc\u8bbe\u7f6e\u4e3a3\u70b9\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"0"}),"\uff1a\u6b62\u635f\u4ef7\u683c\u3002\u8fd9\u91cc\u8bbe\u7f6e\u4e3a0\uff0c\u8868\u793a\u4e0d\u8bbe\u6b62\u635f\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"0"}),"\uff1a\u6b62\u76c8\u4ef7\u683c\u3002\u8fd9\u91cc\u8bbe\u7f6e\u4e3a0\uff0c\u8868\u793a\u4e0d\u8bbe\u6b62\u76c8\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:'"WinLimit-Buy"'}),"\uff1a\u8ba2\u5355\u6ce8\u91ca\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"MagicNumber"}),"\uff1a\u8ba2\u5355\u9b54\u6570\uff0c\u7528\u4e8e\u533a\u5206\u4e0d\u540c\u7684\u7b56\u7565\u6216EA\u4ea7\u751f\u7684\u8ba2\u5355\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"0"}),"\uff1a\u6302\u5355\u8fc7\u671f\u65f6\u95f4\u3002\u8fd9\u91cc\u8bbe\u7f6e\u4e3a0\uff0c\u8868\u793a\u6302\u5355\u4e0d\u4f1a\u8fc7\u671f\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"clrGreen"}),"\uff1a\u8ba2\u5355\u5728\u56fe\u8868\u4e0a\u663e\u793a\u7684\u989c\u8272\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(r.p,{children:["\u5982\u4f55\u8981\u8bbe\u7f6e\u6b62\u76c8\u548c\u6b62\u635f \u8981\u6539\u52a83\u540e\u9762\u4e24\u4e2a0\u7684\u4f4d\u7f6e\u4e3a ",(0,i.jsx)(r.code,{children:"SL"})," ",(0,i.jsx)(r.code,{children:"TP"})]}),"\n",(0,i.jsxs)(r.p,{children:["\u5982\u679c\u4f60\u5e0c\u671b",(0,i.jsx)(r.strong,{children:"\u5728\u4e0b\u5355\u624b\u6570\u5927\u4e8e1\u624b\u65f6\u624d\u4f7f\u7528\u6b62\u76c8\u6b62\u635f"}),"\uff0c",(0,i.jsx)(r.strong,{children:"\u624b\u6570\u5c0f\u4e8e\u7b49\u4e8e1\u624b\u65f6\u4e0d\u4f7f\u7528\u6b62\u76c8\u6b62\u635f"}),"\uff0c\u90a3\u4e48\u53ef\u4ee5\u5728\u8ba1\u7b97\u6b62\u635f\u548c\u6b62\u76c8\u4e4b\u524d\u52a0\u5165\u4e00\u4e2a\u5224\u65ad\u6761\u4ef6\uff0c\u5982\u4e0b\u6240\u793a\uff1a"]}),"\n",(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:"language-c++",originalType:"code",children:'extern double stopLoss = 1000; // \u6b62\u635f\u70b9\u6570\nextern double takeProfit = 1300; // \u6b62\u76c8\u70b9\u6570\n\n// \u8ba1\u7b97\u6b62\u635f\u548c\u6b62\u76c8\ndouble SL = 0;\ndouble TP = 0;\n\nif(CurrentBuyLotSize > 1 || CurrentSellLotSize > 1)\n{\n    if(OrderSelect(0, SELECT_BY_POS, MODE_TRADES))\n    {\n        if(OrderType() == OP_BUY)\n        {\n            SL = BuyLimitPrice - stopLoss * Point;\n            TP = BuyLimitPrice + takeProfit * Point;\n        }\n        else if(OrderType() == OP_SELL)\n        {\n            SL = SellLimitPrice + stopLoss * Point;\n            TP = SellLimitPrice - takeProfit * Point;\n        }\n    }\n}\n// \u53ef\u4ee5\u66ff\u6362\u6210\u5176\u4ed6\u6761\u4ef6\u5224\u65ad\u8bed\u53e5\nint BuyTicket = OrderSend(Symbol(), OP_BUYLIMIT, CurrentBuyLotSize, BuyLimitPrice, 3, SL, TP, "WinLimit-Buy", MagicNumber, 0, clrGreen);\nint SellTicket = OrderSend(Symbol(), OP_SELLLIMIT, CurrentSellLotSize, SellLimitPrice, 3, SL, TP, "WinLimit-Sell", MagicNumber, 0, clrRed);\n'})}),"\n",(0,i.jsxs)(r.p,{children:["\u8fd9\u6837\uff0c\u5728\u4e0b\u5355\u624b\u6570\u5927\u4e8e1\u624b\u65f6\uff0c",(0,i.jsx)(r.code,{children:"SL"}),"\u548c",(0,i.jsx)(r.code,{children:"TP"}),"\u7684\u503c\u4f1a\u88ab\u8ba1\u7b97\u51fa\u6765\uff0c\u5426\u5219\u5b83\u4eec\u7684\u503c\u90fd\u4e3a0\uff0c\u8868\u793a\u4e0d\u4f7f\u7528\u6b62\u76c8\u6b62\u635f\u3002"]}),"\n",(0,i.jsx)(r.h2,{id:"for\u5faa\u73af\u7684\u8ff7\u60d1",children:"for\u5faa\u73af\u7684\u8ff7\u60d1"}),"\n",(0,i.jsx)(r.p,{children:(0,i.jsx)(r.code,{children:"for(int i = OrdersTotal() - 1; i >= 0; i--)\u4e0e for(int i = 0; i < OrdersTotal(); i++)"})}),"\n",(0,i.jsxs)(r.p,{children:["\u8fd9\u4e24\u4e2a",(0,i.jsx)(r.code,{children:"for"}),"\u5faa\u73af\u7684\u533a\u522b\u5728\u4e8e\u5b83\u4eec\u904d\u5386\u8ba2\u5355\u7684\u987a\u5e8f\u4e0d\u540c\u3002"]}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"for(int i = OrdersTotal() - 1; i >= 0; i--)"}),"\uff1a\u8fd9\u4e2a\u5faa\u73af\u662f\u4ece\u6700\u540e\u4e00\u4e2a\u8ba2\u5355\u5f00\u59cb\uff0c\u5012\u5e8f\u904d\u5386\u6240\u6709\u8ba2\u5355\u3002"]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:"for(int i = 0; i < OrdersTotal(); i++)"}),"\uff1a\u8fd9\u4e2a\u5faa\u73af\u662f\u4ece\u7b2c\u4e00\u4e2a\u8ba2\u5355\u5f00\u59cb\uff0c\u987a\u5e8f\u904d\u5386\u6240\u6709\u8ba2\u5355\u3002"]}),"\n"]}),"\n",(0,i.jsx)(r.p,{children:"\u5728\u67d0\u4e9b\u60c5\u51b5\u4e0b\uff0c\u904d\u5386\u8ba2\u5355\u7684\u987a\u5e8f\u53ef\u80fd\u4f1a\u5f71\u54cd\u7b56\u7565\u7684\u6267\u884c\u3002\u4f8b\u5982\uff0c\u5982\u679c\u4f60\u5728\u5faa\u73af\u4e2d\u5220\u9664\u4e86\u67d0\u4e2a\u8ba2\u5355\uff0c\u90a3\u4e48\u4f7f\u7528\u5012\u5e8f\u904d\u5386\u53ef\u4ee5\u907f\u514d\u56e0\u4e3a\u8ba2\u5355\u7d22\u5f15\u6539\u53d8\u800c\u5bfc\u81f4\u7684\u95ee\u9898\u3002"}),"\n",(0,i.jsx)(r.p,{children:(0,i.jsx)(r.code,{children:"\u4e3a\u4ec0\u4e48\u5728\u5b9a\u4e49\u5220\u9664\u6240\u6709\u8ba2\u5355closeAllOder()\u65f6\uff0c\u5fc5\u987b\u4f7f\u7528for(int i = OrdersTotal() - 1; i >= 0; i--)"})}),"\n",(0,i.jsxs)(r.p,{children:["\u5728\u5b9a\u4e49\u5220\u9664\u6240\u6709\u8ba2\u5355\u7684",(0,i.jsx)(r.code,{children:"closeAllOrder()"}),"\u51fd\u6570\u65f6\uff0c\u901a\u5e38\u4f1a\u4f7f\u7528",(0,i.jsx)(r.code,{children:"for(int i = OrdersTotal() - 1; i >= 0; i--)"}),"\u8fd9\u79cd\u5012\u5e8f\u904d\u5386\u7684\u65b9\u5f0f\uff0c\u539f\u56e0\u662f\u5f53\u4f60\u5220\u9664\u4e00\u4e2a\u8ba2\u5355\u65f6\uff0c",(0,i.jsx)(r.code,{children:"OrdersTotal()"}),"\u7684\u503c\u4f1a\u51cf\u5c111\uff0c\u800c\u4e14\u6240\u6709\u8ba2\u5355\u7684\u7d22\u5f15\u4e5f\u4f1a\u53d1\u751f\u53d8\u5316\u3002"]}),"\n",(0,i.jsx)(r.p,{children:"\u5982\u679c\u4f60\u4f7f\u7528\u987a\u5e8f\u904d\u5386\u7684\u65b9\u5f0f\uff0c\u90a3\u4e48\u5728\u5220\u9664\u4e00\u4e2a\u8ba2\u5355\u540e\uff0c\u4e0b\u4e00\u4e2a\u8ba2\u5355\u7684\u7d22\u5f15\u4f1a\u53d8\u6210\u5f53\u524d\u8ba2\u5355\u7684\u7d22\u5f15\uff0c\u8fd9\u6837\u5c31\u4f1a\u5bfc\u81f4\u6f0f\u5220\u8ba2\u5355\u3002\u800c\u4f7f\u7528\u5012\u5e8f\u904d\u5386\u7684\u65b9\u5f0f\u5219\u4e0d\u4f1a\u51fa\u73b0\u8fd9\u4e2a\u95ee\u9898\uff0c\u56e0\u4e3a\u5220\u9664\u4e00\u4e2a\u8ba2\u5355\u53ea\u4f1a\u5f71\u54cd\u5b83\u540e\u9762\u7684\u8ba2\u5355\u7684\u7d22\u5f15\uff0c\u800c\u4e0d\u4f1a\u5f71\u54cd\u5b83\u524d\u9762\u7684\u8ba2\u5355\u3002"}),"\n",(0,i.jsxs)(r.p,{children:["\u4e3e\u4e2a\u4f8b\u5b50\uff0c",(0,i.jsx)(r.strong,{children:"\u5047\u8bbe\u4f60\u67093\u4e2a\u8ba2\u5355\uff0c\u5b83\u4eec\u7684\u7d22\u5f15\u5206\u522b\u4e3a0\u30011\u548c2\u3002\u5982\u679c\u4f60\u4f7f\u7528\u987a\u5e8f\u904d\u5386\u7684\u65b9\u5f0f\uff0c\u5728\u5220\u9664\u7d22\u5f15\u4e3a0\u7684\u8ba2\u5355\u540e\uff0c\u539f\u672c\u7d22\u5f15\u4e3a1\u548c2\u7684\u8ba2\u5355\u73b0\u5728\u53d8\u6210\u4e86\u7d22\u5f15\u4e3a0\u548c1\u7684\u8ba2\u5355\u3002\u8fd9\u6837\uff0c\u5728\u4e0b\u4e00\u6b21\u5faa\u73af\u4e2d\uff0c\u4f60\u4f1a\u8df3\u8fc7\u539f\u672c\u7d22\u5f15\u4e3a1\u7684\u8ba2\u5355\uff0c\u76f4\u63a5\u5220\u9664\u7d22\u5f15\u4e3a1\uff08\u539f\u672c\u4e3a2\uff09\u7684\u8ba2\u5355\u3002\u800c\u5982\u679c\u4f60\u4f7f\u7528\u5012\u5e8f\u904d\u5386\u7684\u65b9\u5f0f\uff0c\u5728\u5220\u9664\u7d22\u5f15\u4e3a2\u7684\u8ba2\u5355\u540e\uff0c\u539f\u672c\u7d22\u5f15\u4e3a0\u548c1\u7684\u8ba2\u5355\u4ecd\u7136\u662f\u7d22\u5f15\u4e3a0\u548c1\uff0c\u4e0d\u4f1a\u53d7\u5230\u5f71\u54cd\u3002"})]}),"\n",(0,i.jsxs)(r.blockquote,{children:["\n",(0,i.jsxs)(r.p,{children:["\u5728\u5927\u591a\u6570\u60c5\u51b5\u4e0b\uff0c\u4f7f\u7528",(0,i.jsx)(r.code,{children:"for(int i = 0; i < OrdersTotal(); i++)"}),"\u987a\u5e8f\u904d\u5386\u548c\u4f7f\u7528",(0,i.jsx)(r.code,{children:"for(int i = OrdersTotal() - 1; i >= 0; i--)"}),"\u5012\u5e8f\u904d\u5386\u90fd\u662f\u53ef\u4ee5\u7684\u3002\u53ea\u6709\u5728\u4f60\u9700\u8981\u5bf9\u8ba2\u5355\u8fdb\u884c\u5220\u9664\u6216\u4fee\u6539\u64cd\u4f5c\u65f6\uff0c\u624d\u9700\u8981\u6ce8\u610f\u904d\u5386\u7684\u987a\u5e8f\u3002\n\u5982\u679c\u53ea\u662f\u60f3\u83b7\u53d6\u8ba2\u5355\u4fe1\u606f\uff0c\u800c\u4e0d\u9700\u8981\u5bf9\u8ba2\u5355\u8fdb\u884c\u5220\u9664\u6216\u4fee\u6539\u64cd\u4f5c\uff0c\u90a3\u4e48\u4f7f\u7528\u987a\u5e8f\u904d\u5386\u548c\u5012\u5e8f\u904d\u5386\u90fd\u662f\u53ef\u4ee5\u7684\u3002\u4f8b\u5982\uff0c\u53ef\u4ee5\u4f7f\u7528\u987a\u5e8f\u904d\u5386\u6765\u7edf\u8ba1\u5f53\u524d\u6240\u6709\u8ba2\u5355\u7684\u603b\u76c8\u4e8f\u3002"]}),"\n"]})]})}const h=function(e){void 0===e&&(e={});const{wrapper:r}=Object.assign({},(0,l.ah)(),e.components);return r?(0,i.jsx)(r,Object.assign({},e,{children:(0,i.jsx)(a,e)})):a(e)}},75251:(e,r,n)=>{n(27418);var i=n(67294),l=60103;if(r.Fragment=60107,"function"==typeof Symbol&&Symbol.for){var s=Symbol.for;l=s("react.element"),r.Fragment=s("react.fragment")}var c=i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d=Object.prototype.hasOwnProperty,o={key:!0,ref:!0,__self:!0,__source:!0};function t(e,r,n){var i,s={},t=null,a=null;for(i in void 0!==n&&(t=""+n),void 0!==r.key&&(t=""+r.key),void 0!==r.ref&&(a=r.ref),r)d.call(r,i)&&!o.hasOwnProperty(i)&&(s[i]=r[i]);if(e&&e.defaultProps)for(i in r=e.defaultProps)void 0===s[i]&&(s[i]=r[i]);return{$$typeof:l,type:e,key:t,ref:a,props:s,_owner:c.current}}r.jsx=t,r.jsxs=t},85893:(e,r,n)=>{e.exports=n(75251)},11151:(e,r,n)=>{n.d(r,{Zo:()=>d,ah:()=>s});var i=n(67294);const l=i.createContext({});function s(e){const r=i.useContext(l);return i.useMemo((()=>"function"==typeof e?e(r):{...r,...e}),[r,e])}const c={};function d({components:e,children:r,disableParentContext:n}){let d;return d=n?"function"==typeof e?e({}):e||c:s(e),i.createElement(l.Provider,{value:d},r)}}}]);