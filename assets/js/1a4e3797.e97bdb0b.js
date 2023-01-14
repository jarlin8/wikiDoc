"use strict";(self.webpackChunkjoeleon_wikidoc=self.webpackChunkjoeleon_wikidoc||[]).push([[7920],{42027:(e,t,n)=>{n.r(t),n.d(t,{default:()=>x});var r=n(67294),a=n(52263),l=n(68765),s=n(35742),c=n(39960),o=n(95999);const u=["zero","one","two","few","many","other"];function m(e){return u.filter((t=>e.includes(t)))}const i={locale:"en",pluralForms:m(["one","other"]),select:e=>1===e?"one":"other"};function h(){const{i18n:{currentLocale:e}}=(0,a.Z)();return(0,r.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:m(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),i}}),[e])}function p(){const e=h();return{selectMessage:(t,n)=>function(e,t,n){const r=e.split("|");if(1===r.length)return r[0];r.length>n.pluralForms.length&&console.error(`For locale=${n.locale}, a maximum of ${n.pluralForms.length} plural forms are expected (${n.pluralForms.join(",")}), but the message contains ${r.length}: ${e}`);const a=n.select(t),l=n.pluralForms.indexOf(a);return r[Math.min(l,r.length-1)]}(n,t,e)}}var g=n(16550),d=n(10412);const f=function(){const e=(0,g.k6)(),t=(0,g.TH)(),{siteConfig:{baseUrl:n}}=(0,a.Z)(),r=d.Z.canUseDOM?new URLSearchParams(t.search):null,l=r?.get("q")||"",s=r?.get("ctx")||"",c=r?.get("version")||"",o=e=>{const n=new URLSearchParams(t.search);return e?n.set("q",e):n.delete("q"),n};return{searchValue:l,searchContext:s,searchVersion:c,updateSearchPath:t=>{const n=o(t);e.replace({search:n.toString()})},generateSearchPageLink:e=>{const t=o(e);return`${n}search?${t.toString()}`}}};var E=n(90022),y=n(98202),S=n(82539),w=n(10726),b=n(91073),I=n(80311),P=n(73926),k=n(61029);const v="searchQueryInput_CFBF",F="searchResultItem_U687",R="searchResultItemPath_uIbk",_="searchResultItemSummary_oZHr";function C(){const{siteConfig:{baseUrl:e}}=(0,a.Z)(),{selectMessage:t}=p(),{searchValue:n,searchContext:l,searchVersion:c,updateSearchPath:u}=f(),[m,i]=(0,r.useState)(n),[h,g]=(0,r.useState)(),[d,S]=(0,r.useState)(),w=`${e}${c}`,b=(0,r.useMemo)((()=>m?(0,o.I)({id:"theme.SearchPage.existingResultsTitle",message:'Search results for "{query}"',description:"The search page title for non-empty query"},{query:m}):(0,o.I)({id:"theme.SearchPage.emptyResultsTitle",message:"Search the documentation",description:"The search page title for empty query"})),[m]);(0,r.useEffect)((()=>{u(m),h&&(m?h(m,(e=>{S(e)})):S(void 0))}),[m,h]);const P=(0,r.useCallback)((e=>{i(e.target.value)}),[]);return(0,r.useEffect)((()=>{n&&n!==m&&i(n)}),[n]),(0,r.useEffect)((()=>{!async function(){const{wrappedIndexes:e,zhDictionary:t}=await(0,E.w)(w,l);g((()=>(0,y.v)(e,t,100)))}()}),[l,w]),r.createElement(r.Fragment,null,r.createElement(s.Z,null,r.createElement("meta",{property:"robots",content:"noindex, follow"}),r.createElement("title",null,b)),r.createElement("div",{className:"container margin-vert--lg"},r.createElement("h1",null,b),r.createElement("input",{type:"search",name:"q",className:v,"aria-label":"Search",onChange:P,value:m,autoComplete:"off",autoFocus:!0}),!h&&m&&r.createElement("div",null,r.createElement(I.Z,null)),d&&(d.length>0?r.createElement("p",null,t(d.length,(0,o.I)({id:"theme.SearchPage.documentsFound.plurals",message:"1 document found|{count} documents found",description:'Pluralized label for "{count} documents found". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)'},{count:d.length}))):r.createElement("p",null,(0,o.I)({id:"theme.SearchPage.noResultsText",message:"No documents were found",description:"The paragraph for empty search result"}))),r.createElement("section",null,d&&d.map((e=>r.createElement($,{key:e.document.i,searchResult:e}))))))}function $(e){let{searchResult:{document:t,type:n,page:a,tokens:l,metadata:s}}=e;const o=0===n,u=2===n,m=(o?t.b:a.b).slice(),i=u?t.s:t.t;o||m.push(a.t);let h="";if(k.vc&&l.length>0){const e=new URLSearchParams;for(const t of l)e.append("_highlight",t);h=`?${e.toString()}`}return r.createElement("article",{className:F},r.createElement("h2",null,r.createElement(c.Z,{to:t.u+h+(t.h||""),dangerouslySetInnerHTML:{__html:u?(0,S.C)(i,l):(0,w.o)(i,(0,b.m)(s,"t"),l,100)}})),m.length>0&&r.createElement("p",{className:R},(0,P.e)(m)),u&&r.createElement("p",{className:_,dangerouslySetInnerHTML:{__html:(0,w.o)(t.t,(0,b.m)(s,"t"),l,100)}}))}const x=function(){return r.createElement(l.Z,null,r.createElement(C,null))}}}]);