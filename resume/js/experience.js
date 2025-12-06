/**
 * 監聽 'scroll' 事件,根據滾動距離在 <body> 上添加或移除 'nav-scrolled' 類別
 */
document.addEventListener("DOMContentLoaded", function () {

  const body = document.body;
  const nav = document.querySelector('.archer-nav');

  function isMobileView() {
    return window.innerWidth <= 970;
  }

  if (isMobileView()) {
    body.classList.add('nav-scrolled');
  }

  window.addEventListener("scroll", function () {
    if (isMobileView()) {
      body.classList.add('nav-scrolled');
      return;
    }

    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (scrollY > 15) {
      body.classList.add("nav-scrolled");
    } else {
      body.classList.remove("nav-scrolled");
    }
  });

  window.addEventListener("resize", function () {
    if (isMobileView()) {
      body.classList.add('nav-scrolled');
    } else {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY <= 15) {
        body.classList.remove('nav-scrolled');
      }
    }
  });

  // --- 工作經歷時間軸滾動動畫邏輯 ---
  const timelineItems = document.querySelectorAll('.timeline__item');

  if (timelineItems.length > 0) {

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        // 當項目進入視窗
        if (entry.isIntersecting) {
          // 為 .timeline__item 添加 'is-visible' 類別
          entry.target.classList.add('is-visible');

          // 觸發後即停止觀察此項目,避免重複觸發
          observer.unobserve(entry.target);
        }
      });
    };

    // 建立觀察者
    const timelineObserver = new IntersectionObserver(observerCallback, observerOptions);

    // 令觀察者開始觀察所有 .timeline__item
    timelineItems.forEach(item => {
      timelineObserver.observe(item);
    });
  }

  // --- 技能進度條動畫 ---
  const skillItems = document.querySelectorAll('.skill-item');

  if (skillItems.length > 0) {
    const skillObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const skillObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const skillObserver = new IntersectionObserver(skillObserverCallback, skillObserverOptions);

    skillItems.forEach(item => {
      skillObserver.observe(item);
    });
  }

  // --- 統計數字動畫 (新增) ---
  const statCards = document.querySelectorAll('.stat-card');

  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value + (end > 50 ? '+' : '');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end + (end > 50 ? '+' : '');
      }
    };
    window.requestAnimationFrame(step);
  }

  if (statCards.length > 0) {
    const statsObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    let hasAnimated = false;

    const statsObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;

          statCards.forEach(card => {
            const valueElement = card.querySelector('.stat-card__value');
            const targetValue = parseInt(valueElement.getAttribute('data-target'));
            animateValue(valueElement, 0, targetValue, 3000);
          });

          observer.disconnect();
        }
      });
    };

    const statsObserver = new IntersectionObserver(statsObserverCallback, statsObserverOptions);

    const statsSection = document.querySelector('.skills-stats-section');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }

  // --- 卡片懸浮效果增強 (新增) ---
  const interactiveCards = document.querySelectorAll('.project-card, .education-card, .certifications-card, .testimonial-card, .article-card');

  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.3s ease';
    });
  });

  // --- 平滑滾動到頂部按鈕 (新增) ---
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

  document.body.appendChild(scrollToTopBtn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
    }
  });

  scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  scrollToTopBtn.addEventListener('mouseenter', function () {
    this.style.transform = 'scale(1.1)';
  });

  scrollToTopBtn.addEventListener('mouseleave', function () {
    this.style.transform = 'scale(1)';
  });

  // --- 頁面載入動畫 (新增) ---
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);

  // --- 技術標籤點擊效果 (新增) ---
  const techTags = document.querySelectorAll('.tech-tag');

  techTags.forEach(tag => {
    tag.addEventListener('click', function () {
      // 創建漣漪效果
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        width: 20px;
        height: 20px;
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // 添加漣漪動畫的 CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

});