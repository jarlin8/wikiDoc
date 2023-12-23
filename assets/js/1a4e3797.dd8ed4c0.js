"use strict";(self.webpackChunkwikidoc=self.webpackChunkwikidoc||[]).push([[97920],{88824:(e,t,r)=>{r.d(t,{c:()=>u});var a=r(67294),n=r(52263);const l=["zero","one","two","few","many","other"];function s(e){return l.filter((t=>e.includes(t)))}const c={locale:"en",pluralForms:s(["one","other"]),select:e=>1===e?"one":"other"};function o(){const{i18n:{currentLocale:e}}=(0,n.Z)();return(0,a.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:s(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),c}}),[e])}function u(){const e=o();return{selectMessage:(t,r)=>function(e,t,r){const a=e.split("|");if(1===a.length)return a[0];a.length>r.pluralForms.length&&console.error(`For locale=${r.locale}, a maximum of ${r.pluralForms.length} plural forms are expected (${r.pluralForms.join(",")}), but the message contains ${a.length}: ${e}`);const n=r.select(t),l=r.pluralForms.indexOf(n);return a[Math.min(l,a.length-1)]}(r,t,e)}}},51473:(e,t,r)=>{r.r(t),r.d(t,{default:()=>P});var a=r(67294),n=r(52263),l=r(65924),s=r(35742),c=r(39960),o=r(95999),u=r(88824),m=r(1728),h=r(16550),i=r(72389),p=r(61029);const d=function(){const e=(0,i.Z)(),t=(0,h.k6)(),r=(0,h.TH)(),{siteConfig:{baseUrl:a}}=(0,n.Z)(),l=e?new URLSearchParams(r.search):null,s=l?.get("q")||"",c=l?.get("ctx")||"",o=l?.get("version")||"",u=e=>{const t=new URLSearchParams(r.search);return e?t.set("q",e):t.delete("q"),t};return{searchValue:s,searchContext:c&&Array.isArray(p.Kc)&&p.Kc.some((e=>"string"==typeof e?e===c:e.path===c))?c:"",searchVersion:o,updateSearchPath:e=>{const r=u(e);t.replace({search:r.toString()})},updateSearchContext:e=>{const a=new URLSearchParams(r.search);a.set("ctx",e),t.replace({search:a.toString()})},generateSearchPageLink:e=>{const t=u(e);return`${a}search?${t.toString()}`}}};var g=r(90022),f=r(98202),y=r(82539),E=r(10726),S=r(91073),C=r(80311),I=r(73926);const x={searchContextInput:"searchContextInput_mXoe",searchQueryInput:"searchQueryInput_CFBF",searchResultItem:"searchResultItem_U687",searchResultItemPath:"searchResultItemPath_uIbk",searchResultItemSummary:"searchResultItemSummary_oZHr",searchQueryColumn:"searchQueryColumn_q7nx",searchContextColumn:"searchContextColumn_oWAF"};var w=r(50051);function v(){const{siteConfig:{baseUrl:e},i18n:{currentLocale:t}}=(0,n.Z)(),{selectMessage:r}=(0,u.c)(),{searchValue:l,searchContext:c,searchVersion:h,updateSearchPath:i,updateSearchContext:y}=d(),[E,S]=(0,a.useState)(l),[I,v]=(0,a.useState)(),[P,b]=(0,a.useState)(),_=`${e}${h}`,k=(0,a.useMemo)((()=>E?(0,o.I)({id:"theme.SearchPage.existingResultsTitle",message:'Search results for "{query}"',description:"The search page title for non-empty query"},{query:E}):(0,o.I)({id:"theme.SearchPage.emptyResultsTitle",message:"Search the documentation",description:"The search page title for empty query"})),[E]);(0,a.useEffect)((()=>{i(E),I&&(E?I(E,(e=>{b(e)})):b(void 0))}),[E,I]);const F=(0,a.useCallback)((e=>{S(e.target.value)}),[]);return(0,a.useEffect)((()=>{l&&l!==E&&S(l)}),[l]),(0,a.useEffect)((()=>{!async function(){const{wrappedIndexes:e,zhDictionary:t}=c||p.pQ?await(0,g.w)(_,c):{wrappedIndexes:[],zhDictionary:[]};v((()=>(0,f.v)(e,t,100)))}()}),[c,_]),a.createElement(a.Fragment,null,a.createElement(s.Z,null,a.createElement("meta",{property:"robots",content:"noindex, follow"}),a.createElement("title",null,k)),a.createElement("div",{className:"container margin-vert--lg"},a.createElement("h1",null,k),a.createElement("div",{className:"row"},a.createElement("div",{className:(0,m.Z)("col",{[x.searchQueryColumn]:Array.isArray(p.Kc),"col--9":Array.isArray(p.Kc),"col--12":!Array.isArray(p.Kc)})},a.createElement("input",{type:"search",name:"q",className:x.searchQueryInput,"aria-label":"Search",onChange:F,value:E,autoComplete:"off",autoFocus:!0})),Array.isArray(p.Kc)?a.createElement("div",{className:(0,m.Z)("col","col--3","padding-left--none",x.searchContextColumn)},a.createElement("select",{name:"search-context",className:x.searchContextInput,id:"context-selector",value:c,onChange:e=>y(e.target.value)},p.pQ&&a.createElement("option",{value:""},(0,o.I)({id:"theme.SearchPage.searchContext.everywhere",message:"everywhere"})),p.Kc.map((e=>{const{label:r,path:n}=(0,w._)(e,t);return a.createElement("option",{key:n,value:n},r)})))):null),!I&&E&&a.createElement("div",null,a.createElement(C.Z,null)),P&&(P.length>0?a.createElement("p",null,r(P.length,(0,o.I)({id:"theme.SearchPage.documentsFound.plurals",message:"1 document found|{count} documents found",description:'Pluralized label for "{count} documents found". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)'},{count:P.length}))):a.createElement("p",null,(0,o.I)({id:"theme.SearchPage.noResultsText",message:"No documents were found",description:"The paragraph for empty search result"}))),a.createElement("section",null,P&&P.map((e=>a.createElement(R,{key:e.document.i,searchResult:e}))))))}function R(e){let{searchResult:{document:t,type:r,page:n,tokens:l,metadata:s}}=e;const o=0===r,u=2===r,m=(o?t.b:n.b).slice(),h=u?t.s:t.t;o||m.push(n.t);let i="";if(p.vc&&l.length>0){const e=new URLSearchParams;for(const t of l)e.append("_highlight",t);i=`?${e.toString()}`}return a.createElement("article",{className:x.searchResultItem},a.createElement("h2",null,a.createElement(c.Z,{to:t.u+i+(t.h||""),dangerouslySetInnerHTML:{__html:u?(0,y.C)(h,l):(0,E.o)(h,(0,S.m)(s,"t"),l,100)}})),m.length>0&&a.createElement("p",{className:x.searchResultItemPath},(0,I.e)(m)),u&&a.createElement("p",{className:x.searchResultItemSummary,dangerouslySetInnerHTML:{__html:(0,E.o)(t.t,(0,S.m)(s,"t"),l,100)}}))}const P=function(){return a.createElement(l.Z,null,a.createElement(v,null))}}}]);