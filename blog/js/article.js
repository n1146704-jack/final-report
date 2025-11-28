// =========================================
// article.js - 文章頁面完整互動功能
// =========================================

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 修正 <pre><code> 區塊的額外縮排
    // =========================================
    fixCodeIndentation();

    // =========================================
    // 懸浮導航欄效果
    // =========================================
    initFloatingNav();

    // =========================================
    // 閱讀進度條
    // =========================================
    initReadingProgress();

    // =========================================
    // 動態生成文章目錄
    // =========================================
    generateTableOfContents();

    // =========================================
    // 分類選單互動
    // =========================================
    initCategorySidebar();

    // =========================================
    // 文章互動按鈕
    // =========================================
    initArticleActions();

    // =========================================
    // 回到頂部按鈕
    // =========================================
    initScrollToTop();

    // =========================================
    // Todo 示範功能
    // =========================================
    initTodoDemo();

    // =========================================
    // 平滑滾動
    // =========================================
    initSmoothScroll();

    // =========================================
    // 目錄高亮
    // =========================================
    initTOCHighlight();

    // =========================================
    // 分享功能
    // =========================================
    initShareButton();
});

// =========================================
// 修正程式碼縮排
// =========================================
function fixCodeIndentation() {
    const preBlocks = document.querySelectorAll('pre');

    preBlocks.forEach(pre => {
        const code = pre.querySelector('code');
        const target = code || pre;
        let content = target.textContent;
        let lines = content.split('\n');

        // 移除開頭和結尾可能的空行
        if (lines.length > 0 && lines[0].trim() === '') {
            lines.shift();
        }
        if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
            lines.pop();
        }

        // 找出所有非空行的「最小縮排量」
        const minIndentLength = Math.min(
            ...lines
                .filter(line => line.trim() !== '')
                .map(line => line.match(/^(\s*)/)[0].length)
        );

        // 如果有共同縮排,則進行處理
        if (minIndentLength > 0) {
            const newContent = lines
                .map(line => line.substring(minIndentLength))
                .join('\n');

            target.textContent = newContent;
        }
    });
}

// =========================================
// 程式碼複製功能
// =========================================
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code');
    const text = code.textContent;

    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '已複製!';
        button.style.background = '#10b981';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('複製失敗:', err);
        alert('複製失敗,請手動選取複製');
    });
}

// 將 copyCode 函式設為全域,以便 HTML onclick 可以呼叫
window.copyCode = copyCode;

// =========================================
// 懸浮導航欄效果
// =========================================
function initFloatingNav() {
    const floatingNav = document.getElementById('floating-nav');
    if (!floatingNav) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavPosition() {
        const scrollY = window.scrollY;

        // 當滾動超過 300px 時,稍微縮小導航欄
        if (scrollY > 300) {
            floatingNav.style.transform = 'translateX(-50%) scale(0.9)';
        } else {
            floatingNav.style.transform = 'translateX(-50%) scale(1)';
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavPosition);
            ticking = true;
        }
    });
}

// =========================================
// 閱讀進度條
// =========================================
function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// =========================================
// 動態生成文章目錄
// =========================================
function generateTableOfContents() {
    const tocContainer = document.getElementById('article-toc');
    if (!tocContainer) return;

    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;

    const headings = articleContent.querySelectorAll('h2, h3');

    if (headings.length === 0) {
        tocContainer.innerHTML = '<p style="color: #9ca3af; font-size: 0.875rem;">無可用目錄</p>';
        return;
    }

    headings.forEach((heading, index) => {
        // 如果標題沒有 id,自動生成一個
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }

        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = 'quick-links__link';

        // 根據標題層級添加縮排
        if (heading.tagName === 'H3') {
            link.style.paddingLeft = '1.5rem';
            link.style.fontSize = '0.8125rem';
        }

        tocContainer.appendChild(link);
    });
}

// =========================================
// 分類選單互動
// =========================================
function initCategorySidebar() {
    const categoryItems = document.querySelectorAll('.category-sidebar__item');

    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // 移除所有 active 狀態
            categoryItems.forEach(i => i.classList.remove('category-sidebar__item--active'));

            // 添加 active 狀態到當前項目
            item.classList.add('category-sidebar__item--active');

            const category = item.dataset.category;
            console.log('已選擇分類:', category);

            // 這裡可以添加實際的篩選邏輯
            showNotification(`已切換至「${item.querySelector('.category-sidebar__text').textContent}」分類`);
        });
    });
}

// =========================================
// 文章互動按鈕
// =========================================
function initArticleActions() {
    // 按讚按鈕
    const likeBtn = document.getElementById('like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            likeBtn.classList.toggle('active');
            const countSpan = likeBtn.querySelector('.article-action-btn__count');
            if (countSpan) {
                let count = parseInt(countSpan.textContent);
                countSpan.textContent = likeBtn.classList.contains('active') ? count + 1 : count - 1;
            }

            const isLiked = likeBtn.classList.contains('active');
            showNotification(isLiked ? '已按讚 👍' : '已取消按讚');
        });
    }

    // 收藏按鈕
    const bookmarkBtn = document.getElementById('bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => {
            bookmarkBtn.classList.toggle('active');
            const isBookmarked = bookmarkBtn.classList.contains('active');
            showNotification(isBookmarked ? '已加入收藏 🔖' : '已取消收藏');
        });
    }
}

// =========================================
// 分享功能
// =========================================
function initShareButton() {
    const shareBtn = document.getElementById('share-btn');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', async () => {
        const title = document.querySelector('.hero-visual__title')?.textContent || document.title;
        const url = window.location.href;

        // 使用 Web Share API (如果支援)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url
                });
                showNotification('分享成功! 🎉');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('分享錯誤:', err);
                    fallbackShare(url);
                }
            }
        } else {
            fallbackShare(url);
        }
    });
}

function fallbackShare(url) {
    // 降級方案:複製連結
    navigator.clipboard.writeText(url).then(() => {
        showNotification('連結已複製到剪貼簿! 📋');
    }).catch(err => {
        console.error('複製失敗:', err);

        // 最後的降級方案:顯示連結
        const modal = createShareModal(url);
        document.body.appendChild(modal);
    });
}

function createShareModal(url) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 90%;
    `;

    modal.innerHTML = `
        <h3 style="margin-bottom: 1rem;">分享此文章</h3>
        <input type="text" value="${url}" readonly style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 2px solid #e5e7eb; border-radius: 0.25rem;">
        <button onclick="this.closest('div').remove()" style="padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">關閉</button>
    `;

    return modal;
}

// =========================================
// 回到頂部按鈕
// =========================================
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    // 顯示/隱藏按鈕
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // 點擊回到頂部
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =========================================
// Todo 示範功能
// =========================================
function initTodoDemo() {
    window.addTodoDemo = function () {
        const input = document.getElementById('todo-input');
        const list = document.getElementById('todo-list');

        if (!input || !list) return;

        const text = input.value.trim();
        if (!text) {
            showNotification('請輸入待辦事項!', 'warning');
            return;
        }

        const li = document.createElement('li');
        li.className = 'todo-demo__item';
        li.style.animation = 'fadeInUp 0.3s ease-out';

        li.innerHTML = `
            <input type="checkbox" class="todo-demo__checkbox">
            <span>${escapeHtml(text)}</span>
        `;

        list.appendChild(li);
        input.value = '';

        showNotification('新增成功! ✅');

        // 添加刪除線效果
        const checkbox = li.querySelector('.todo-demo__checkbox');
        const span = li.querySelector('span');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                span.style.textDecoration = 'line-through';
                span.style.opacity = '0.5';
            } else {
                span.style.textDecoration = 'none';
                span.style.opacity = '1';
            }
        });
    };

    // 監聽 Enter 鍵
    const input = document.getElementById('todo-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                window.addTodoDemo();
            }
        });
    }
}

// HTML 轉義函式
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =========================================
// 平滑滾動
// =========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // 忽略純 # 連結
            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 100; // 減去導航欄高度

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =========================================
// 目錄高亮
// =========================================
function initTOCHighlight() {
    const tocLinks = document.querySelectorAll('.quick-links__link');
    if (tocLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;

                // 移除所有高亮
                tocLinks.forEach(link => {
                    link.classList.remove('quick-links__link--active');
                });

                // 添加當前高亮
                const activeLink = document.querySelector(`.quick-links__link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('quick-links__link--active');
                }
            }
        });
    }, {
        rootMargin: '-100px 0px -80% 0px'
    });

    // 觀察所有標題
    document.querySelectorAll('.article-content h2, .article-content h3').forEach(heading => {
        if (heading.id) {
            observer.observe(heading);
        }
    });
}

// =========================================
// 通知提示
// =========================================
function showNotification(message, type = 'success') {
    // 移除現有通知
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'custom-notification';

    const bgColor = type === 'success' ? '#10b981' :
        type === 'warning' ? '#f59e0b' :
            '#667eea';

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
        max-width: 300px;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // 3 秒後自動移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// =========================================
// 添加動畫樣式到 head
// =========================================
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationStyles);

// =========================================
// 評論區互動
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.querySelector('.comment-form__submit');
    if (commentForm) {
        commentForm.addEventListener('click', (e) => {
            e.preventDefault();
            const textarea = document.querySelector('.comment-form__input');

            if (!textarea.value.trim()) {
                showNotification('請輸入留言內容!', 'warning');
                return;
            }

            showNotification('留言已送出! 💬');
            textarea.value = '';
        });
    }

    // 回覆按鈕
    const replyButtons = document.querySelectorAll('.comment-item__reply');
    replyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const author = btn.closest('.comment-item').querySelector('.comment-item__author').textContent;
            const textarea = document.querySelector('.comment-form__input');
            textarea.value = `@${author} `;
            textarea.focus();

            // 滾動到評論表單
            textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
});

// =========================================
// 標籤雲互動
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const tagCloudItems = document.querySelectorAll('.tag-cloud-item');

    tagCloudItems.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const tagName = tag.textContent;
            showNotification(`已選擇標籤: ${tagName} 🏷️`);
        });
    });
});

// =========================================
// 鍵盤快捷鍵
// =========================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: 快速搜尋 (預留)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showNotification('搜尋功能開發中... 🔍');
    }

    // ESC: 關閉所有彈窗
    if (e.key === 'Escape') {
        document.querySelectorAll('.custom-notification').forEach(n => n.remove());
    }
});

// =========================================
// 性能優化:圖片延遲載入
// =========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
