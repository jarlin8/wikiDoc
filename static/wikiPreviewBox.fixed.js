/* WikiPreviewBox - Fixed for Docusaurus SPA compatibility */
/* 只修改了：1. 删除末尾的location.reload代码 2. 添加MutationObserver 3. 防止重复绑定 */
"use strict";

(function () {
    // 加载 CSS
    document.getElementsByTagName("head")[0].insertAdjacentHTML(
        "beforeend",
        '<link rel="stylesheet" type="text/css" href="https://niu.fendou.la/wikiPrevBox/wikiPreviewBox.min.css">'
    );

    // 创建预览框容器（只创建一次）
    if (!document.getElementById("wikiPreviewBox")) {
        document.body.insertAdjacentHTML("afterbegin", '<article id="wikiPreviewBox" class="wikiPreviewBox"></article>');
    }
    if (!document.getElementById("LinkerPreviewBox")) {
        document.body.insertAdjacentHTML("afterbegin", '<article id="LinkerPreviewBox" class="LinkerPreviewBox"></article>');
    }

    // ===============================
    // Wikipedia 链接预览 - 保持原有逻辑
    // ===============================
    let showNoImages = 1;
    let wikiBoxWidth = 300;
    let textDirection = document.dir || "";

    if (typeof document.currentScript !== 'undefined' && document.currentScript &&
        document.currentScript.dataset && document.currentScript.dataset.wikipreview !== undefined) {
        showNoImages = !!document.currentScript.dataset.wikipreview.includes("noimages");
        wikiBoxWidth = Math.min(Math.max(parseInt(document.currentScript.dataset.wikipreview.replace(/\D/g, "") || 300), 200), 400);
    }

    let wikiBoxMaxLenght = 280;
    let whatArticle = "";
    let wikiArticleUrl = "";
    let wikiLang = "";
    let wikiTermPos;
    let wikiTerm;
    let wikiPreviewBox = document.getElementById("wikiPreviewBox");

    wikiPreviewBox.style.width = wikiBoxWidth + "px";
    wikiPreviewBox.addEventListener("click", hideWikiBox);
    wikiPreviewBox.addEventListener("mouseover", showWikiBox);
    wikiPreviewBox.addEventListener("mouseout", hideWikiBox);

    function setupWikiLinks() {
        // 移除 #nopreview
        let allWithNopreview = document.querySelectorAll("[href*='#nopreview']");
        for (let z = 0; z < allWithNopreview.length; z++) {
            allWithNopreview[z].href = allWithNopreview[z].href.replace("#nopreview", "");
        }

        // 只选择未绑定的 Wikipedia 链接（保持原有选择器）
        let allWikiLinks = document.querySelectorAll("[href*='wikipedia.org']:not([href*='#nopreview']):not(.wikiLink-bound)");

        for (let i = 0; i < allWikiLinks.length; i++) {
            allWikiLinks[i].classList.add("wikiLink", "wikiLink-bound");
            if (textDirection === "rtl") {
                allWikiLinks[i].classList.add("wikiLink_rtl");
            }

            allWikiLinks[i].addEventListener("mouseover", function (e) {
                wikiTerm = e.currentTarget;
                wikiArticleUrl = wikiTerm.href;
                whatArticle = "" + wikiArticleUrl.split("/").pop();
                wikiLang = wikiArticleUrl.split(".")[0].split("//")[1];
                wikiTermPos = wikiTerm.getBoundingClientRect();

                let wikiBoxLeft = wikiTermPos.left - wikiBoxWidth / 2 + (wikiTermPos.right - wikiTermPos.left) / 2;
                if (wikiBoxLeft < 0) { wikiBoxLeft = 10; }
                let winInnerWidth = window.innerWidth;
                if (winInnerWidth < wikiBoxWidth) {
                    wikiBoxLeft = winInnerWidth - wikiBoxWidth + (wikiBoxWidth - winInnerWidth);
                } else if (wikiBoxLeft + wikiBoxWidth > winInnerWidth) {
                    wikiBoxLeft = winInnerWidth - wikiBoxWidth - 20;
                }
                wikiPreviewBox.style.left = wikiBoxLeft + "px";
                getWikiPreviewData(whatArticle, wikiLang);
            }, false);

            allWikiLinks[i].addEventListener("click", function (event) {
                event.preventDefault();
            });

            allWikiLinks[i].addEventListener("mouseout", hideWikiBox);
        }
    }

    function getWikiPreviewData(whatArticle, whatLang) {
        whatLang = whatLang || "en";
        whatArticle = (whatArticle.charAt(0).toUpperCase() + whatArticle.slice(1)).replace(/ /g, "_");
        let showThisImgAnyway = whatArticle.includes("#showimage");
        if (showThisImgAnyway) {
            whatArticle = whatArticle.replace("#showimage", "");
        }

        let arrArticleSummary = [];
        if (navigator.onLine) {
            fetch("https://" + whatLang + ".m.wikipedia.org/api/rest_v1/page/summary/" + whatArticle)
                .then(function (response) {
                    if (response.status >= 200 && response.status <= 299) {
                        response.json().then(function (wikiSummData) {
                            if (wikiSummData.hasOwnProperty("thumbnail") && !showNoImages || showThisImgAnyway) {
                                arrArticleSummary = [
                                    "<img height='" + wikiSummData.thumbnail.height + "' src='" + wikiSummData.thumbnail.source + "'/>",
                                    wikiSummData.extract_html,
                                    "https://" + whatLang + ".wikipedia.org/wiki/" + whatArticle,
                                    wikiSummData.title
                                ];
                            } else {
                                arrArticleSummary = [
                                    "",
                                    wikiSummData.extract_html,
                                    "https://" + whatLang + ".wikipedia.org/wiki/" + whatArticle,
                                    wikiSummData.title
                                ];
                            }
                            createWikiBox(arrArticleSummary, wikiSummData.dir);
                        });
                    }
                });
        }
    }

    function createWikiBox(arrArticleSum, textDir) {
        let wikiBoxContent = "";
        wikiBoxContent = arrArticleSum[0];
        if (arrArticleSum[1].length <= wikiBoxMaxLenght) {
            wikiBoxContent += arrArticleSum[1];
            if (wikiBoxContent.slice(-1) === ".") {
                wikiBoxContent = wikiBoxContent.substring(0, wikiBoxContent.length - 1);
            }
        } else {
            let lastClosingTag = arrArticleSum[1].substr(arrArticleSum[1].lastIndexOf("<"), arrArticleSum[1].length);
            if (lastClosingTag === "</p>") {
                wikiBoxContent += arrArticleSum[1].substring(0, wikiBoxMaxLenght - 3);
            } else {
                wikiBoxContent += arrArticleSum[1].substring(0, wikiBoxMaxLenght - 9);
            }
            if (wikiBoxContent.slice(-1) === ".") {
                wikiBoxContent = wikiBoxContent.substring(0, wikiBoxContent.length - 1);
            }
            wikiBoxContent += "&nbsp;..." + lastClosingTag;
        }

        wikiPreviewBox.innerHTML = wikiBoxContent;
        let wikiBoxfooter = "<span class='wikiBoxfooter_" + textDir + "'><a href='" + arrArticleSum[2] + "' target='_blank' rel='noopener'>" + arrArticleSum[3] + "</a> (wikipedia.org)</span><a href='" + arrArticleSum[2] + "' target='_blank' rel='noopener' title='维基百科链接' alt='去维基百科查看完整内容'><span class='wikiBoxLogo-w_" + textDir + "'><img src='https://niu.fendou.la/wikiPrevBox/w.svg' height='30' width='35'></span></a>";
        wikiPreviewBox.insertAdjacentHTML("beforeend", wikiBoxfooter);

        let pElement = wikiPreviewBox.getElementsByTagName("P")[0];
        if (pElement) {
            pElement.setAttribute("lang", wikiLang);
            pElement.setAttribute("dir", textDir);
        }
        showWikiBox();
    }

    function showWikiBox() {
        let wikiPreviewBoxHeight = wikiPreviewBox.getBoundingClientRect().height || 400;
        let wikiTermPosBottom = wikiTermPos.bottom;
        let visibleHeight = window.innerHeight;

        if (wikiTermPosBottom < wikiPreviewBoxHeight) {
            wikiPreviewBox.style.top = wikiTermPosBottom + window.scrollY + "px";
            if (wikiTermPosBottom + wikiPreviewBoxHeight > visibleHeight) {
                wikiPreviewBox.style.top = window.scrollY + "px";
            }
        } else {
            wikiPreviewBox.style.top = wikiTermPos.top + window.scrollY - wikiPreviewBox.getBoundingClientRect().height + "px";
        }
        wikiPreviewBox.style.opacity = 1;
        wikiPreviewBox.style.visibility = "visible";
    }

    function hideWikiBox() {
        if (wikiTerm && wikiTerm.matches(":hover")) return;
        if (wikiPreviewBox.matches(":hover")) return;
        wikiPreviewBox.style.opacity = 0;
        wikiPreviewBox.style.visibility = "hidden";
    }

    // ===============================
    // 内部链接预览 - 保持原有 .internal 选择器
    // ===============================
    let LinkerBoxWidth = 300;
    let whichArticle = "";
    let LinkerArticleUrl = "";
    let LinkerTermPos;
    let LinkerTerm;
    let LinkerPreviewBox = document.getElementById("LinkerPreviewBox");

    LinkerPreviewBox.addEventListener("click", hideLinkerBox);
    LinkerPreviewBox.addEventListener("mouseover", showLinkerBox);
    LinkerPreviewBox.addEventListener("mouseout", hideLinkerBox);

    function setupInternalLinks() {
        // 保持原有的 .internal 选择器，只添加防止重复绑定
        let allLinkerLinks = document.querySelectorAll(".internal:not(.LinkerLink-bound)");

        for (let i = 0; i < allLinkerLinks.length; i++) {
            allLinkerLinks[i].classList.add("LinkerLink", "LinkerLink-bound");

            allLinkerLinks[i].addEventListener("mouseover", function (e) {
                LinkerTerm = e.currentTarget;
                LinkerArticleUrl = LinkerTerm.href;
                whichArticle = "" + LinkerArticleUrl.split("/").pop();
                LinkerTermPos = LinkerTerm.getBoundingClientRect();

                let LinkerBoxLeft = LinkerTermPos.left - (LinkerBoxWidth / 2) + ((LinkerTermPos.right - LinkerTermPos.left) / 2);
                if (LinkerBoxLeft < 0) { LinkerBoxLeft = 10; }
                let winInnerWidth = window.innerWidth;
                if (winInnerWidth < LinkerBoxWidth) {
                    LinkerBoxLeft = winInnerWidth - LinkerBoxWidth + (LinkerBoxWidth - winInnerWidth);
                } else if ((LinkerBoxLeft + LinkerBoxWidth) > winInnerWidth) {
                    LinkerBoxLeft = winInnerWidth - LinkerBoxWidth - 20;
                }
                LinkerPreviewBox.style.left = LinkerBoxLeft + "px";
                getLinkerPreviewData(LinkerArticleUrl);
            }, false);

            allLinkerLinks[i].addEventListener("mouseout", hideLinkerBox);
        }
    }

    function getLinkerPreviewData(url) {
        let arrArticleSummary = [];
        if (navigator.onLine) {
            fetch(url)
                .then(function (response) {
                    if (response.status >= 200 && response.status <= 299) {
                        response.text().then(function (html) {
                            var parser = new DOMParser();
                            var doc = parser.parseFromString(html, 'text/html');
                            var articleEl = doc.querySelector('.markdown');
                            if (!articleEl) return;
                            var article = articleEl.innerHTML;
                            arrArticleSummary = [article, html.article];
                            createLinkerBox(arrArticleSummary);
                        });
                    }
                })
                .catch(function () { });
        }
    }

    function createLinkerBox(arrLinkerArticleSum) {
        let LinkerBoxContent = "";
        LinkerBoxContent = arrLinkerArticleSum[0];
        LinkerPreviewBox.innerHTML = LinkerBoxContent;

        let LinkerBoxfooter = "<span class='LinkerheadLink'><a href='" + LinkerArticleUrl + "' target='_blank' rel='noopener'></a></span>" +
            "<a href='" + LinkerArticleUrl + "' target='_blank' rel='noopener' title='新窗口打开'>" +
            "<span class='LinkerBoxLogo'><img src='https://niu.fendou.la/wikiPrevBox/starlink.svg'></span></a>";

        LinkerPreviewBox.insertAdjacentHTML('afterbegin', LinkerBoxfooter);
        showLinkerBox();
    }

    function showLinkerBox() {
        let LinkerPreviewBoxHeight = LinkerPreviewBox.getBoundingClientRect().height || 400;
        let LinkerTermPosBottom = LinkerTermPos.bottom;
        let visibleHeight = window.innerHeight;

        if (LinkerTermPosBottom < LinkerPreviewBoxHeight) {
            LinkerPreviewBox.style.top = LinkerTermPosBottom + window.scrollY + 'px';
            if (LinkerTermPosBottom + LinkerPreviewBoxHeight > visibleHeight) {
                LinkerPreviewBox.style.top = window.scrollY + 'px';
            }
        } else {
            LinkerPreviewBox.style.top = LinkerTermPos.top + window.scrollY - LinkerPreviewBox.getBoundingClientRect().height + 'px';
        }
        LinkerPreviewBox.style.opacity = 1;
        LinkerPreviewBox.style.visibility = 'visible';
    }

    function hideLinkerBox() {
        if (LinkerTerm && !LinkerTerm.matches(':hover')) {
            LinkerPreviewBox.style.opacity = 0;
            LinkerPreviewBox.style.visibility = 'hidden';
        }
    }

    // ===============================
    // 初始化和 SPA 兼容
    // ===============================
    function initAll() {
        setupWikiLinks();
        setupInternalLinks();
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // SPA 兼容：监听 DOM 变化
    var observer = new MutationObserver(function (mutations) {
        var shouldReinit = false;
        for (var i = 0; i < mutations.length; i++) {
            var mutation = mutations[i];
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (var j = 0; j < mutation.addedNodes.length; j++) {
                    var node = mutation.addedNodes[j];
                    if (node.nodeType === 1 && (node.tagName === 'ARTICLE' || node.tagName === 'MAIN' || (node.classList && node.classList.contains('markdown')))) {
                        shouldReinit = true;
                        break;
                    }
                }
            }
            if (shouldReinit) break;
        }
        if (shouldReinit) {
            setTimeout(initAll, 100);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 监听浏览器前进/后退
    window.addEventListener('popstate', function () {
        setTimeout(initAll, 200);
    });

    // 【已删除】原有末尾的 location.reload() 代码

})();
