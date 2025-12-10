/* 
 * =========================================
 * about-me.js
 * =========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // 導航列切換功能
  // =========================================
  initNavbarToggle();

  // =========================================
  // 深色模式切換
  // =========================================
  initThemeToggle();

  // =========================================
  // 技能篩選器
  // =========================================
  initSkillFilter();

  // =========================================
  // 專案分類篩選
  // =========================================
  initProjectFilter();

  // =========================================
  // 捲動動畫
  // =========================================
  initScrollAnimation();

  // =========================================
  // 技能進度條動畫
  // =========================================
  initSkillProgressAnimation();

  // =========================================
  // 返回頂部按鈕
  // =========================================
  initBackToTop();

  // =========================================
  // 頁面載入淡入效果
  // =========================================
  initPageFadeIn();
});

/**
 * 導航列切換功能
 */
function initNavbarToggle() {
  const headerContainer = document.getElementById('page-header-container');
  const toggleButton = document.querySelector('.page-nav__toggle');

  if (!headerContainer || !toggleButton) {
    console.warn('無法找到導航列切換元件');
    return;
  }

  toggleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    headerContainer.classList.toggle('menu-expanded');
    const isExpanded = headerContainer.classList.contains('menu-expanded');
    toggleButton.setAttribute('aria-expanded', isExpanded);
  });

  // 點擊外部區域關閉選單
  document.addEventListener('click', (e) => {
    if (!headerContainer.contains(e.target) && headerContainer.classList.contains('menu-expanded')) {
      headerContainer.classList.remove('menu-expanded');
      toggleButton.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 深色模式切換功能
 */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-toggle__icon');

  if (!themeToggle) {
    console.warn('無法找到深色模式切換按鈕');
    return;
  }

  // 檢查本地儲存的主題設定
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    // 更新圖示
    themeIcon.textContent = isDark ? '☀️' : '🌙';

    // 儲存設定到本地儲存
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

/**
 * 技能篩選器功能
 */
function initSkillFilter() {
  const filterButtons = document.querySelectorAll('.skill-filter__btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (filterButtons.length === 0) {
    return;
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有按鈕的 active 狀態
      filterButtons.forEach(btn => btn.classList.remove('skill-filter__btn--active'));

      // 添加當前按鈕的 active 狀態
      button.classList.add('skill-filter__btn--active');

      // 獲取篩選類別
      const filter = button.getAttribute('data-filter');

      // 篩選技能卡片
      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // 重新觸發進度條動畫
          setTimeout(() => {
            animateSkillBars(card);
          }, 100);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * 專案分類篩選功能
 */
function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.project-filter__btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterButtons.length === 0) {
    return;
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有按鈕的 active 狀態
      filterButtons.forEach(btn => btn.classList.remove('project-filter__btn--active'));

      // 添加當前按鈕的 active 狀態
      button.classList.add('project-filter__btn--active');

      // 獲取篩選類別
      const category = button.getAttribute('data-category');

      // 篩選專案項目
      projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (category === 'all' || itemCategory === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * 捲動動畫功能
 */
function initScrollAnimation() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length === 0) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * 技能進度條動畫功能
 */
function initSkillProgressAnimation() {
  const skillBars = document.querySelectorAll('.skill-progress__bar');

  if (skillBars.length === 0) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');

        if (width) {
          // 設定 CSS 變數
          bar.style.setProperty('--progress-width', `${width}%`);
          // 觸發動畫
          bar.classList.add('animated');
        }

        // 停止觀察已經動畫過的元素
        observer.unobserve(bar);
      }
    });
  }, {
    threshold: 0.5
  });

  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}

/**
 * 為特定卡片的技能進度條添加動畫
 * @param {HTMLElement} card - 技能卡片元素
 */
function animateSkillBars(card) {
  const bars = card.querySelectorAll('.skill-progress__bar');

  bars.forEach(bar => {
    const width = bar.getAttribute('data-width');

    if (width) {
      // 先重置動畫
      bar.classList.remove('animated');
      bar.style.setProperty('--progress-width', '0%');

      // 強制重繪
      void bar.offsetWidth;

      // 重新觸發動畫
      setTimeout(() => {
        bar.style.setProperty('--progress-width', `${width}%`);
        bar.classList.add('animated');
      }, 50);
    }
  });
}

/**
 * 返回頂部按鈕功能
 */
function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');

  if (!backToTopButton) {
    console.warn('無法找到返回頂部按鈕');
    return;
  }

  // 監聽捲動事件
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // 點擊返回頂部
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 頁面載入淡入效果
 */
function initPageFadeIn() {
  // 頁面載入完成後淡入
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
}

/**
 * 限制執行頻率
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

/**
 * 延後執行防抖
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}