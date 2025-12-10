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
  initContentResponsive();
});

// ==================== 內容區域響應式監聽 ====================
const CONTENT_BREAKPOINTS = {
  sm: 450,
  md: 700,
  lg: 1000
};

function supportsContainerQuery() {
  return CSS.supports('container-type', 'inline-size');
}

function updateContentResponsiveClasses(width) {
  const mainContent = document.getElementById('page-content-container');
  if (!mainContent) return;

  // 移除所有響應式 class
  mainContent.classList.remove('content-sm', 'content-md', 'content-lg', 'content-xl');

  // 根據寬度添加對應的 class
  if (width <= CONTENT_BREAKPOINTS.sm) {
    mainContent.classList.add('content-sm', 'content-md', 'content-lg');
  } else if (width <= CONTENT_BREAKPOINTS.md) {
    mainContent.classList.add('content-md', 'content-lg');
  } else if (width <= CONTENT_BREAKPOINTS.lg) {
    mainContent.classList.add('content-lg');
  } else {
    mainContent.classList.add('content-xl');
  }
}

/**
 * 初始化內容區域響應式監聽
 */
function initContentResponsive() {
  const mainContent = document.getElementById('page-content-container');
  if (!mainContent) return;

  // 檢查是否支援 Container Query
  const hasContainerQuerySupport = supportsContainerQuery();

  if (!hasContainerQuerySupport) {
    console.log('📦 瀏覽器不支援 Container Query，使用 JavaScript fallback');

    // 初始化響應式 class
    updateContentResponsiveClasses(mainContent.offsetWidth);

    // 建立 ResizeObserver 監聽寬度變化
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        updateContentResponsiveClasses(width);
      }
    });

    resizeObserver.observe(mainContent);
  } else {
    console.log('✅ 瀏覽器支援 Container Query');
  }
}

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
      element.textContent = Math.floor(current) + '%';
    } else if (target >= 500) {
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

  // 切換幻燈片 - 確保只有一張卡片顯示
  function goToSlide(index) {
    // 移除所有卡片的 active、prev、next class
    testimonialCards.forEach((card, i) => {
      card.classList.remove('active', 'prev', 'next');

      // 設定位置標記（用於動畫方向）
      if (i < index) {
        card.classList.add('prev');
      } else if (i > index) {
        card.classList.add('next');
      }
    });

    // 移除所有點的 active
    dots.forEach(dot => dot.classList.remove('active'));

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
    autoPlayInterval = setInterval(nextSlide, 3000);
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
  const testimonialSection = document.querySelector('.testimonials-section');
  if (testimonialSection) {
    testimonialSection.addEventListener('mouseenter', stopAutoPlay);
    testimonialSection.addEventListener('mouseleave', startAutoPlay);
  }

  // 鍵盤導航
  document.addEventListener('keydown', function (e) {
    // 只在 testimonials section 可見時響應
    const rect = testimonialSection?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    }
  });

  // 觸控滑動支援
  let touchStartX = 0;
  let touchEndX = 0;
  const slider = document.querySelector('.testimonial-slider');

  if (slider) {
    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  }

  // 初始化時確保只有第一張顯示
  goToSlide(0);
}

// ==================== 側邊導航主要功能 ====================
function initSideNavigation() {
  const desktopToggle = document.querySelector('.side-nav-toggle--desktop');
  const mobileToggle = document.querySelector('.side-nav-toggle--mobile');
  const navigation = document.querySelector('.side-navigation');
  const navLinks = document.querySelectorAll('.side-navigation ul li a');
  const mainContent = document.getElementById('page-content-container');

  // 檢查元素是否存在
  if (!navigation) {
    console.warn('Side navigation elements not found');
    return;
  }

  // 判斷是否為手機版
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // 桌面版 Toggle 事件
  if (desktopToggle) {
    desktopToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navigation.classList.toggle('active');
      document.body.classList.toggle('nav-expanded');

      // 儲存狀態到 localStorage
      const isActive = navigation.classList.contains('active');
      localStorage.setItem('sideNavExpanded', isActive);

      // 如果不支援 Container Query，手動觸發寬度檢查
      if (!supportsContainerQuery() && mainContent) {
        setTimeout(() => {
          updateContentResponsiveClasses(mainContent.offsetWidth);
        }, 550);
      }
    });
  }

  // 手機版 Toggle 事件
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navigation.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });
  }

  // 點擊導航項目時的處理
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const allItems = document.querySelectorAll('.side-navigation ul li');
      allItems.forEach(function (item) {
        item.classList.remove('active');
      });

      const parentLi = this.closest('li');
      if (parentLi && !parentLi.matches(':first-child')) {
        parentLi.classList.add('active');
      }

      // 在手機版點擊導航項目後自動關閉側邊欄
      if (isMobile()) {
        setTimeout(function () {
          navigation.classList.remove('active');
          if (mobileToggle) {
            mobileToggle.classList.remove('active');
          }
        }, 300);
      }
    });
  });

  // 點擊導航外部時自動收合（手機版）
  document.addEventListener('click', function (e) {
    const isClickInsideNav = navigation.contains(e.target);
    const isClickOnMobileToggle = mobileToggle && mobileToggle.contains(e.target);
    const isExpanded = navigation.classList.contains('active');

    // 手機版：點擊外部關閉側邊欄
    if (!isClickInsideNav && !isClickOnMobileToggle && isExpanded && isMobile()) {
      navigation.classList.remove('active');
      if (mobileToggle) {
        mobileToggle.classList.remove('active');
      }
    }
  });

  // 恢復上次的展開狀態（僅桌面版）
  restoreSideNavState();

  // 設定當前頁面的 active 狀態
  setCurrentPageActive();

  // 鍵盤支援
  if (desktopToggle || mobileToggle) {
    initKeyboardSupport(desktopToggle, mobileToggle, navigation);
  }
}

// ==================== 恢復導航狀態 ====================
function restoreSideNavState() {
  const navigation = document.querySelector('.side-navigation');
  if (!navigation) return;

  // 只在桌面版恢復狀態
  if (window.innerWidth > 768) {
    const savedState = localStorage.getItem('sideNavExpanded');
    if (savedState === 'true') {
      navigation.classList.add('active');
      document.body.classList.add('nav-expanded');
    }
  }
}

// ==================== 設定當前頁面 Active 狀態 ====================
function setCurrentPageActive() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.side-navigation ul li a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const parentLi = link.closest('li');

    if (href && currentPath.includes(href.replace('.html', ''))) {
      if (parentLi && !parentLi.matches(':first-child')) {
        parentLi.classList.add('active');
      }
    }
  });
}

// ==================== 鍵盤支援 ====================
function initKeyboardSupport(desktopToggle, mobileToggle, navigation) {
  document.addEventListener('keydown', function (e) {
    // ESC 鍵關閉側邊欄
    if (e.key === 'Escape' && navigation.classList.contains('active')) {
      navigation.classList.remove('active');
      if (window.innerWidth <= 768 && mobileToggle) {
        mobileToggle.classList.remove('active');
      } else {
        document.body.classList.remove('nav-expanded');
      }
    }
  });

  // Tab 導航支援
  const focusableElements = navigation.querySelectorAll('a, button');
  if (focusableElements.length > 0) {
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    navigation.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }
}

// ==================== 頁面載入完成後執行 ====================
window.addEventListener('load', function () {
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
  const mobileToggle = document.querySelector('.side-nav-toggle--mobile');

  if (!navigation) return;

  if (width > 768) {
    // 桌面版：根據儲存的狀態恢復
    const savedState = localStorage.getItem('sideNavExpanded');
    if (savedState === 'true') {
      navigation.classList.add('active');
      document.body.classList.add('nav-expanded');
    }
    // 確保手機版按鈕狀態重置
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
    }
  } else {
    // 手機版：確保側邊欄是完全隱藏的
    navigation.classList.remove('active');
    document.body.classList.remove('nav-expanded');
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
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
  const mobileToggle = document.querySelector('.side-nav-toggle--mobile');
  const mainContent = document.getElementById('page-content-container');

  if (navigation) {
    navigation.classList.toggle('active');

    if (window.innerWidth <= 768 && mobileToggle) {
      mobileToggle.classList.toggle('active');
    } else {
      document.body.classList.toggle('nav-expanded');
      const isActive = navigation.classList.contains('active');
      localStorage.setItem('sideNavExpanded', isActive);
    }

    // 如果不支援 Container Query，手動觸發寬度檢查
    if (!supportsContainerQuery() && mainContent) {
      setTimeout(() => {
        updateContentResponsiveClasses(mainContent.offsetWidth);
      }, 550);
    }
  }
}

/**
 * 展開側邊導航
 */
function openSideNavigation() {
  const navigation = document.querySelector('.side-navigation');
  const mobileToggle = document.querySelector('.side-nav-toggle--mobile');
  const mainContent = document.getElementById('page-content-container');

  if (navigation && !navigation.classList.contains('active')) {
    navigation.classList.add('active');

    if (window.innerWidth <= 768 && mobileToggle) {
      mobileToggle.classList.add('active');
    } else {
      document.body.classList.add('nav-expanded');
      localStorage.setItem('sideNavExpanded', 'true');
    }

    // 如果不支援 Container Query，手動觸發寬度檢查
    if (!supportsContainerQuery() && mainContent) {
      setTimeout(() => {
        updateContentResponsiveClasses(mainContent.offsetWidth);
      }, 550);
    }
  }
}

/**
 * 收合側邊導航
 */
function closeSideNavigation() {
  const navigation = document.querySelector('.side-navigation');
  const mobileToggle = document.querySelector('.side-nav-toggle--mobile');
  const mainContent = document.getElementById('page-content-container');

  if (navigation && navigation.classList.contains('active')) {
    navigation.classList.remove('active');

    if (window.innerWidth <= 768 && mobileToggle) {
      mobileToggle.classList.remove('active');
    } else {
      document.body.classList.remove('nav-expanded');
      localStorage.setItem('sideNavExpanded', 'false');
    }

    // 如果不支援 Container Query，手動觸發寬度檢查
    if (!supportsContainerQuery() && mainContent) {
      setTimeout(() => {
        updateContentResponsiveClasses(mainContent.offsetWidth);
      }, 550);
    }
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