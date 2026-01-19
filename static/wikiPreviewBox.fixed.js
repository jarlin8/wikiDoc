/* WikiPreviewBox - Fixed for Docusaurus SPA compatibility */
"use strict";

(function () {
    // 加载 CSS
    document.getElementsByTagName("head")[0].insertAdjacentHTML(
        "beforeend",
        '<link rel="stylesheet" type="text/css" href="https://niu.fendou.la/wikiPrevBox/wikiPreviewBox.min.css">'
    );

    // 创建预览框容器
    document.body.insertAdjacentHTML(
        "afterbegin",
        '<article id="wikiPreviewBox" class="wikiPreviewBox"></article>'
    );
    document.body.insertAdjacentHTML(
        "afterbegin",
        '<article id="LinkerPreviewBox" class="LinkerPreviewBox"></article>'
    );

    // 配置参数
    let showNoImages = true;
    let wikiBoxWidth = 300;
    let wikiBoxMaxLength = 280;
    let textDirection = document.dir || "";

    if (document.currentScript && document.currentScript.dataset.wikipreview !== undefined) {
        showNoImages = !!document.currentScript.dataset.wikipreview.includes("noimages");
        wikiBoxWidth = Math.min(
            Math.max(parseInt(document.currentScript.dataset.wikipreview.replace(/\D/g, "") || 300), 200),
            400
        );
    }

    let wikiPreviewBox = document.getElementById("wikiPreviewBox");
    let LinkerPreviewBox = document.getElementById("LinkerPreviewBox");

    wikiPreviewBox.style.width = wikiBoxWidth + "px";
    LinkerPreviewBox.style.width = "300px";

    // Wikipedia 预览框事件
    wikiPreviewBox.addEventListener("click", function () { hideWikiBox(); });
    wikiPreviewBox.addEventListener("mouseover", function () { /* keep visible */ });
    wikiPreviewBox.addEventListener("mouseout", function () { hideWikiBox(); });

    // 内部链接预览框事件
    LinkerPreviewBox.addEventListener("click", function () { hideLinkerBox(); });
    LinkerPreviewBox.addEventListener("mouseover", function () { /* keep visible */ });
    LinkerPreviewBox.addEventListener("mouseout", function () { hideLinkerBox(); });

    let wikiTerm, wikiTermPos, wikiLang;
    let LinkerTerm, LinkerTermPos, LinkerArticleUrl;

    // ===============================
    // Wikipedia 链接预览功能
    // ===============================
    function setupWikiLinks() {
        // 移除 #nopreview 标记
        let allWithNopreview = document.querySelectorAll("[href*='#nopreview']");
        for (let z = 0; z < allWithNopreview.length; z++) {
            allWithNopreview[z].href = allWithNopreview[z].href.replace("#nopreview", "");
        }

        // 绑定 Wikipedia 链接事件 (只绑定未绑定的)
        let allWikiLinks = document.querySelectorAll(
            "[href*='wikipedia.org']:not([href*='#nopreview']):not(.wikiLink-bound)"
        );

        for (let i = 0; i < allWikiLinks.length; i++) {
            let link = allWikiLinks[i];
            link.classList.add("wikiLink", "wikiLink-bound");
            if (textDirection === "rtl") {
                link.classList.add("wikiLink_rtl");
            }

            link.addEventListener("mouseover", function (e) {
                wikiTerm = e.currentTarget;
                let wikiArticleUrl = wikiTerm.href;
                let whatArticle = wikiArticleUrl.split("/").pop();
                wikiLang = wikiArticleUrl.split(".")[0].split("//")[1];
                wikiTermPos = wikiTerm.getBoundingClientRect();

                let wikiBoxLeft = wikiTermPos.left - wikiBoxWidth / 2 + (wikiTermPos.right - wikiTermPos.left) / 2;
                if (wikiBoxLeft < 0) wikiBoxLeft = 10;
                let winInnerWidth = window.innerWidth;
                if (winInnerWidth < wikiBoxWidth) {
                    wikiBoxLeft = winInnerWidth - wikiBoxWidth + (wikiBoxWidth - winInnerWidth);
                } else if (wikiBoxLeft + wikiBoxWidth > winInnerWidth) {
                    wikiBoxLeft = winInnerWidth - wikiBoxWidth - 20;
                }
                wikiPreviewBox.style.left = wikiBoxLeft + "px";
                getWikiPreviewData(whatArticle, wikiLang);
            });

            link.addEventListener("mouseout", function () {
                setTimeout(function () { hideWikiBox(); }, 100);
            });
        }
    }

    function getWikiPreviewData(whatArticle, whatLang) {
        whatLang = whatLang || "en";
        whatArticle = (whatArticle.charAt(0).toUpperCase() + whatArticle.slice(1)).replace(/ /g, "_");
        let showThisImgAnyway = whatArticle.includes("#showimage");
        if (showThisImgAnyway) {
            whatArticle = whatArticle.replace("#showimage", "");
        }

        if (navigator.onLine) {
            fetch("https://" + whatLang + ".m.wikipedia.org/api/rest_v1/page/summary/" + whatArticle)
                .then(function (response) {
                    if (response.status >= 200 && response.status <= 299) {
                        return response.json();
                    }
                })
                .then(function (wikiSummData) {
                    if (!wikiSummData) return;
                    let arrArticleSummary;
                    if ((wikiSummData.hasOwnProperty("thumbnail") && !showNoImages) || showThisImgAnyway) {
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
                })
                .catch(function () { });
        }
    }

    function createWikiBox(arrArticleSum, textDir) {
        let wikiBoxContent = arrArticleSum[0];
        if (arrArticleSum[1].length <= wikiBoxMaxLength) {
            wikiBoxContent += arrArticleSum[1];
            if (wikiBoxContent.slice(-1) === ".") {
                wikiBoxContent = wikiBoxContent.substring(0, wikiBoxContent.length - 1);
            }
        } else {
            let lastClosingTag = arrArticleSum[1].substr(arrArticleSum[1].lastIndexOf("<"), arrArticleSum[1].length);
            if (lastClosingTag === "</p>") {
                wikiBoxContent += arrArticleSum[1].substring(0, wikiBoxMaxLength - 3);
            } else {
                wikiBoxContent += arrArticleSum[1].substring(0, wikiBoxMaxLength - 9);
            }
            if (wikiBoxContent.slice(-1) === ".") {
                wikiBoxContent = wikiBoxContent.substring(0, wikiBoxContent.length - 1);
            }
            wikiBoxContent += "&nbsp;..." + lastClosingTag;
        }

        wikiPreviewBox.innerHTML = wikiBoxContent;
        let wikiBoxfooter =
            "<span class='wikiBoxfooter_" + textDir + "'><a href='" + arrArticleSum[2] + "' target='_blank' rel='noopener'>" +
            arrArticleSum[3] + "</a> (wikipedia.org)</span>" +
            "<a href='" + arrArticleSum[2] + "' target='_blank' rel='noopener' title='维基百科链接'>" +
            "<span class='wikiBoxLogo-w_" + textDir + "'><img src='https://niu.fendou.la/wikiPrevBox/w.svg' height='30' width='35'></span></a>";

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
    // 内部链接预览功能 (Docusaurus 兼容)
    // ===============================
    function setupInternalLinks() {
        // Docusaurus 内部链接选择器 (修复：不再使用 .internal)
        let allLinkerLinks = document.querySelectorAll(
            '.markdown a[href^="/"]:not([href*="://"]):not(.LinkerLink-bound), ' +
            'article a[href^="/"]:not([href*="://"]):not(.LinkerLink-bound), ' +
            'a.internal:not(.LinkerLink-bound)'
        );

        for (let i = 0; i < allLinkerLinks.length; i++) {
            let link = allLinkerLinks[i];
            let href = link.getAttribute("href");

            // 排除锚点链接和外部链接
            if (!href || href.startsWith("#") || href.includes("://")) continue;

            link.classList.add("LinkerLink", "LinkerLink-bound");

            link.addEventListener("mouseover", function (e) {
                LinkerTerm = e.currentTarget;
                LinkerArticleUrl = LinkerTerm.href;
                LinkerTermPos = LinkerTerm.getBoundingClientRect();

                let LinkerBoxWidth = 300;
                let LinkerBoxLeft = LinkerTermPos.left - LinkerBoxWidth / 2 + (LinkerTermPos.right - LinkerTermPos.left) / 2;
                if (LinkerBoxLeft < 0) LinkerBoxLeft = 10;
                let winInnerWidth = window.innerWidth;
                if (winInnerWidth < LinkerBoxWidth) {
                    LinkerBoxLeft = winInnerWidth - LinkerBoxWidth + (LinkerBoxWidth - winInnerWidth);
                } else if (LinkerBoxLeft + LinkerBoxWidth > winInnerWidth) {
                    LinkerBoxLeft = winInnerWidth - LinkerBoxWidth - 20;
                }
                LinkerPreviewBox.style.left = LinkerBoxLeft + "px";
                getLinkerPreviewData(LinkerArticleUrl);
            });

            link.addEventListener("mouseout", function () {
                setTimeout(function () { hideLinkerBox(); }, 100);
            });
        }
    }

    function getLinkerPreviewData(url) {
        if (!navigator.onLine) return;

        fetch(url)
            .then(function (response) {
                if (response.status >= 200 && response.status <= 299) {
                    return response.text();
                }
            })
            .then(function (html) {
                if (!html) return;
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, "text/html");
                let article = doc.querySelector(".markdown");
                if (!article) return;

                let title = doc.querySelector("h1");
                let titleText = title ? title.textContent : "";

                // 限制内容长度
                let content = article.innerHTML;
                let tempDiv = document.createElement("div");
                tempDiv.innerHTML = content;
                let textContent = tempDiv.textContent || "";
                if (textContent.length > 500) {
                    content = "<p>" + textContent.substring(0, 500) + "...</p>";
                }

                createLinkerBox([content, titleText]);
            })
            .catch(function () { });
    }

    function createLinkerBox(arrLinkerArticleSum) {
        let LinkerBoxContent = arrLinkerArticleSum[0];
        LinkerPreviewBox.innerHTML = LinkerBoxContent;

        let LinkerBoxfooter =
            "<span class='LinkerheadLink'><a href='" + LinkerArticleUrl + "' target='_blank' rel='noopener'>" +
            (arrLinkerArticleSum[1] || "") + "</a></span>" +
            "<a href='" + LinkerArticleUrl + "' target='_blank' rel='noopener' title='新窗口打开'>" +
            "<span class='LinkerBoxLogo'><img src='https://niu.fendou.la/wikiPrevBox/starlink.svg'></span></a>";

        LinkerPreviewBox.insertAdjacentHTML("afterbegin", LinkerBoxfooter);
        showLinkerBox();
    }

    function showLinkerBox() {
        let LinkerPreviewBoxHeight = LinkerPreviewBox.getBoundingClientRect().height || 400;
        let LinkerTermPosBottom = LinkerTermPos.bottom;
        let visibleHeight = window.innerHeight;

        if (LinkerTermPosBottom < LinkerPreviewBoxHeight) {
            LinkerPreviewBox.style.top = LinkerTermPosBottom + window.scrollY + "px";
            if (LinkerTermPosBottom + LinkerPreviewBoxHeight > visibleHeight) {
                LinkerPreviewBox.style.top = window.scrollY + "px";
            }
        } else {
            LinkerPreviewBox.style.top = LinkerTermPos.top + window.scrollY - LinkerPreviewBox.getBoundingClientRect().height + "px";
        }
        LinkerPreviewBox.style.opacity = 1;
        LinkerPreviewBox.style.visibility = "visible";
    }

    function hideLinkerBox() {
        if (LinkerTerm && LinkerTerm.matches(":hover")) return;
        if (LinkerPreviewBox.matches(":hover")) return;
        LinkerPreviewBox.style.opacity = 0;
        LinkerPreviewBox.style.visibility = "hidden";
    }

    // ===============================
    // SPA 兼容：使用 MutationObserver 监听 DOM 变化
    // ===============================
    function initAll() {
        setupWikiLinks();
        setupInternalLinks();
    }

    // 初始化
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }

    // 监听 Docusaurus SPA 路由变化 (DOM 变化)
    let observer = new MutationObserver(function (mutations) {
        let shouldReinit = false;
        for (let mutation of mutations) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.tagName === "ARTICLE" || node.tagName === "MAIN" || node.classList && node.classList.contains("markdown"))) {
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

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听 popstate (浏览器前进/后退)
    window.addEventListener("popstate", function () {
        setTimeout(initAll, 200);
    });

    // 【已删除】原有的点击刷新页面代码 - 这是导致问题的根源！
    // 不要给所有链接添加 click 事件来 fetch 和 reload

})();
