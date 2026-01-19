/* WikiPreviewBox - Fixed for Docusaurus SPA compatibility */
/* 修复：1. 删除location.reload 2. 添加MutationObserver 3. 延迟执行避免React hydration错误 */
"use strict";

(function () {
    // 延迟执行，等待 React hydration 完成
    function waitForHydration(callback) {
        // 等待一段时间让 React 完成 hydration
        if (document.readyState === 'complete') {
            setTimeout(callback, 500);
        } else {
            window.addEventListener('load', function () {
                setTimeout(callback, 500);
            });
        }
    }

    waitForHydration(function () {
        init();
    });

    function init() {
        // 加载 CSS（只加载一次）
        if (!document.querySelector('link[href*="wikiPreviewBox.min.css"]')) {
            document.getElementsByTagName("head")[0].insertAdjacentHTML(
                "beforeend",
                '<link rel="stylesheet" type="text/css" href="https://niu.fendou.la/wikiPrevBox/wikiPreviewBox.min.css">'
            );
        }

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
        var showNoImages = 1;
        var wikiBoxWidth = 300;
        var textDirection = document.dir || "";

        var wikiBoxMaxLenght = 280;
        var whatArticle = "";
        var wikiArticleUrl = "";
        var wikiLang = "";
        var wikiTermPos;
        var wikiTerm;
        var wikiPreviewBox = document.getElementById("wikiPreviewBox");

        if (!wikiPreviewBox) return;

        wikiPreviewBox.style.width = wikiBoxWidth + "px";

        // 移除旧事件监听器（避免重复绑定）
        wikiPreviewBox.onclick = function () { hideWikiBox(); };
        wikiPreviewBox.onmouseover = function () { /* keep visible */ };
        wikiPreviewBox.onmouseout = function () { hideWikiBox(); };

        function setupWikiLinks() {
            // 移除 #nopreview
            var allWithNopreview = document.querySelectorAll("[href*='#nopreview']");
            for (var z = 0; z < allWithNopreview.length; z++) {
                allWithNopreview[z].href = allWithNopreview[z].href.replace("#nopreview", "");
            }

            // 只选择未绑定的 Wikipedia 链接
            var allWikiLinks = document.querySelectorAll("[href*='wikipedia.org']:not([href*='#nopreview']):not(.wikiLink-bound)");

            for (var i = 0; i < allWikiLinks.length; i++) {
                allWikiLinks[i].classList.add("wikiLink", "wikiLink-bound");
                if (textDirection === "rtl") {
                    allWikiLinks[i].classList.add("wikiLink_rtl");
                }

                (function (link) {
                    link.addEventListener("mouseover", function (e) {
                        wikiTerm = e.currentTarget;
                        wikiArticleUrl = wikiTerm.href;
                        whatArticle = "" + wikiArticleUrl.split("/").pop();
                        wikiLang = wikiArticleUrl.split(".")[0].split("//")[1];
                        wikiTermPos = wikiTerm.getBoundingClientRect();

                        var wikiBoxLeft = wikiTermPos.left - wikiBoxWidth / 2 + (wikiTermPos.right - wikiTermPos.left) / 2;
                        if (wikiBoxLeft < 0) { wikiBoxLeft = 10; }
                        var winInnerWidth = window.innerWidth;
                        if (winInnerWidth < wikiBoxWidth) {
                            wikiBoxLeft = winInnerWidth - wikiBoxWidth + (wikiBoxWidth - winInnerWidth);
                        } else if (wikiBoxLeft + wikiBoxWidth > winInnerWidth) {
                            wikiBoxLeft = winInnerWidth - wikiBoxWidth - 20;
                        }
                        wikiPreviewBox.style.left = wikiBoxLeft + "px";
                        getWikiPreviewData(whatArticle, wikiLang);
                    }, false);

                    link.addEventListener("click", function (event) {
                        event.preventDefault();
                    });

                    link.addEventListener("mouseout", function () {
                        hideWikiBox();
                    });
                })(allWikiLinks[i]);
            }
        }

        function getWikiPreviewData(article, lang) {
            lang = lang || "en";
            article = (article.charAt(0).toUpperCase() + article.slice(1)).replace(/ /g, "_");
            var showThisImgAnyway = article.includes("#showimage");
            if (showThisImgAnyway) {
                article = article.replace("#showimage", "");
            }

            if (navigator.onLine) {
                fetch("https://" + lang + ".m.wikipedia.org/api/rest_v1/page/summary/" + article)
                    .then(function (response) {
                        if (response.status >= 200 && response.status <= 299) {
                            return response.json();
                        }
                    })
                    .then(function (wikiSummData) {
                        if (!wikiSummData) return;
                        var arrArticleSummary;
                        if (wikiSummData.hasOwnProperty("thumbnail") && !showNoImages || showThisImgAnyway) {
                            arrArticleSummary = [
                                "<img height='" + wikiSummData.thumbnail.height + "' src='" + wikiSummData.thumbnail.source + "'/>",
                                wikiSummData.extract_html,
                                "https://" + lang + ".wikipedia.org/wiki/" + article,
                                wikiSummData.title
                            ];
                        } else {
                            arrArticleSummary = [
                                "",
                                wikiSummData.extract_html,
                                "https://" + lang + ".wikipedia.org/wiki/" + article,
                                wikiSummData.title
                            ];
                        }
                        createWikiBox(arrArticleSummary, wikiSummData.dir);
                    })
                    .catch(function () { });
            }
        }

        function createWikiBox(arrArticleSum, textDir) {
            var wikiBoxContent = "";
            wikiBoxContent = arrArticleSum[0];
            if (arrArticleSum[1].length <= wikiBoxMaxLenght) {
                wikiBoxContent += arrArticleSum[1];
                if (wikiBoxContent.slice(-1) === ".") {
                    wikiBoxContent = wikiBoxContent.substring(0, wikiBoxContent.length - 1);
                }
            } else {
                var lastClosingTag = arrArticleSum[1].substr(arrArticleSum[1].lastIndexOf("<"), arrArticleSum[1].length);
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
            var wikiBoxfooter = "<span class='wikiBoxfooter_" + textDir + "'><a href='" + arrArticleSum[2] + "' target='_blank' rel='noopener'>" + arrArticleSum[3] + "</a> (wikipedia.org)</span><a href='" + arrArticleSum[2] + "' target='_blank' rel='noopener' title='维基百科链接' alt='去维基百科查看完整内容'><span class='wikiBoxLogo-w_" + textDir + "'><img src='https://niu.fendou.la/wikiPrevBox/w.svg' height='30' width='35'></span></a>";
            wikiPreviewBox.insertAdjacentHTML("beforeend", wikiBoxfooter);

            var pElement = wikiPreviewBox.getElementsByTagName("P")[0];
            if (pElement) {
                pElement.setAttribute("lang", wikiLang);
                pElement.setAttribute("dir", textDir);
            }
            showWikiBox();
        }

        function showWikiBox() {
            if (!wikiTermPos) return;
            var wikiPreviewBoxHeight = wikiPreviewBox.getBoundingClientRect().height || 400;
            var wikiTermPosBottom = wikiTermPos.bottom;
            var visibleHeight = window.innerHeight;

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
            if (wikiPreviewBox && wikiPreviewBox.matches(":hover")) return;
            wikiPreviewBox.style.opacity = 0;
            wikiPreviewBox.style.visibility = "hidden";
        }

        // ===============================
        // 内部链接预览 - 保持原有 .internal 选择器
        // ===============================
        var LinkerBoxWidth = 300;
        var whichArticle = "";
        var LinkerArticleUrl = "";
        var LinkerTermPos;
        var LinkerTerm;
        var LinkerPreviewBox = document.getElementById("LinkerPreviewBox");

        if (!LinkerPreviewBox) return;

        LinkerPreviewBox.onclick = function () { hideLinkerBox(); };
        LinkerPreviewBox.onmouseover = function () { /* keep visible */ };
        LinkerPreviewBox.onmouseout = function () { hideLinkerBox(); };

        function setupInternalLinks() {
            // 保持原有的 .internal 选择器
            var allLinkerLinks = document.querySelectorAll(".internal:not(.LinkerLink-bound)");

            for (var i = 0; i < allLinkerLinks.length; i++) {
                allLinkerLinks[i].classList.add("LinkerLink", "LinkerLink-bound");

                (function (link) {
                    link.addEventListener("mouseover", function (e) {
                        LinkerTerm = e.currentTarget;
                        LinkerArticleUrl = LinkerTerm.href;
                        whichArticle = "" + LinkerArticleUrl.split("/").pop();
                        LinkerTermPos = LinkerTerm.getBoundingClientRect();

                        var LinkerBoxLeft = LinkerTermPos.left - (LinkerBoxWidth / 2) + ((LinkerTermPos.right - LinkerTermPos.left) / 2);
                        if (LinkerBoxLeft < 0) { LinkerBoxLeft = 10; }
                        var winInnerWidth = window.innerWidth;
                        if (winInnerWidth < LinkerBoxWidth) {
                            LinkerBoxLeft = winInnerWidth - LinkerBoxWidth + (LinkerBoxWidth - winInnerWidth);
                        } else if ((LinkerBoxLeft + LinkerBoxWidth) > winInnerWidth) {
                            LinkerBoxLeft = winInnerWidth - LinkerBoxWidth - 20;
                        }
                        LinkerPreviewBox.style.left = LinkerBoxLeft + "px";
                        getLinkerPreviewData(LinkerArticleUrl);
                    }, false);

                    link.addEventListener("mouseout", function () {
                        hideLinkerBox();
                    });
                })(allLinkerLinks[i]);
            }
        }

        function getLinkerPreviewData(url) {
            if (navigator.onLine) {
                fetch(url)
                    .then(function (response) {
                        if (response.status >= 200 && response.status <= 299) {
                            return response.text();
                        }
                    })
                    .then(function (html) {
                        if (!html) return;
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(html, 'text/html');
                        var articleEl = doc.querySelector('.markdown');
                        if (!articleEl) return;
                        var article = articleEl.innerHTML;
                        createLinkerBox([article, html.article]);
                    })
                    .catch(function () { });
            }
        }

        function createLinkerBox(arrLinkerArticleSum) {
            var LinkerBoxContent = "";
            LinkerBoxContent = arrLinkerArticleSum[0];
            LinkerPreviewBox.innerHTML = LinkerBoxContent;

            var LinkerBoxfooter = "<span class='LinkerheadLink'><a href='" + LinkerArticleUrl + "' target='_blank' rel='noopener'></a></span>" +
                "<a href='" + LinkerArticleUrl + "' target='_blank' rel='noopener' title='新窗口打开'>" +
                "<span class='LinkerBoxLogo'><img src='https://niu.fendou.la/wikiPrevBox/starlink.svg'></span></a>";

            LinkerPreviewBox.insertAdjacentHTML('afterbegin', LinkerBoxfooter);
            showLinkerBox();
        }

        function showLinkerBox() {
            if (!LinkerTermPos) return;
            var LinkerPreviewBoxHeight = LinkerPreviewBox.getBoundingClientRect().height || 400;
            var LinkerTermPosBottom = LinkerTermPos.bottom;
            var visibleHeight = window.innerHeight;

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
            if (LinkerTerm && LinkerTerm.matches(':hover')) return;
            if (LinkerPreviewBox && LinkerPreviewBox.matches(':hover')) return;
            LinkerPreviewBox.style.opacity = 0;
            LinkerPreviewBox.style.visibility = 'hidden';
        }

        // ===============================
        // 初始化和 SPA 兼容
        // ===============================
        function initAll() {
            setupWikiLinks();
            setupInternalLinks();
        }

        // 执行初始化
        initAll();

        // 记录当前 URL，用于检测变化
        var currentUrl = window.location.href;

        // 检查 URL 是否变化
        function checkUrlChange() {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                setTimeout(initAll, 300);
            }
        }

        // 定时检查 URL 变化（作为备用方案）
        setInterval(checkUrlChange, 500);

        // SPA 兼容：监听 DOM 变化（更宽松的条件）
        var observer = new MutationObserver(function (mutations) {
            var shouldReinit = false;
            for (var i = 0; i < mutations.length; i++) {
                var mutation = mutations[i];
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (var j = 0; j < mutation.addedNodes.length; j++) {
                        var node = mutation.addedNodes[j];
                        if (node.nodeType === 1) {
                            // 检测更多可能的容器变化
                            if (node.tagName === 'ARTICLE' ||
                                node.tagName === 'MAIN' ||
                                node.tagName === 'DIV' ||
                                (node.classList && (
                                    node.classList.contains('markdown') ||
                                    node.classList.contains('docMainContainer') ||
                                    node.classList.contains('container') ||
                                    node.classList.contains('row')
                                ))) {
                                shouldReinit = true;
                                break;
                            }
                            // 检查是否包含 wikipedia 链接
                            if (node.querySelector && node.querySelector('[href*="wikipedia.org"]')) {
                                shouldReinit = true;
                                break;
                            }
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

        // 拦截 pushState 和 replaceState（React Router 使用这些方法导航）
        var originalPushState = history.pushState;
        var originalReplaceState = history.replaceState;

        history.pushState = function () {
            originalPushState.apply(this, arguments);
            setTimeout(initAll, 300);
        };

        history.replaceState = function () {
            originalReplaceState.apply(this, arguments);
            setTimeout(initAll, 300);
        };

        // 监听所有侧边栏链接点击
        document.addEventListener('click', function (e) {
            var target = e.target;
            // 检查是否点击了导航链接
            while (target && target !== document.body) {
                if (target.tagName === 'A' && target.href && !target.href.includes('wikipedia.org')) {
                    // 是内部导航链接，延迟重新初始化
                    setTimeout(initAll, 500);
                    break;
                }
                target = target.parentElement;
            }
        });

    } // end init()

})();
