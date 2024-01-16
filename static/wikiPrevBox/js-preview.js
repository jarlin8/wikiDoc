/* success^t^ &&&*/
"use strict";{document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend",'<link rel="stylesheet" type="text/css" href="https://niu.fendou.la/wikiPrevBox/wikiPreviewBox.min.css">'),document.body.insertAdjacentHTML("afterbegin",'<article id="wikiPreviewBox" class="wikiPreviewBox"></article>');let showNoImages=1,wikiBoxWidth=300,textDirection=document.dir||"";void 0!==document.currentScript.dataset.wikipreview&&(showNoImages=!!document.currentScript.dataset.wikipreview.includes("noimages"),wikiBoxWidth=Math.min(Math.max(parseInt(document.currentScript.dataset.wikipreview.replace(/\D/g,"")||300),200),400));let wikiBoxMaxLenght=280,whatArticle="",wikiArticleUrl="",wikiLang="",wikiTermPos,wikiTerm,wikiPreviewBox=document.getElementById("wikiPreviewBox");wikiPreviewBox.style.width=wikiBoxWidth+"px",wikiPreviewBox.addEventListener("click",hideWikiBox),wikiPreviewBox.addEventListener("mouseover",showWikiBox),wikiPreviewBox.addEventListener("mouseout",hideWikiBox);let allWikiLinks=document.querySelectorAll("[href*='wikipedia.org']:not([href*='#nopreview'])"),allWithNopreview=document.querySelectorAll("[href*='#nopreview']");for(let z=0;z<allWithNopreview.length;z++)allWithNopreview[z].href=allWithNopreview[z].href.replace("#nopreview","");for(let i=0;i<allWikiLinks.length;i++)allWikiLinks[i].classList.add("wikiLink"),"rtl"===textDirection&&allWikiLinks[i].classList.add("wikiLink_rtl"),allWikiLinks[i].addEventListener("mouseover",e=>{wikiTerm=e.currentTarget,wikiArticleUrl=wikiTerm.href,whatArticle=""+wikiArticleUrl.split("/").pop(),wikiLang=wikiArticleUrl.split(".")[0].split("//")[1],wikiTermPos=wikiTerm.getBoundingClientRect();let wikiBoxLeft=wikiTermPos.left-wikiBoxWidth/2+(wikiTermPos.right-wikiTermPos.left)/2;wikiBoxLeft<0&&(wikiBoxLeft=10);let winInnerWidth=window.innerWidth;winInnerWidth<wikiBoxWidth?wikiBoxLeft=winInnerWidth-wikiBoxWidth+(wikiBoxWidth-winInnerWidth):wikiBoxLeft+wikiBoxWidth>winInnerWidth&&(wikiBoxLeft=winInnerWidth-wikiBoxWidth-20),wikiPreviewBox.style.left=wikiBoxLeft+"px",getWikiPreviewData(whatArticle,wikiLang)},!1),allWikiLinks[i].addEventListener("click",event=>{event.preventDefault()}),allWikiLinks[i].addEventListener("mouseout",hideWikiBox),document.addEventListener('DOMContentLoaded',event=>{event.preventDefault()});function getWikiPreviewData(whatArticle,whatLang="en"){let showThisImgAnyway=(whatArticle=(whatArticle.charAt(0).toUpperCase()+whatArticle.slice(1)).replace(/ /g,"_")).includes("#showimage");showThisImgAnyway&&(whatArticle=whatArticle.replace("#showimage",""));let arrArticleSummary=[];navigator.onLine&&fetch("https://"+whatLang+".m.wikipedia.org/api/rest_v1/page/summary/"+whatArticle).then(response=>{response.status>=200&&response.status<=299&&response.json().then(wikiSummData=>{arrArticleSummary=wikiSummData.hasOwnProperty("thumbnail")&&!showNoImages||showThisImgAnyway?["<img height='"+wikiSummData.thumbnail.height+"' src='"+wikiSummData.thumbnail.source+"'/>",wikiSummData.extract_html,"https://"+whatLang+".wikipedia.org/wiki/"+whatArticle,wikiSummData.title]:["",wikiSummData.extract_html,"https://"+whatLang+".wikipedia.org/wiki/"+whatArticle,wikiSummData.title],createWikiBox(arrArticleSummary,wikiSummData.dir)})})}function createWikiBox(arrArticleSum,textDirection){let wikiBoxContent="";if(wikiBoxContent=arrArticleSum[0],arrArticleSum[1].length<=wikiBoxMaxLenght)wikiBoxContent+=arrArticleSum[1],"."==wikiBoxContent.slice(-1)&&(wikiBoxContent=wikiBoxContent.substring(0,wikiBoxContent.length-1));else{let lastClosingTag=arrArticleSum[1].substr(arrArticleSum[1].lastIndexOf("<"),arrArticleSum[1].length);wikiBoxContent+="</p>"===lastClosingTag?arrArticleSum[1].substring(0,wikiBoxMaxLenght-3):arrArticleSum[1].substring(0,wikiBoxMaxLenght-9),"."==wikiBoxContent.slice(-1)&&(wikiBoxContent=wikiBoxContent.substring(0,wikiBoxContent.length-1)),wikiBoxContent+="&nbsp;..."+lastClosingTag}wikiPreviewBox.innerHTML=wikiBoxContent;let wikiBoxfooter="<span class='wikiBoxfooter_"+textDirection+"'><a href='"+arrArticleSum[2]+"' target='_blank' rel='noopener'>"+arrArticleSum[3]+"</a> (wikipedia.org)</span><a href='" + arrArticleSum[2] + "' target='_blank' rel='noopener' title='维基百科链接' alt='去维基百科查看完整内容'><span class='wikiBoxLogo-w_"+textDirection+"'><img src='https://niu.fendou.la/wikiPrevBox/w.svg' height='30' width='35'></span></a>";wikiPreviewBox.insertAdjacentHTML("beforeend",wikiBoxfooter),wikiPreviewBox.getElementsByTagName("P")[0].setAttribute("lang",wikiLang),wikiPreviewBox.getElementsByTagName("P")[0].setAttribute("dir",textDirection),showWikiBox()}function showWikiBox(){let wikiPreviewBoxHeight=wikiPreviewBox.getBoundingClientRect().height||400,wikiTermPosBottom=wikiTermPos.bottom,visibleHeight=window.innerHeight;wikiTermPosBottom<wikiPreviewBoxHeight?(wikiPreviewBox.style.top=wikiTermPosBottom+window.scrollY+"px",wikiTermPosBottom+wikiPreviewBoxHeight>visibleHeight&&(wikiPreviewBox.style.top=window.scrollY+"px")):wikiPreviewBox.style.top=wikiTermPos.top+window.scrollY-wikiPreviewBox.getBoundingClientRect().height+"px",wikiPreviewBox.style.opacity=1,wikiPreviewBox.style.visibility="visible"}function hideWikiBox(){wikiTerm.matches(":hover")||(wikiPreviewBox.style.opacity=0,wikiPreviewBox.style.visibility="hidden")}}
{  //add an empty Linker-preview-box container, everything happens inside here 
    document.body.insertAdjacentHTML('afterbegin', '<article id="LinkerPreviewBox" class="LinkerPreviewBox"></article>');
    let LinkerBoxWidth = 300; //default preview box width
    let whichArticle = ""; //term to show (last part of the url to a Linkerpedia article)
    let LinkerArticleUrl = "", LinkerTermPos, LinkerTerm;
    let LinkerPreviewBox = document.getElementById("LinkerPreviewBox");
    LinkerPreviewBox.style.width = LinkerBoxWidth + "px";
    //add preview box events
    LinkerPreviewBox.addEventListener("click", hideLinkerBox);
    LinkerPreviewBox.addEventListener("mouseover", showLinkerBox);
    LinkerPreviewBox.addEventListener("mouseout", hideLinkerBox);
    //#endregion
    //#region Wikipedia links
    //get all link with class `.internal`
    let allLinkerLinks = document.querySelectorAll(".internal");
    //make all Wikipedia links ready (for getting data, pos. the preview box, rtl) 
    for (let i = 0; i < allLinkerLinks.length; i++) {        
        allLinkerLinks[i].classList.add('LinkerLink');
        allLinkerLinks[i].addEventListener("mouseover", (e) => {
            LinkerTerm = e.currentTarget;
            LinkerArticleUrl = LinkerTerm.href;
            whichArticle = "" + LinkerArticleUrl.split("/").pop();     //get term :: slug, ...
            //#region position "left<>right" of the wiki preview box
            LinkerTermPos = LinkerTerm.getBoundingClientRect();
            let LinkerBoxLeft = LinkerTermPos.left - (LinkerBoxWidth / 2) + ((LinkerTermPos.right - LinkerTermPos.left) / 2);
            if (LinkerBoxLeft < 0) { LinkerBoxLeft = 10; } //do not pos. it out of the left edge                    
            //fix "is a little outside if window.innerWidth < preview-box"
            let winInnerWidth = window.innerWidth; 
            if (winInnerWidth < LinkerBoxWidth) { LinkerBoxLeft = winInnerWidth - LinkerBoxWidth + (LinkerBoxWidth - winInnerWidth); }
            else {
                if ((LinkerBoxLeft + LinkerBoxWidth) > winInnerWidth) { LinkerBoxLeft = winInnerWidth - LinkerBoxWidth - 20; } //do not pos out right side
            }
            LinkerPreviewBox.style.left = LinkerBoxLeft + "px"; //maybe move this (all, not on a monday) to the function in the bottom
            //#endregion
            getLinkerPreviewData(LinkerArticleUrl);

        }, false);
        allLinkerLinks[i].addEventListener("mouseout", hideLinkerBox);
    }
    //#endregion
    //#region get data from wikipedia
    function getLinkerPreviewData(LinkerArticleUrl) {   
        let arrArticleSummary = [];
        //fetch/get data for the preview box
        if (navigator.onLine) { //android webview could(?) show online despite of offline, 11/2021 (bug) 
            fetch(LinkerArticleUrl)
                .then(response => {                    
                    if (response.status >= 200 && response.status <= 299) {
                        response.text().then(function (html){
                          var parser = new DOMParser();
                          var doc = parser.parseFromString(html, 'text/html');
                          var article = doc.querySelector('.markdown').innerHTML;
                          arrArticleSummary = [article, html.article];
                          createLinkerBox(arrArticleSummary);
                        })
                    }
                    else {/*network error/404, term not found (but there is still a(n "error") message: "GET https...wiki... 404" )*/ }
                }
                )
        }
        else { /* is not online, maybe use ononline */ }
    }
    //#endregion

    //#region create, hide, show preview-box
    function createLinkerBox(arrLinkerArticleSum) {
        let LinkerBoxContent = "";
        LinkerBoxContent = arrLinkerArticleSum[0]; //thumbnail if any
        LinkerPreviewBox.innerHTML = LinkerBoxContent;
        let LinkerBoxfooter = "<span class='wikiBoxfooter_'><a href='" + LinkerArticleUrl + "' target='_blank' rel='noopener'>原文链接</a></span>" +
        "<a href='" + LinkerArticleUrl + "' target='_blank' rel='noopener'" +
            "<span class='LinkerBoxLogo'><img src='https://niu.fendou.la/wikiPrevBox/starlink.svg'></span></a>";
        LinkerPreviewBox.insertAdjacentHTML('afterbegin', LinkerBoxfooter);   
        showLinkerBox();
    }
    function showLinkerBox() {
        let LinkerPreviewBoxHeight = LinkerPreviewBox.getBoundingClientRect().height || 400; //preview-box height
        let LinkerTermPosBottom = LinkerTermPos.bottom; //distance from the visible "top-edge" (clientY) to the bottom of the wikipedia-link
        let visibleHeight = window.innerHeight;

        if (LinkerTermPosBottom < LinkerPreviewBoxHeight) { //below <wiki-link>
            LinkerPreviewBox.style.top = LinkerTermPosBottom + window.scrollY + 'px';
            //avoid disappearing of the preview-box at the bottom edge in cases where the preview-box is higher than the visible space (e.g. portrait mode on mobile) 
            if (LinkerTermPosBottom + LinkerPreviewBoxHeight > visibleHeight) {
                LinkerPreviewBox.style.top = window.scrollY + 'px';
            }
        }
        else { //above
            LinkerPreviewBox.style.top = LinkerTermPos.top + window.scrollY - LinkerPreviewBox.getBoundingClientRect().height + 'px';
        }
        LinkerPreviewBox.style.opacity = 1;
        LinkerPreviewBox.style.visibility = 'visible';
    }
    function hideLinkerBox() {
        //avoid flickering, don't fade out-in if mouse leaves the preview-box but covers the <wiki-link>
        if (!LinkerTerm.matches(':hover')) {
            LinkerPreviewBox.style.opacity = 0;
            LinkerPreviewBox.style.visibility = 'hidden';
        }
    }
    //#endregion
}var links = document.getElementsByTagName('a');for (var i = 0; i < links.length; i++) {var url = links[i].href;if (url.indexOf('#') === -1 && url.indexOf('wikipedia.org') === -1) {links[i].addEventListener('click', function(event) {fetch(url).then(function(response) {location.reload();}).catch(function(error) {console.error(error);});});}}