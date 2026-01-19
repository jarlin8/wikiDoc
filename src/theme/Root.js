import React, { useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';

// Wiki Preview Box 组件 - 兼容 Docusaurus SPA
function WikiPreviewBox() {
    const location = useLocation();
    const previewBoxRef = useRef(null);
    const linkerBoxRef = useRef(null);

    useEffect(() => {
        // 加载 CSS
        if (!document.getElementById('wiki-preview-css')) {
            const link = document.createElement('link');
            link.id = 'wiki-preview-css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://niu.fendou.la/wikiPrevBox/wikiPreviewBox.min.css';
            document.head.appendChild(link);
        }

        const wikiBoxWidth = 300;
        const wikiBoxMaxLength = 280;
        const linkerBoxWidth = 300;
        let showNoImages = true;

        // Wikipedia 链接预览功能
        function setupWikiLinks() {
            const wikiPreviewBox = previewBoxRef.current;
            if (!wikiPreviewBox) return;

            const allWikiLinks = document.querySelectorAll(
                "[href*='wikipedia.org']:not([href*='#nopreview']):not(.wiki-preview-bound)"
            );

            allWikiLinks.forEach((link) => {
                link.classList.add('wikiLink', 'wiki-preview-bound');

                link.addEventListener('mouseover', (e) => {
                    const wikiArticleUrl = link.href;
                    const whatArticle = wikiArticleUrl.split('/').pop();
                    const wikiLang = wikiArticleUrl.split('.')[0].split('//')[1];
                    const wikiTermPos = link.getBoundingClientRect();

                    let wikiBoxLeft =
                        wikiTermPos.left -
                        wikiBoxWidth / 2 +
                        (wikiTermPos.right - wikiTermPos.left) / 2;
                    if (wikiBoxLeft < 0) wikiBoxLeft = 10;
                    const winInnerWidth = window.innerWidth;
                    if (wikiBoxLeft + wikiBoxWidth > winInnerWidth) {
                        wikiBoxLeft = winInnerWidth - wikiBoxWidth - 20;
                    }
                    wikiPreviewBox.style.left = wikiBoxLeft + 'px';

                    // Fetch Wikipedia data
                    const articleName = (
                        whatArticle.charAt(0).toUpperCase() + whatArticle.slice(1)
                    ).replace(/ /g, '_');

                    fetch(
                        `https://${wikiLang}.m.wikipedia.org/api/rest_v1/page/summary/${articleName}`
                    )
                        .then((response) => {
                            if (response.ok) return response.json();
                            throw new Error('Failed to fetch');
                        })
                        .then((data) => {
                            let content = '';
                            if (data.thumbnail && !showNoImages) {
                                content = `<img height='${data.thumbnail.height}' src='${data.thumbnail.source}'/>`;
                            }

                            let extractHtml = data.extract_html || '';
                            if (extractHtml.length > wikiBoxMaxLength) {
                                extractHtml = extractHtml.substring(0, wikiBoxMaxLength) + '...';
                            }
                            content += extractHtml;

                            const footer = `
                <span class='wikiBoxfooter_ltr'>
                  <a href='${wikiArticleUrl}' target='_blank' rel='noopener'>${data.title}</a> (wikipedia.org)
                </span>
                <a href='${wikiArticleUrl}' target='_blank' rel='noopener' title='维基百科链接'>
                  <span class='wikiBoxLogo-w_ltr'>
                    <img src='https://niu.fendou.la/wikiPrevBox/w.svg' height='30' width='35'>
                  </span>
                </a>`;

                            wikiPreviewBox.innerHTML = content + footer;

                            // Position and show
                            const boxHeight = wikiPreviewBox.getBoundingClientRect().height || 400;
                            if (wikiTermPos.bottom < boxHeight) {
                                wikiPreviewBox.style.top = wikiTermPos.bottom + window.scrollY + 'px';
                            } else {
                                wikiPreviewBox.style.top =
                                    wikiTermPos.top + window.scrollY - boxHeight + 'px';
                            }
                            wikiPreviewBox.style.opacity = '1';
                            wikiPreviewBox.style.visibility = 'visible';
                        })
                        .catch(() => { });
                });

                link.addEventListener('mouseout', () => {
                    setTimeout(() => {
                        if (!link.matches(':hover') && !wikiPreviewBox.matches(':hover')) {
                            wikiPreviewBox.style.opacity = '0';
                            wikiPreviewBox.style.visibility = 'hidden';
                        }
                    }, 100);
                });
            });
        }

        // 内部链接预览功能
        function setupInternalLinks() {
            const linkerPreviewBox = linkerBoxRef.current;
            if (!linkerPreviewBox) return;

            // Docusaurus 内部链接选择器
            const internalLinkSelectors = [
                'a[href^="/"]:not([href*="://"]):not(.linker-preview-bound)',
                'a.internal:not(.linker-preview-bound)',
                '.markdown a:not([href*="://"]):not([href^="#"]):not(.linker-preview-bound)',
            ];

            const allInternalLinks = document.querySelectorAll(
                internalLinkSelectors.join(',')
            );

            allInternalLinks.forEach((link) => {
                // 排除外部链接和锚点链接
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#') || href.includes('://')) return;

                link.classList.add('LinkerLink', 'linker-preview-bound');

                link.addEventListener('mouseover', (e) => {
                    const linkerArticleUrl = link.href;
                    const linkerTermPos = link.getBoundingClientRect();

                    let linkerBoxLeft =
                        linkerTermPos.left -
                        linkerBoxWidth / 2 +
                        (linkerTermPos.right - linkerTermPos.left) / 2;
                    if (linkerBoxLeft < 0) linkerBoxLeft = 10;
                    const winInnerWidth = window.innerWidth;
                    if (linkerBoxLeft + linkerBoxWidth > winInnerWidth) {
                        linkerBoxLeft = winInnerWidth - linkerBoxWidth - 20;
                    }
                    linkerPreviewBox.style.left = linkerBoxLeft + 'px';

                    // Fetch internal page content
                    fetch(linkerArticleUrl)
                        .then((response) => {
                            if (response.ok) return response.text();
                            throw new Error('Failed to fetch');
                        })
                        .then((html) => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            const article = doc.querySelector('.markdown');
                            if (!article) return;

                            // 获取标题和摘要
                            const title = doc.querySelector('h1')?.textContent || '';
                            let content = article.innerHTML;

                            // 限制内容长度
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = content;
                            const textContent = tempDiv.textContent || '';
                            if (textContent.length > 500) {
                                content =
                                    '<p>' + textContent.substring(0, 500) + '...</p>';
                            }

                            const footer = `
                <span class='LinkerheadLink'>
                  <a href='${linkerArticleUrl}' target='_blank' rel='noopener'>${title}</a>
                </span>
                <a href='${linkerArticleUrl}' target='_blank' rel='noopener' title='新窗口打开'>
                  <span class='LinkerBoxLogo'>
                    <img src='https://niu.fendou.la/wikiPrevBox/starlink.svg'>
                  </span>
                </a>`;

                            linkerPreviewBox.innerHTML = footer + content;

                            // Position and show
                            const boxHeight =
                                linkerPreviewBox.getBoundingClientRect().height || 400;
                            if (linkerTermPos.bottom < boxHeight) {
                                linkerPreviewBox.style.top =
                                    linkerTermPos.bottom + window.scrollY + 'px';
                            } else {
                                linkerPreviewBox.style.top =
                                    linkerTermPos.top + window.scrollY - boxHeight + 'px';
                            }
                            linkerPreviewBox.style.opacity = '1';
                            linkerPreviewBox.style.visibility = 'visible';
                        })
                        .catch(() => { });
                });

                link.addEventListener('mouseout', () => {
                    setTimeout(() => {
                        if (!link.matches(':hover') && !linkerPreviewBox.matches(':hover')) {
                            linkerPreviewBox.style.opacity = '0';
                            linkerPreviewBox.style.visibility = 'hidden';
                        }
                    }, 100);
                });
            });
        }

        // 初始化
        const timer = setTimeout(() => {
            setupWikiLinks();
            setupInternalLinks();
        }, 500);

        return () => clearTimeout(timer);
    }, [location.pathname]); // 路由变化时重新绑定

    // 隐藏预览框
    const hideBox = (ref) => {
        if (ref.current) {
            ref.current.style.opacity = '0';
            ref.current.style.visibility = 'hidden';
        }
    };

    return (
        <>
            <article
                id="wikiPreviewBox"
                className="wikiPreviewBox"
                ref={previewBoxRef}
                onClick={() => hideBox(previewBoxRef)}
                onMouseOut={() => hideBox(previewBoxRef)}
                style={{ width: '300px' }}
            />
            <article
                id="LinkerPreviewBox"
                className="LinkerPreviewBox"
                ref={linkerBoxRef}
                onClick={() => hideBox(linkerBoxRef)}
                onMouseOut={() => hideBox(linkerBoxRef)}
                style={{ width: '300px' }}
            />
        </>
    );
}

// Root 组件包装整个应用
export default function Root({ children }) {
    return (
        <>
            <WikiPreviewBox />
            {children}
        </>
    );
}
