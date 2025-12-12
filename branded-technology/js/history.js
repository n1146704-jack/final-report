/* ==========================================
   history.js
   ========================================== */

// ===== Canvas 動態背景動畫 =====
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  class Particle {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.life = 1;
      this.decay = 0.01;
      this.size = Math.random() * 4 + 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.1;
      this.life -= this.decay;
    }

    draw(ctx) {
      ctx.shadowColor = 'rgba(0, 245, 195, 0.8)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgba(0, 245, 195, ${this.life * 0.8})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  let particles = [];

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景網格
    ctx.strokeStyle = 'rgba(0, 245, 195, 0.15)';
    ctx.lineWidth = 1.5;
    const gridSize = 50;

    for (let i = 0; i < canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    for (let i = 0; i < canvas.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // 更新和繪製粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);

      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }

    // 隨機生成粒子
    if (Math.random() < 0.3) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const vx = (Math.random() - 0.5) * 2;
      const vy = (Math.random() - 0.5) * 2;
      particles.push(new Particle(x, y, vx, vy));
    }

    animationId = requestAnimationFrame(animate);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  animate();
}

// ===== 側邊欄快速索引高亮 =====
function initSidebarNavigation() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('section');
  const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 60;
  const scrollOffset = navbarHeight + 30;

  function updateActiveLink() {
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= (sectionTop - scrollOffset)) {
        current = section.getAttribute('id');
      }
    });

    sidebarLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
}

// ===== 平滑滾動到錨點 =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// ===== 卡片進入動畫 =====
function initCardAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.value-card, .timeline-content, .milestone-card, .media-card, .service-card, .product-card, .partner-card').forEach((el) => {
    observer.observe(el);
  });
}

// ===== 計數器動畫(里程碑數字) =====
function animateNumbers() {
  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        const element = entry.target.querySelector('.milestone-number');
        animateNumberCounter(element);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.milestone-card').forEach((el) => {
    observer.observe(el);
  });
}

function animateNumberCounter(element) {
  const finalText = element.textContent;
  const isPercentage = finalText.includes('%');
  const isMoney = finalText.includes('$');
  const isPlus = finalText.includes('+');

  let finalNumber = parseInt(finalText.replace(/\D/g, ''));
  let currentNumber = 0;
  const increment = Math.ceil(finalNumber / 50);
  const duration = 50;

  const interval = setInterval(() => {
    currentNumber += increment;
    if (currentNumber >= finalNumber) {
      currentNumber = finalNumber;
      clearInterval(interval);
    }

    let displayText = currentNumber.toLocaleString();
    if (isMoney) displayText = '$' + displayText;
    if (isPercentage) displayText = displayText + '%';
    if (isPlus) displayText = displayText + '+';

    element.textContent = displayText;
  }, duration);
}

// ===== 表格響應式處理 =====
function initTableResponsive() {
  const table = document.querySelector('table');
  if (!table) return;

  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    table.style.fontSize = '0.85rem';
    document.querySelectorAll('th, td').forEach((cell) => {
      cell.style.padding = '8px';
    });
  }

  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      table.style.fontSize = '0.85rem';
      document.querySelectorAll('th, td').forEach((cell) => {
        cell.style.padding = '8px';
      });
    } else {
      table.style.fontSize = '1rem';
      document.querySelectorAll('th, td').forEach((cell) => {
        cell.style.padding = '12px 15px';
      });
    }
  });
}

// ===== 金屬球懸停效果 =====
function initMetalSphere() {
  const sphere = document.querySelector('.metal-sphere');
  if (!sphere) return;

  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const angleX = (e.clientY - centerY) / 20;
    const angleY = (e.clientX - centerX) / 20;

    if (e.target.closest('.hero-3d-element') || e.target.closest('.metal-sphere')) {
      sphere.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    }
  });

  document.addEventListener('mouseleave', () => {
    sphere.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

// ===== 按鈕活動狀態 =====
function initNavButtons() {
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ===== 成功案例側邊欄互動 =====
function initCasesSidebar() {
  const caseItems = document.querySelectorAll('.case-sidebar-item');
  const modal = document.getElementById('caseModal');
  const modalBody = document.getElementById('caseModalBody');
  const closeBtn = document.querySelector('.case-modal-close');
  const overlay = document.querySelector('.case-modal-overlay');

  // 成功案例數據
  const casesData = {
    case1: {
      icon: '🏢',
      title: '金融科技公司轉型',
      challenge: '該金融科技公司面臨系統效率低下的問題,舊有架構無法支撐業務快速增長的需求,導致處理速度緩慢、用戶體驗不佳。',
      solution: '我們為客戶部署了 CloudSync Pro 企業級雲端同步平台,結合 AI 分析平台,實現了數據的實時同步和智能分析。透過雲端架構的彈性擴展能力,完美解決了性能瓶頸問題。',
      result: '實施後,業務處理速度提升了 300%,系統響應時間從平均 5 秒降至 1.5 秒。同時通過智能化流程優化,運營成本下降了 40%,客戶滿意度提升至 95%。',
      metrics: ['處理速度: +300%', '成本降低: -40%', '滿意度: 95%', '響應時間: -70%']
    },
    case2: {
      icon: '🛒',
      title: '電商平台優化',
      challenge: '電商平台在促銷期間經常面臨系統崩潰問題,峰值流量下系統穩定性嚴重不足,導致大量交易流失和品牌形象受損。',
      solution: '我們為客戶實施了可擴展的雲端架構方案,採用微服務架構和容器化部署,配合自動擴展機制和負載均衡策略,確保系統在高峰期仍能穩定運行。',
      result: '優化後的系統成功支持了 10 倍的流量增長,在雙 11 期間實現零停機時間。頁面加載速度提升 60%,轉化率提升 35%,為客戶創造了顯著的商業價值。',
      metrics: ['流量支持: 10x', '停機時間: 0', '加載速度: +60%', '轉化率: +35%']
    },
    case3: {
      icon: '🏥',
      title: '醫療健康數據管理',
      challenge: '醫療機構需要處理大量敏感的患者數據,對數據安全性、隱私保護和合規性有極高要求,同時需要支持多機構間的安全數據共享。',
      solution: '我們部署了 SecureGuard Platform 全方位安全防護平台,結合專業的醫療合規方案。採用多層加密、權限管理和審計追蹤機制,確保數據安全和隱私保護。',
      result: '成功達成 HIPAA 合規標準,患者隱私得到完全保護。數據訪問效率提升 50%,同時建立了完善的安全審計體系,零安全事故記錄。',
      metrics: ['HIPAA 合規: ✓', '安全事故: 0', '訪問效率: +50%', '隱私保護: 100%']
    },
    case4: {
      icon: '🏭',
      title: '製造業智能化升級',
      challenge: '傳統製造企業面臨生產流程效率低下、缺乏數據分析能力的困境,無法實時監控生產狀況,導致資源浪費和品質問題頻發。',
      solution: '我們部署了 AI 驅動的智能流程優化系統,整合物聯網感測器、機器學習算法和數據分析平台,實現生產過程的智能化監控和優化。',
      result: '實施後產出效率增加 45%,不良率從 8% 下降至 3.2%,下降 60%。能源消耗降低 25%,維護成本減少 30%,為企業帶來顯著的經濟效益和競爭優勢。',
      metrics: ['產出效率: +45%', '不良率: -60%', '能源消耗: -25%', '維護成本: -30%']
    }
  };

  // 點擊案例項目
  caseItems.forEach(item => {
    item.addEventListener('click', () => {
      const caseId = item.dataset.caseId;
      const caseData = casesData[caseId];

      if (caseData) {
        modalBody.innerHTML = `
          <span class="case-icon">${caseData.icon}</span>
          <h2>${caseData.title}</h2>
          <div style="margin-bottom: 24px;">
              <h3 style="color: var(--color-tech-accent-primary); margin-bottom: 8px;">挑戰</h3>
              <p>${caseData.challenge}</p>
          </div>
          <div style="margin-bottom: 24px;">
              <h3 style="color: var(--color-tech-accent-primary); margin-bottom: 8px;">解決方案</h3>
              <p>${caseData.solution}</p>
          </div>
          <div style="margin-bottom: 24px;">
              <h3 style="color: var(--color-tech-accent-primary); margin-bottom: 8px;">成果</h3>
              <p>${caseData.result}</p>
          </div>
          <div>
              <h3 style="color: var(--color-tech-accent-primary); margin-bottom: 12px;">關鍵指標</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                  ${caseData.metrics.map(metric => `
                      <div style="background: var(--color-history-bg-1); padding: 12px; border-radius: 8px; text-align: center; font-weight: 600; font-size: 14px;">
                          ${metric}
                      </div>
                  `).join('')}
              </div>
          </div>
        `;
        modal.classList.add('active');
      }
    });
  });

  // 關閉彈窗
  function closeModal() {
    modal.classList.remove('active');
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // ESC 鍵關閉
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ===== 初始化所有功能 =====
document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initSidebarNavigation();
  initSmoothScroll();
  initCardAnimations();
  animateNumbers();
  initTableResponsive();
  initMetalSphere();
  initNavButtons();
  initCasesSidebar();
});