/**
 * structure.js
 */

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function () {
    initScrollEffects();
    initNumberAnimation();
    initSideNavigation();
    initRevealAnimation();
    initFAQ();
    initTestimonialSlider();
    initProgressBars();
    initDepartmentCards();
    initAOSAnimation();
});

// ==================== Header 滾動效果 ====================
function initScrollEffects() {
    const header = document.getElementById('page-header-container');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', throttle(function () {
        const currentScroll = window.pageYOffset;

        // 添加滾動陰影效果
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, 100));
}

// ==================== 數字動畫效果 ====================
function initNumberAnimation() {
    const statNumbers = document.querySelectorAll('.stat-card__number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateNumber(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(number => observer.observe(number));
}

function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(function () {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // 格式化數字顯示
        if (target > 90 && target < 100) {
            // 百分比
            element.textContent = Math.floor(current) + '%';
        } else if (target >= 500) {
            // 大數字加上 + 號
            element.textContent = Math.floor(current) + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ==================== 進度條動畫 ====================
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.parentElement.parentElement.classList.contains('animated')) {
                const progress = entry.target.getAttribute('data-progress') || 100;
                entry.target.style.setProperty('--progress', progress + '%');
                entry.target.parentElement.parentElement.classList.add('animated');
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        if (bar.parentElement && bar.parentElement.parentElement) {
            observer.observe(bar.parentElement.parentElement);
        }
    });
}

// ==================== 滾動顯示動畫 ====================
function initAOSAnimation() {
    const aosElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 延遲執行動畫
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, observerOptions);

    aosElements.forEach(element => observer.observe(element));
}

function initRevealAnimation() {
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(element => observer.observe(element));
}

// ==================== 部門卡片互動效果 ====================
function initDepartmentCards() {
    const departmentCards = document.querySelectorAll('.department-card');

    departmentCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
        });

        // 點擊卡片時的效果
        card.addEventListener('click', function (e) {
            // 如果點擊的不是連結
            if (!e.target.closest('a')) {
                this.classList.toggle('expanded');
            }
        });
    });
}

// ==================== FAQ 折疊效果 ====================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', function () {
                // 關閉其他已展開的項目
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // 切換當前項目
                item.classList.toggle('active');
            });
        }
    });
}

// ==================== Testimonials 輪播效果 ====================
function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.testimonial-btn--prev');
    const nextBtn = document.querySelector('.testimonial-btn--next');

    if (!testimonialCards.length || !dotsContainer) return;

    let currentIndex = 0;
    let autoPlayInterval;

    // 創建導航點
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonial-dot');

    function goToSlide(index) {
        // 移除當前活動狀態
        testimonialCards[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        // 設置新的活動狀態
        currentIndex = index;
        testimonialCards[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');

        // 重置自動播放
        resetAutoPlay();
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % testimonialCards.length;
        goToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
        goToSlide(prevIndex);
    }

    // 按鈕事件
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    // 自動播放
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 開始自動播放
    startAutoPlay();

    // 鼠標懸停時暫停自動播放
    const testimonialSection = document.querySelector('.testimonials-slider');
    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', stopAutoPlay);
        testimonialSection.addEventListener('mouseleave', startAutoPlay);
    }

    // 鍵盤導航
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}

// ==================== 側邊導航主要功能 ====================
function initSideNavigation() {
    const toggle = document.querySelector('.side-nav-toggle');
    const navigation = document.querySelector('.side-navigation');
    const navLinks = document.querySelectorAll('.side-navigation ul li a');

    // 檢查元素是否存在
    if (!toggle || !navigation) {
        console.warn('Side navigation elements not found');
        return;
    }

    // 切換導航展開/收合
    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        navigation.classList.toggle('active');

        // 當導航展開時為 body 添加 class
        document.body.classList.toggle('nav-expanded');

        // 儲存狀態到 localStorage
        const isActive = navigation.classList.contains('active');
        localStorage.setItem('sideNavExpanded', isActive);
    });

    // 點擊導航項目時的處理
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            // 移除所有 active class
            const allItems = document.querySelectorAll('.side-navigation ul li');
            allItems.forEach(function (item) {
                item.classList.remove('active');
            });

            // 為當前項目添加 active class
            const parentLi = this.closest('li');
            if (parentLi && !parentLi.matches(':first-child')) {
                parentLi.classList.add('active');
            }

            // 在手機版自動收合導航
            if (window.innerWidth <= 768) {
                setTimeout(function () {
                    navigation.classList.remove('active');
                    document.body.classList.remove('nav-expanded');
                }, 300);
            }
        });
    });

    // 點擊導航外部時自動收合
    document.addEventListener('click', function (e) {
        const isClickInside = navigation.contains(e.target);
        const isExpanded = navigation.classList.contains('active');

        if (!isClickInside && isExpanded && window.innerWidth <= 768) {
            navigation.classList.remove('active');
            document.body.classList.remove('nav-expanded');
        }
    });

    // 恢復上次的展開狀態
    restoreSideNavState();

    // 設定當前頁面的 active 狀態
    setCurrentPageActive();

    // 鍵盤支援
    initKeyboardSupport(toggle, navigation);
}

// ==================== 恢復導航狀態 ====================
function restoreSideNavState() {
    const savedState = localStorage.getItem('sideNavExpanded');
    const navigation = document.querySelector('.side-navigation');

    if (savedState === 'true' && navigation) {
        // 只在桌面版本恢復展開狀態
        if (window.innerWidth > 768) {
            navigation.classList.add('active');
            document.body.classList.add('nav-expanded');
        }
    }
}

// ==================== 設定當前頁面的 Active 狀態 ====================
function setCurrentPageActive() {
    // 獲取當前頁面的檔名
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 找到對應的導航項目
    const navLinks = document.querySelectorAll('.side-navigation ul li a');

    navLinks.forEach(function (link) {
        const linkHref = link.getAttribute('href');

        if (linkHref && linkHref.includes(currentPage)) {
            const parentLi = link.closest('li');
            if (parentLi && !parentLi.matches(':first-child')) {
                parentLi.classList.add('active');
            }
        }
    });
}

// ==================== 鍵盤支援 ====================
function initKeyboardSupport(toggle, navigation) {
    // ESC 鍵關閉導航
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navigation.classList.contains('active')) {
            navigation.classList.remove('active');
            document.body.classList.remove('nav-expanded');
            toggle.focus();
        }
    });

    // Tab 鍵循環焦點
    const navLinks = navigation.querySelectorAll('a');
    if (navLinks.length > 1) {
        const firstLink = navLinks[1];
        const lastLink = navLinks[navLinks.length - 1];

        navigation.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstLink) {
                    e.preventDefault();
                    lastLink.focus();
                } else if (!e.shiftKey && document.activeElement === lastLink) {
                    e.preventDefault();
                    firstLink.focus();
                }
            }
        });
    }
}

// ==================== 平滑滾動 ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            const header = document.getElementById('page-header-container');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== 載入動畫 ====================
window.addEventListener('load', function () {
    // 頁面載入完成後的動畫
    document.body.classList.add('loaded');

    // 添加視差效果
    initParallaxEffect();
});

// ==================== 視差效果 ====================
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero-bg-animation, .tech-header__particles');

    window.addEventListener('scroll', throttle(function () {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 10));
}

// ==================== 監聽視窗大小變化 ====================
let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        handleSideNavResize();
    }, 250);
});

// ==================== 視窗大小變化處理 ====================
function handleSideNavResize() {
    const width = window.innerWidth;
    const navigation = document.querySelector('.side-navigation');

    // 在大螢幕上切換時,保持導航狀態
    if (width > 768) {
        const savedState = localStorage.getItem('sideNavExpanded');
        if (savedState === 'true' && navigation) {
            navigation.classList.add('active');
            document.body.classList.add('nav-expanded');
        }
    } else {
        // 在小螢幕上,預設收合導航
        if (navigation && navigation.classList.contains('active')) {
            navigation.classList.remove('active');
            document.body.classList.remove('nav-expanded');
        }
    }
}

// ==================== 工具函數:節流 ====================
function throttle(func, wait) {
    let timeout;
    let previous = 0;

    return function executedFunction(...args) {
        const now = Date.now();
        const remaining = wait - (now - previous);

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}

// ==================== 工具函數:防抖 ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== 側邊導航工具函數 ====================

/**
 * 切換側邊導航的展開狀態
 */
function toggleSideNavigation() {
    const navigation = document.querySelector('.side-navigation');
    if (navigation) {
        navigation.classList.toggle('active');
        document.body.classList.toggle('nav-expanded');

        const isActive = navigation.classList.contains('active');
        localStorage.setItem('sideNavExpanded', isActive);
    }
}

/**
 * 展開側邊導航
 */
function openSideNavigation() {
    const navigation = document.querySelector('.side-navigation');
    if (navigation && !navigation.classList.contains('active')) {
        navigation.classList.add('active');
        document.body.classList.add('nav-expanded');
        localStorage.setItem('sideNavExpanded', 'true');
    }
}

/**
 * 收合側邊導航
 */
function closeSideNavigation() {
    const navigation = document.querySelector('.side-navigation');
    if (navigation && navigation.classList.contains('active')) {
        navigation.classList.remove('active');
        document.body.classList.remove('nav-expanded');
        localStorage.setItem('sideNavExpanded', 'false');
    }
}

// ==================== 將函數暴露到全域作用域 ====================
window.toggleSideNavigation = toggleSideNavigation;
window.openSideNavigation = openSideNavigation;
window.closeSideNavigation = closeSideNavigation;

// ==================== 額外互動效果 ====================

// 統計卡片懸停效果
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

// 核心價值卡片 3D 效果
document.querySelectorAll('.value-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

// 服務卡片點擊展開效果
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function () {
        this.classList.toggle('expanded');
    });
});

// 合作夥伴 Logo 動畫
document.querySelectorAll('.partner-logo').forEach(logo => {
    logo.addEventListener('click', function () {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);
    });
});

// ==================== 滾動進度指示器 ====================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--color-tech-accent-primary), var(--color-tech-accent-secondary));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', throttle(function () {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    }, 50));
}

// 初始化滾動進度指示器
initScrollProgress();

// ==================== Debug 模式 ====================
const DEBUG = false;

function log(...args) {
    if (DEBUG) {
        console.log('[Structure Page]', ...args);
    }
}

// ==================== 性能監控 ====================
if (DEBUG) {
    // 監控頁面載入性能
    window.addEventListener('load', function () {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        log('Page Load Time:', pageLoadTime + 'ms');

        const connectTime = perfData.responseEnd - perfData.requestStart;
        log('Server Response Time:', connectTime + 'ms');
    });
}