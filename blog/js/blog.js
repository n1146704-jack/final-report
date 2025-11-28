/**
 * =========================================
 * blog.js
 * =========================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 固定導航列
    // =========================================
    const mainNav = document.querySelector('.page-nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 300) {
            mainNav.classList.add('sticky');
        } else {
            mainNav.classList.remove('sticky');
        }
        
        lastScroll = currentScroll;
    });

    // =========================================
    // 手機版選單切換
    // =========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.page-nav__links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            mobileToggle.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // 點擊選單項目後關閉選單
        const navLinkItems = document.querySelectorAll('.page-nav__link');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // 點擊背景關閉選單
        navLinks.addEventListener('click', (e) => {
            if (e.target === navLinks) {
                navLinks.classList.remove('open');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // =========================================
    // 平滑滾動
    // =========================================
    const smoothScrollLinks = document.querySelectorAll('.smoothscroll');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 只處理頁面內的錨點連結
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                
                if (target) {
                    const targetOffset = target.offsetTop - 80;
                    
                    window.scrollTo({
                        top: targetOffset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // =========================================
    // 數字動畫計數器
    // =========================================
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card__number, .stat-detail-card__number').forEach(counter => {
        counterObserver.observe(counter);
    });

    // =========================================
    // 元素進入視窗時的淡入動畫
    // =========================================
    const fadeElements = document.querySelectorAll('.animate-fade-in, .animate-scale, .animate-slide-up, .animate-timeline');
    
    const fadeObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(element => {
        // 初始設定為不可見
        element.style.opacity = '0';
        
        const delay = element.getAttribute('data-delay') || 0;
        element.style.transitionDelay = `${delay}ms`;
        
        fadeObserver.observe(element);
    });

    // =========================================
    // 返回頂部按鈕
    // =========================================
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========================================
    // Newsletter 表單處理
    // =========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('.newsletter-form__input');
            const email = emailInput.value.trim();
            
            if (email) {
                // 這裡可以加入實際的訂閱邏輯
                alert(`感謝訂閱!我們會將最新文章發送到 ${email}`);
                emailInput.value = '';
            }
        });
    }

    // =========================================
    // 文章卡片 hover 效果增強
    // =========================================
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // =========================================
    // 分類卡片點擊效果
    // =========================================
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // 這裡可以加入實際的導航邏輯
            const title = this.querySelector('.category-card__title').textContent;
            console.log(`導航到分類: ${title}`);
        });
    });

    // =========================================
    // 時間軸項目動畫觸發
    // =========================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const marker = entry.target.querySelector('.timeline-item__marker');
                if (marker) {
                    marker.style.animation = 'pulse 0.6s ease-out';
                }
            }
        });
    }, {
        threshold: 0.2
    });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // =========================================
    // 技能標籤互動效果
    // =========================================
    const skillBadges = document.querySelectorAll('.skill-badge');
    
    skillBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // =========================================
    // 視差滾動效果
    // =========================================
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const header = document.querySelector('.gradient-header');
        
        if (header && scrolled < window.innerHeight) {
            const parallaxElements = header.querySelectorAll('.header-title__icon, .header-title__main, .header-title__sub');
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });

    // =========================================
    // 預載入動畫
    // =========================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // 觸發首屏元素的動畫
        const heroElements = document.querySelectorAll('.header-title > *');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });

    // =========================================
    // 滾動進度條
    // =========================================
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    };

    // 啟用滾動進度條
    createScrollProgress();

    // =========================================
    // 圖片懶加載
    // =========================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // =========================================
    // 鍵盤快捷鍵
    // =========================================
    document.addEventListener('keydown', (e) => {
        // Esc 鍵關閉手機選單
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Home 鍵回到頂部
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // End 鍵到底部
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
});