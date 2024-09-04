"use strict";(self.webpackChunkwikidoc=self.webpackChunkwikidoc||[]).push([[27918],{92679:(e,t,n)=>{n.r(t),n.d(t,{default:()=>xe});var s=n(67294),a=n(1944),i=n(902),l=n(85893);const o=s.createContext(null);function r(e){let{children:t,content:n}=e;const a=function(e){return(0,s.useMemo)((()=>({metadata:e.metadata,frontMatter:e.frontMatter,assets:e.assets,contentTitle:e.contentTitle,toc:e.toc})),[e])}(n);return(0,l.jsx)(o.Provider,{value:a,children:t})}function d(){const e=(0,s.useContext)(o);if(null===e)throw new i.i6("DocProvider");return e}function c(){const{metadata:e,frontMatter:t,assets:n}=d();return(0,l.jsx)(a.d,{title:e.title,description:e.description,keywords:t.keywords,image:n.image??t.image})}var h=n(90512),m=n(87524),u=n(95999),x=n(33692);function p(e){const{permalink:t,title:n,subLabel:s,isNext:a}=e;return(0,l.jsxs)(x.Z,{className:(0,h.Z)("pagination-nav__link",a?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t,children:[s&&(0,l.jsx)("div",{className:"pagination-nav__sublabel",children:s}),(0,l.jsx)("div",{className:"pagination-nav__label",children:n})]})}function b(e){const{previous:t,next:n}=e;return(0,l.jsxs)("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,u.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages",description:"The ARIA label for the docs pagination"}),children:[t&&(0,l.jsx)(p,{...t,subLabel:(0,l.jsx)(u.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc",children:"Previous"})}),n&&(0,l.jsx)(p,{...n,subLabel:(0,l.jsx)(u.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc",children:"Next"}),isNext:!0})]})}function g(){const{metadata:e}=d();return(0,l.jsx)(b,{previous:e.previous,next:e.next})}var v=n(52263),j=n(80143),f=n(35281),_=n(60373),k=n(74477);const N={unreleased:function(e){let{siteTitle:t,versionMetadata:n}=e;return(0,l.jsx)(u.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:(0,l.jsx)("b",{children:n.label})},children:"This is unreleased documentation for {siteTitle} {versionLabel} version."})},unmaintained:function(e){let{siteTitle:t,versionMetadata:n}=e;return(0,l.jsx)(u.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:(0,l.jsx)("b",{children:n.label})},children:"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained."})}};function Z(e){const t=N[e.versionMetadata.banner];return(0,l.jsx)(t,{...e})}function C(e){let{versionLabel:t,to:n,onClick:s}=e;return(0,l.jsx)(u.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:(0,l.jsx)("b",{children:(0,l.jsx)(x.Z,{to:n,onClick:s,children:(0,l.jsx)(u.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label",children:"latest version"})})})},children:"For up-to-date documentation, see the {latestVersionLink} ({versionLabel})."})}function w(e){let{className:t,versionMetadata:n}=e;const{siteConfig:{title:s}}=(0,v.Z)(),{pluginId:a}=(0,j.gA)({failfast:!0}),{savePreferredVersionName:i}=(0,_.J)(a),{latestDocSuggestion:o,latestVersionSuggestion:r}=(0,j.Jo)(a),d=o??(c=r).docs.find((e=>e.id===c.mainDocId));var c;return(0,l.jsxs)("div",{className:(0,h.Z)(t,f.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert",children:[(0,l.jsx)("div",{children:(0,l.jsx)(Z,{siteTitle:s,versionMetadata:n})}),(0,l.jsx)("div",{className:"margin-top--md",children:(0,l.jsx)(C,{versionLabel:r.label,to:d.path,onClick:()=>i(r.name)})})]})}function T(e){let{className:t}=e;const n=(0,k.E)();return n.banner?(0,l.jsx)(w,{className:t,versionMetadata:n}):null}function L(e){let{className:t}=e;const n=(0,k.E)();return n.badge?(0,l.jsx)("span",{className:(0,h.Z)(t,f.k.docs.docVersionBadge,"badge badge--secondary"),children:(0,l.jsx)(u.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:n.label},children:"Version: {versionLabel}"})}):null}var y=n(13008);const U={tags:"tags_jXut",tag:"tag_QGVx"};function B(e){let{tags:t}=e;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("b",{children:(0,l.jsx)(u.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list",children:"Tags:"})}),(0,l.jsx)("ul",{className:(0,h.Z)(U.tags,"padding--none","margin-left--sm"),children:t.map((e=>{let{label:t,permalink:n}=e;return(0,l.jsx)("li",{className:U.tag,children:(0,l.jsx)(y.Z,{label:t,permalink:n})},n)}))})]})}const A={iconEdit:"iconEdit_Z9Sw"};function M(e){let{className:t,...n}=e;return(0,l.jsx)("svg",{fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,h.Z)(A.iconEdit,t),"aria-hidden":"true",...n,children:(0,l.jsx)("g",{children:(0,l.jsx)("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})})})}function I(e){let{editUrl:t}=e;return(0,l.jsxs)(x.Z,{to:t,className:f.k.common.editThisPage,children:[(0,l.jsx)(M,{}),(0,l.jsx)(u.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page",children:"Edit this page"})]})}function E(e){void 0===e&&(e={});const{i18n:{currentLocale:t}}=(0,v.Z)(),n=function(){const{i18n:{currentLocale:e,localeConfigs:t}}=(0,v.Z)();return t[e].calendar}();return new Intl.DateTimeFormat(t,{calendar:n,...e})}function F(e){let{lastUpdatedAt:t}=e;const n=new Date(t),s=E({day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(n);return(0,l.jsx)(u.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:(0,l.jsx)("b",{children:(0,l.jsx)("time",{dateTime:n.toISOString(),itemProp:"dateModified",children:s})})},children:" on {date}"})}function H(e){let{lastUpdatedBy:t}=e;return(0,l.jsx)(u.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:(0,l.jsx)("b",{children:t})},children:" by {user}"})}function V(e){let{lastUpdatedAt:t,lastUpdatedBy:n}=e;return(0,l.jsxs)("span",{className:f.k.common.lastUpdated,children:[(0,l.jsx)(u.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t?(0,l.jsx)(F,{lastUpdatedAt:t}):"",byUser:n?(0,l.jsx)(H,{lastUpdatedBy:n}):""},children:"Last updated{atDate}{byUser}"}),!1]})}const P={lastUpdated:"lastUpdated_JAkA"};function S(e){let{className:t,editUrl:n,lastUpdatedAt:s,lastUpdatedBy:a}=e;return(0,l.jsxs)("div",{className:(0,h.Z)("row",t),children:[(0,l.jsx)("div",{className:"col",children:n&&(0,l.jsx)(I,{editUrl:n})}),(0,l.jsx)("div",{className:(0,h.Z)("col",P.lastUpdated),children:(s||a)&&(0,l.jsx)(V,{lastUpdatedAt:s,lastUpdatedBy:a})})]})}function D(){const{metadata:e}=d(),{editUrl:t,lastUpdatedAt:n,lastUpdatedBy:s,tags:a}=e,i=a.length>0,o=!!(t||n||s);return i||o?(0,l.jsxs)("footer",{className:(0,h.Z)(f.k.docs.docFooter,"docusaurus-mt-lg"),children:[i&&(0,l.jsx)("div",{className:(0,h.Z)("row margin-top--sm",f.k.docs.docFooterTagsRow),children:(0,l.jsx)("div",{className:"col",children:(0,l.jsx)(B,{tags:a})})}),o&&(0,l.jsx)(S,{className:(0,h.Z)("margin-top--sm",f.k.docs.docFooterEditMetaRow),editUrl:t,lastUpdatedAt:n,lastUpdatedBy:s})]}):null}var z=n(86043),R=n(31498);const O={tocCollapsibleButton:"tocCollapsibleButton_TO0P",tocCollapsibleButtonExpanded:"tocCollapsibleButtonExpanded_MG3E"};function W(e){let{collapsed:t,...n}=e;return(0,l.jsx)("button",{type:"button",...n,className:(0,h.Z)("clean-btn",O.tocCollapsibleButton,!t&&O.tocCollapsibleButtonExpanded,n.className),children:(0,l.jsx)(u.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component",children:"On this page"})})}const X={tocCollapsible:"tocCollapsible_ETCw",tocCollapsibleContent:"tocCollapsibleContent_vkbj",tocCollapsibleExpanded:"tocCollapsibleExpanded_sAul"};function G(e){let{toc:t,className:n,minHeadingLevel:s,maxHeadingLevel:a}=e;const{collapsed:i,toggleCollapsed:o}=(0,z.u)({initialState:!0});return(0,l.jsxs)("div",{className:(0,h.Z)(X.tocCollapsible,!i&&X.tocCollapsibleExpanded,n),children:[(0,l.jsx)(W,{collapsed:i,onClick:o}),(0,l.jsx)(z.z,{lazy:!0,className:X.tocCollapsibleContent,collapsed:i,children:(0,l.jsx)(R.Z,{toc:t,minHeadingLevel:s,maxHeadingLevel:a})})]})}const J={tocMobile:"tocMobile_ITEo"};function q(){const{toc:e,frontMatter:t}=d();return(0,l.jsx)(G,{toc:e,minHeadingLevel:t.toc_min_heading_level,maxHeadingLevel:t.toc_max_heading_level,className:(0,h.Z)(f.k.docs.docTocMobile,J.tocMobile)})}var Q=n(39407);function Y(){const{toc:e,frontMatter:t}=d();return(0,l.jsx)(Q.Z,{toc:e,minHeadingLevel:t.toc_min_heading_level,maxHeadingLevel:t.toc_max_heading_level,className:f.k.docs.docTocDesktop})}var $=n(92503),K=n(14523);function ee(e){let{children:t}=e;const n=function(){const{metadata:e,frontMatter:t,contentTitle:n}=d();return t.hide_title||void 0!==n?null:e.title}();return(0,l.jsxs)("div",{className:(0,h.Z)(f.k.docs.docMarkdown,"markdown"),children:[n&&(0,l.jsx)("header",{children:(0,l.jsx)($.Z,{as:"h1",children:n})}),(0,l.jsx)(K.Z,{children:t})]})}var te=n(52802),ne=n(48596),se=n(44996);function ae(e){return(0,l.jsx)("svg",{viewBox:"0 0 24 24",...e,children:(0,l.jsx)("path",{d:"M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",fill:"currentColor"})})}const ie={breadcrumbHomeIcon:"breadcrumbHomeIcon_YNFT"};function le(){const e=(0,se.Z)("/");return(0,l.jsx)("li",{className:"breadcrumbs__item",children:(0,l.jsx)(x.Z,{"aria-label":(0,u.I)({id:"theme.docs.breadcrumbs.home",message:"Home page",description:"The ARIA label for the home page in the breadcrumbs"}),className:"breadcrumbs__link",href:e,children:(0,l.jsx)(ae,{className:ie.breadcrumbHomeIcon})})})}const oe={breadcrumbsContainer:"breadcrumbsContainer_Z_bl"};function re(e){let{children:t,href:n,isLast:s}=e;const a="breadcrumbs__link";return s?(0,l.jsx)("span",{className:a,itemProp:"name",children:t}):n?(0,l.jsx)(x.Z,{className:a,href:n,itemProp:"item",children:(0,l.jsx)("span",{itemProp:"name",children:t})}):(0,l.jsx)("span",{className:a,children:t})}function de(e){let{children:t,active:n,index:s,addMicrodata:a}=e;return(0,l.jsxs)("li",{...a&&{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem"},className:(0,h.Z)("breadcrumbs__item",{"breadcrumbs__item--active":n}),children:[t,(0,l.jsx)("meta",{itemProp:"position",content:String(s+1)})]})}function ce(){const e=(0,te.s1)(),t=(0,ne.Ns)();return e?(0,l.jsx)("nav",{className:(0,h.Z)(f.k.docs.docBreadcrumbs,oe.breadcrumbsContainer),"aria-label":(0,u.I)({id:"theme.docs.breadcrumbs.navAriaLabel",message:"Breadcrumbs",description:"The ARIA label for the breadcrumbs"}),children:(0,l.jsxs)("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList",children:[t&&(0,l.jsx)(le,{}),e.map(((t,n)=>{const s=n===e.length-1,a="category"===t.type&&t.linkUnlisted?void 0:t.href;return(0,l.jsx)(de,{active:s,index:n,addMicrodata:!!a,children:(0,l.jsx)(re,{href:a,isLast:s,children:t.label})},n)}))]})}):null}var he=n(22212);const me={docItemContainer:"docItemContainer_Djhp",docItemCol:"docItemCol_VOVn"};function ue(e){let{children:t}=e;const n=function(){const{frontMatter:e,toc:t}=d(),n=(0,m.i)(),s=e.hide_table_of_contents,a=!s&&t.length>0;return{hidden:s,mobile:a?(0,l.jsx)(q,{}):void 0,desktop:!a||"desktop"!==n&&"ssr"!==n?void 0:(0,l.jsx)(Y,{})}}(),{metadata:{unlisted:s}}=d();return(0,l.jsxs)("div",{className:"row",children:[(0,l.jsxs)("div",{className:(0,h.Z)("col",!n.hidden&&me.docItemCol),children:[s&&(0,l.jsx)(he.Z,{}),(0,l.jsx)(T,{}),(0,l.jsxs)("div",{className:me.docItemContainer,children:[(0,l.jsxs)("article",{children:[(0,l.jsx)(ce,{}),(0,l.jsx)(L,{}),n.mobile,(0,l.jsx)(ee,{children:t}),(0,l.jsx)(D,{})]}),(0,l.jsx)(g,{})]})]}),n.desktop&&(0,l.jsx)("div",{className:"col col--3",children:n.desktop})]})}function xe(e){const t=`docs-doc-id-${e.content.metadata.id}`,n=e.content;return(0,l.jsx)(r,{content:e.content,children:(0,l.jsxs)(a.FG,{className:t,children:[(0,l.jsx)(c,{}),(0,l.jsx)(ue,{children:(0,l.jsx)(n,{})})]})})}},13008:(e,t,n)=>{n.d(t,{Z:()=>o});n(67294);var s=n(90512),a=n(33692);const i={tag:"tag_zVej",tagRegular:"tagRegular_sFm0",tagWithCount:"tagWithCount_h2kH"};var l=n(85893);function o(e){let{permalink:t,label:n,count:o}=e;return(0,l.jsxs)(a.Z,{href:t,className:(0,s.Z)(i.tag,o?i.tagWithCount:i.tagRegular),children:[n,o&&(0,l.jsx)("span",{children:o})]})}},964:(e,t,n)=>{n.d(t,{Z:()=>h});n(67294);var s=n(90801),a=n(85893);const i={backgroundColor:"white",border:"1px solid #ddd",boxShadow:"0 2px 5px rgba(0, 0, 0, 0.1)",padding:"1em",margin:".6em",borderRadius:"8px",fontFamily:"sans-serif",display:"flex",transition:"box-shadow 0.3s ease"},l={width:"20%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},o={height:"auto",maxWidth:"100%",marginBottom:"10px"},r={backgroundColor:"#057B5B",color:"white",padding:".5px 12px",borderRadius:"6px",textDecoration:"none",fontSize:"16px"},d={width:"80%",paddingLeft:"20px",fontSize:"17px",lineHeight:"1.5",fontWeight:"600",color:"deeppink"},c=()=>(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:i,className:"atfx-container",children:[(0,a.jsxs)("div",{style:l,children:[(0,a.jsx)("img",{src:"https://cdn.fendou.la/tuoss/ATFX.svg",alt:"ATFX Logo",style:o}),(0,a.jsx)("a",{href:"https://s.ifttt.fun/atfx",target:"_blank",rel:"noopener noreferrer",style:r,children:"\u5b98\u7f51\u5f00\u6237"})]}),(0,a.jsx)("div",{style:d,children:(0,a.jsx)("p",{children:"2014\u5e74\u6210\u7acb\uff0c\u603b\u90e8\u4f4d\u4e8e\u82f1\u56fd\u4f26\u6566\uff0cFCA\u76d1\u7ba1\uff0c\u63d0\u4f9b\u5916\u6c47\u3001\u8d35\u91d1\u5c5e\u3001\u539f\u6cb9\u3001\u80a1\u7968\u7b49\u8d85\u8fc7100\u79cd\u5dee\u4ef7\u5408\u7ea6\u4ea4\u6613\u4ea7\u54c1\uff0c\u94f6\u8054\u51fa\u5165\u91d1\u9ad8\u6548\u5b89\u5168\u6700\u9ad8\u6760\u6746400\u500d\uff0c\u9999\u6e2f\u529e\u4e8b\u5904\u670d\u52a1\u4e2d\u56fd\u5ba2\u6237\u3002"})})]}),(0,a.jsx)("style",{jsx:!0,children:"\n        @media (max-width: 767px) {\n          .atfx-container {\n            flex-direction: column;\n          }\n          .atfx-container > div:first-child {\n            margin-bottom: 1em;\n            width: 100% !important;\n          }\n          .atfx-container > div:first-child > img {\n            height: auto !important;\n            margin-right: 10px;\n          }\n          .atfx-container > div:first-child > a {\n            white-space: nowrap; \n            font-weight: bold;\n          }\n          .atfx-container > div:last-child {\n            width: 100% !important;\n          }\n        }\n      "})]}),h={...s.Z,Ads:c}},31498:(e,t,n)=>{n.d(t,{Z:()=>i});n(67294);var s=n(93743),a=n(85893);function i(e){return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(s.Z,{...e}),(0,a.jsx)("a",{target:"_blank",href:"https://s.ifttt.fun/atfx",rel:"noopener noreferrer",children:(0,a.jsx)("img",{style:{border:"1px solid #ddd",boxShadow:"0 2px 5px rgba(0, 0, 0, 0.1)",padding:"18px",borderRadius:"8px",background:"white",marginTop:"1.25em"},className:"size-full wp-image-24489 aligncenter",src:"https://cdn.fendou.la/bluehost/ATFX-ads.svg",alt:"ATFX\u4fa7\u8fb9\u680f\u5e7f\u544a"})}),(0,a.jsxs)("a",{href:"https://s.ifttt.fun/jsmt4",target:"_blank",rel:"noopener noreferrer",children:["\u5609\u76db\u96c6\u56e2",(0,a.jsx)("svg",{width:"13.5",height:"13.5","aria-hidden":"true",viewBox:"0 0 24 24",className:"iconExternalLink_nPIU",children:(0,a.jsx)("path",{fill:"currentColor",d:"M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"})})]})]})}}}]);