/**
 * about.js
 */

// ============================================
// 側邊欄切換功能
// ============================================
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');

// 側邊欄展開/收合
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
        // 儲存狀態到 localStorage
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
}

// 載入頁面時恢復側邊欄狀態
document.addEventListener('DOMContentLoaded', function () {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }
});

// 行動版選單切換
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('mobile-open');
        // 切換圖示
        this.textContent = sidebar.classList.contains('mobile-open') ? '✕' : '☰';
    });
}

// 點擊頁面其他地方關閉行動版選單
document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnToggle = mobileMenuToggle.contains(e.target);

        if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
            mobileMenuToggle.textContent = '☰';
        }
    }
});

// ============================================
// 導航連結平滑滾動與高亮
// ============================================
const navLinks = document.querySelectorAll('.nav-link[data-section]');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // 移除所有 active 狀態
        navLinks.forEach(l => l.classList.remove('active'));

        // 添加 active 到當前連結
        this.classList.add('active');

        // 取得目標區塊
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // 計算偏移量 (考慮固定標題列)
            const offsetTop = targetElement.offsetTop - 20;

            // 平滑滾動
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // 在行動版關閉選單
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
                mobileMenuToggle.textContent = '☰';
            }
        }
    });
});

// 滾動時更新導航高亮
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('.content-card[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ============================================
// 折疊面板 (Accordion) 功能
// ============================================
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', function () {
        const accordionItem = this.parentElement;
        const accordionContent = this.nextElementSibling;
        const isActive = this.classList.contains('active');

        // 如果要實現手風琴效果 (一次只開一個),先關閉所有其他項目
        // 取消註解以下代碼啟用手風琴效果:
        /*
        const allHeaders = this.closest('.accordion').querySelectorAll('.accordion-header');
        const allContents = this.closest('.accordion').querySelectorAll('.accordion-content');
        
        allHeaders.forEach(h => h.classList.remove('active'));
        allContents.forEach(c => c.classList.remove('active'));
        */

        // 切換當前項目
        if (!isActive) {
            this.classList.add('active');
            accordionContent.classList.add('active');
        } else {
            this.classList.remove('active');
            accordionContent.classList.remove('active');
        }
    });
});

// ============================================
// 圖片燈箱功能
// ============================================
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const galleryItems = document.querySelectorAll('.gallery-item-wrapper');

// 開啟燈箱
galleryItems.forEach(item => {
    item.addEventListener('click', function () {
        const imageSrc = this.getAttribute('data-lightbox');
        const imageAlt = this.querySelector('.gallery-item').getAttribute('alt');
        const imageTitle = this.querySelector('.gallery-item-title')?.textContent || '';

        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        lightboxCaption.textContent = imageTitle;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// 關閉燈箱
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

// 點擊背景關閉燈箱
if (lightbox) {
    lightbox.addEventListener('click', function (e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
}

// ESC 鍵關閉燈箱
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// ============================================
// 回到頂部按鈕
// ============================================
const backToTop = document.getElementById('backToTop');

// 顯示/隱藏回到頂部按鈕
window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// 點擊回到頂部
if (backToTop) {
    backToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// 內容卡片淡入動畫
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';

            // 使用 setTimeout 創建延遲效果
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);

            // 只觀察一次
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// 觀察所有內容卡片
const fadeInElements = document.querySelectorAll('.content-card');
fadeInElements.forEach(el => {
    fadeInObserver.observe(el);
});

// ============================================
// 統計數字動畫
// ============================================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end.toLocaleString() + (element.dataset.suffix || '');
        }
    };
    window.requestAnimationFrame(step);
}

// 觀察統計數字元素
const statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const valueElement = entry.target;
            const text = valueElement.textContent.trim();
            const match = text.match(/[\d,]+/);

            if (match) {
                const endValue = parseInt(match[0].replace(/,/g, ''));
                const suffix = text.replace(match[0], '').trim();
                valueElement.dataset.suffix = suffix;
                animateValue(valueElement, 0, endValue, 2000);
            }

            statObserver.unobserve(valueElement);
        }
    });
}, observerOptions);

// 觀察所有統計數字
const statValues = document.querySelectorAll('.stat-item__value');
statValues.forEach(el => {
    statObserver.observe(el);
});

// ============================================
// 響應式處理
// ============================================
let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        // 在桌面版時關閉行動版選單
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-open');
            mobileMenuToggle.textContent = '☰';
        }
    }, 250);
});

// ============================================
// 頁面載入完成後的初始化
// ============================================
window.addEventListener('load', function () {
    // 如果 URL 有 hash,滾動到對應位置
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    console.log('✅ 認識校園頁面載入完成');
});

// ============================================
// 外部連結處理
// ============================================
// 為外部連結添加 target="_blank" 和 rel="noopener noreferrer"
const externalLinks = document.querySelectorAll('a[href^="http"]');
externalLinks.forEach(link => {
    if (!link.hostname === window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// ============================================
// 效能優化 - 圖片懶載入
// ============================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    const lazyLoadObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                lazyLoadObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        lazyLoadObserver.observe(img);
    });
}

// ============================================
// 列印樣式優化
// ============================================
window.addEventListener('beforeprint', function () {
    // 在列印前展開所有折疊內容
    const allAccordionContents = document.querySelectorAll('.accordion-content');
    allAccordionContents.forEach(content => {
        content.style.maxHeight = 'none';
        content.style.display = 'block';
    });
});

window.addEventListener('afterprint', function () {
    // 列印後恢復折疊狀態
    const allAccordionContents = document.querySelectorAll('.accordion-content');
    allAccordionContents.forEach(content => {
        if (!content.classList.contains('active')) {
            content.style.maxHeight = '';
            content.style.display = '';
        }
    });
});

// ============================================
// 深色模式支援
// ============================================
// 檢測系統深色模式偏好
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // 可以在這裡添加深色模式樣式切換邏輯
    console.log('🌙 系統使用深色模式');
}

// 監聽深色模式變化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme = e.matches ? "dark" : "light";
    console.log(`🎨 切換到 ${newColorScheme} 模式`);
});