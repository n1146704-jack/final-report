/**
 * technology.js
 */

// ==========================================
// 粒子背景動畫
// ==========================================
class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 80;
    this.connectionDistance = 150;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 更新和繪製粒子
    this.particles.forEach((particle, i) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 邊界檢測
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // 繪製粒子
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 245, 195, 0.5)';
      this.ctx.fill();

      // 繪製連線
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = particle.x - this.particles[j].x;
        const dy = particle.y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 245, 195, ${1 - distance / this.connectionDistance})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================
// 導航欄功能
// ==========================================
class Navigation {
  constructor() {
    this.header = document.getElementById('page-header-container');
    this.menuToggle = document.getElementById('menuToggle');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.closeMobileMenu = document.getElementById('closeMobileMenu');
    this.navLinks = document.querySelectorAll('.tech-nav__link');
    this.mobileNavLinks = document.querySelectorAll('.tech-mobile-menu__link');
    this.contactNavBtn = document.getElementById('contactNavBtn');
    this.contactMobileBtn = document.getElementById('contactMobileBtn');

    // Dropdown elements
    this.dropdownToggle = document.getElementById('dropdownToggle');
    this.dropdown = document.querySelector('.tech-nav__dropdown');

    this.init();
  }

  init() {
    // 滾動時改變 header 樣式
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());

    // 手機選單切換
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    if (this.closeMobileMenu) {
      this.closeMobileMenu.addEventListener('click', () => this.closeMobileMenuHandler());
    }

    // 點擊選單連結時關閉手機選單
    this.mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // 如果是錨點連結才處理滾動
        if (link.getAttribute('href').startsWith('#')) {
          this.handleNavClick(e);
        }
        this.closeMobileMenuHandler();
      });
    });

    // 桌面版導航連結
    this.navLinks.forEach(link => {
      // 排除下拉按鈕
      if (!link.classList.contains('tech-nav__dropdown-toggle')) {
        link.addEventListener('click', (e) => this.handleNavClick(e));
      }
    });

    // 下拉選單功能
    this.initDropdown();

    // 聯絡按鈕
    if (this.contactNavBtn) {
      this.contactNavBtn.addEventListener('click', () => this.openContactModal());
    }

    if (this.contactMobileBtn) {
      this.contactMobileBtn.addEventListener('click', () => {
        this.openContactModal();
        this.closeMobileMenuHandler();
      });
    }

    // 監聽區塊進入視野
    this.observeSections();
  }

  initDropdown() {
    if (!this.dropdownToggle || !this.dropdown) return;

    // 點擊下拉按鈕
    this.dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // 點擊外部關閉下拉選單
    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });

    // ESC 鍵關閉下拉選單
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });

    // 下拉選單項目點擊後關閉選單
    const dropdownItems = document.querySelectorAll('.tech-nav__dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        this.closeDropdown();
      });
    });
  }

  toggleDropdown() {
    this.dropdown.classList.toggle('active');
  }

  closeDropdown() {
    this.dropdown.classList.remove('active');
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  toggleMobileMenu() {
    this.mobileMenu.classList.toggle('active');
    this.menuToggle.classList.toggle('active');
    document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  closeMobileMenuHandler() {
    this.mobileMenu.classList.remove('active');
    this.menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleNavClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');

    // 確保是錨點連結
    if (!targetId.startsWith('#')) return;

    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // 更新活動狀態
      this.updateActiveLink(e.currentTarget);
    }
  }

  updateActiveLink(activeLink) {
    // 移除所有活動狀態
    this.navLinks.forEach(link => link.classList.remove('tech-nav__link--active'));
    this.mobileNavLinks.forEach(link => link.classList.remove('tech-nav__link--active'));

    // 添加新的活動狀態
    const href = activeLink.getAttribute('href');
    this.navLinks.forEach(link => {
      if (link.getAttribute('href') === href) {
        link.classList.add('tech-nav__link--active');
      }
    });
  }

  observeSections() {
    const sections = document.querySelectorAll('[data-section]');
    const options = {
      root: null,
      rootMargin: '-100px',
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = '#' + entry.target.id;
          const correspondingLink = document.querySelector(`.tech-nav__link[href="${sectionId}"]`);
          if (correspondingLink) {
            this.updateActiveLink(correspondingLink);
          }
        }
      });
    }, options);

    sections.forEach(section => observer.observe(section));
  }

  openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
}

// ==========================================
// 側邊欄功能
// ==========================================
class Sidebar {
  constructor() {
    this.sidebar = document.getElementById('techSidebar');
    this.scrollToTopBtn = document.getElementById('scrollToTop');
    this.themeToggle = document.getElementById('themeToggle');
    this.shareBtn = document.getElementById('shareBtn');
    this.progressBar = document.getElementById('progressBar');

    this.init();
  }

  init() {
    // 返回頂部
    if (this.scrollToTopBtn) {
      this.scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // 主題切換
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // 分享功能
    if (this.shareBtn) {
      this.shareBtn.addEventListener('click', () => this.share());
    }

    // 更新進度條
    window.addEventListener('scroll', () => this.updateProgress());

    // 顯示/隱藏側邊欄
    this.handleSidebarVisibility();
    window.addEventListener('scroll', () => this.handleSidebarVisibility());
  }

  updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;

    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
    }
  }

  handleSidebarVisibility() {
    if (window.scrollY > 300) {
      this.sidebar.classList.remove('hidden');
    } else {
      this.sidebar.classList.add('hidden');
    }
  }

  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  async share() {
    const shareData = {
      title: document.title,
      text: '未來科技有限公司 - 創新科技領航者',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 降級方案：複製連結
        await navigator.clipboard.writeText(window.location.href);
        alert('連結已複製到剪貼簿！');
      }
    } catch (err) {
      console.log('分享失敗:', err);
    }
  }
}

// ==========================================
// 統計數字動畫
// ==========================================
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.tech-stat__number');
    this.init();
  }

  init() {
    const options = {
      root: null,
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          this.animateCounter(entry.target);
          entry.target.classList.add('counted');
        }
      });
    }, options);

    this.counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }
}

// ==========================================
// Modal 功能
// ==========================================
class ModalManager {
  constructor() {
    this.modal = document.getElementById('contactModal');
    this.closeBtn = document.getElementById('closeContactModal');
    this.form = document.getElementById('contactForm');

    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // 點擊背景關閉
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }

    // ESC 鍵關閉
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });

    // 表單提交
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  open() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleSubmit(e) {
    e.preventDefault();

    // 獲取表單資料
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    console.log('表單資料:', data);

    // 這裡可以添加實際的表單提交邏輯
    // 例如：fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })

    alert('感謝您的訊息！我們會盡快回覆您。');
    this.form.reset();
    this.close();
  }
}

// ==========================================
// CTA 按鈕功能
// ==========================================
class CTAButtons {
  constructor() {
    this.exploreCta = document.getElementById('exploreCta');
    this.demoCta = document.getElementById('demoCta');

    this.init();
  }

  init() {
    if (this.exploreCta) {
      this.exploreCta.addEventListener('click', () => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          const headerHeight = document.getElementById('page-header-container').offsetHeight;
          const targetPosition = servicesSection.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    }

    if (this.demoCta) {
      this.demoCta.addEventListener('click', () => {
        const modal = document.getElementById('contactModal');
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    }
  }
}

// ==========================================
// 卡片傾斜效果
// ==========================================
class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll('[data-tilt]');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
      card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
    });
  }

  handleMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  handleMouseLeave(card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  }
}

// ==========================================
// 滾動動畫
// ==========================================
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    this.init();
  }

  init() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, options);

    this.elements.forEach(element => observer.observe(element));
  }
}

// ==========================================
// 初始化所有功能
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // 初始化粒子背景
  new ParticleBackground('particle-canvas');

  // 初始化導航
  new Navigation();

  // 初始化側邊欄
  new Sidebar();

  // 初始化統計數字動畫
  new CounterAnimation();

  // 初始化 Modal
  new ModalManager();

  // 初始化 CTA 按鈕
  new CTAButtons();

  // 初始化卡片傾斜效果
  new TiltEffect();

  // 初始化滾動動畫
  new ScrollAnimations();

  // 載入主題偏好
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);

  // 平滑載入
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});

// ==========================================
// 效能優化：節流函數
// ==========================================
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

// ==========================================
// 效能優化：防抖函數
// ==========================================
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}