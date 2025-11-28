/**
 * admissions-tabs.js
 */
document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // 分頁功能
    // ========================================
    const tabsNav = document.querySelector('.tabs-nav');

    if (tabsNav) {
        const tabContents = document.querySelectorAll('.tab-content');
        const tabButtons = tabsNav.querySelectorAll('.tab-button');

        // 綁定點擊事件
        tabsNav.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.tab-button');
            if (!clickedButton) return;

            // 獲取目標 tab ID
            const targetId = clickedButton.dataset.tab;

            // 移除所有按鈕的 active 狀態
            tabButtons.forEach(btn => {
                btn.classList.remove('tab-button--active');
            });

            // 隱藏所有內容區塊
            tabContents.forEach(content => {
                content.classList.remove('tab-content--active');
            });

            // 啟用被點擊的按鈕
            clickedButton.classList.add('tab-button--active');

            // 顯示目標內容區塊
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('tab-content--active');
            }
        });
    }

    // ========================================
    // 手機選單切換
    // ========================================
    const mobileToggle = document.querySelector('.navbar-mobile-toggle');
    const mobileMenu = document.querySelector('.navbar-mobile-menu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('navbar-mobile-menu--open');

            // 改變按鈕圖標
            if (mobileMenu.classList.contains('navbar-mobile-menu--open')) {
                mobileToggle.textContent = '✕';
            } else {
                mobileToggle.textContent = '☰';
            }
        });

        // 點擊選單項目後關閉選單
        const mobileLinks = mobileMenu.querySelectorAll('.navbar-menu__link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('navbar-mobile-menu--open');
                mobileToggle.textContent = '☰';
            });
        });

        // 點擊外部區域關閉選單
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('navbar-mobile-menu--open');
                mobileToggle.textContent = '☰';
            }
        });
    }

    // ========================================
    // 平滑捲動到錨點
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // 忽略 # 本身
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navbarHeight = document.querySelector('.admissions-navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // 關閉手機選單 (如果開啟的話)
                if (mobileMenu) {
                    mobileMenu.classList.remove('navbar-mobile-menu--open');
                    if (mobileToggle) mobileToggle.textContent = '☰';
                }
            }
        });
    });

    // ========================================
    // Navbar 捲動效果
    // ========================================
    const navbar = document.querySelector('.admissions-navbar');
    let lastScrollTop = 0;

    if (navbar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // 向下捲動時增加陰影
            if (scrollTop > 10) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }

            lastScrollTop = scrollTop;
        });
    }

    // ========================================
    // 表單驗證與提交
    // ========================================
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 取得表單資料
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // 簡單驗證
            if (!data.name || !data.email || !data.subject || !data.message) {
                alert('請填寫所有必填欄位!');
                return;
            }

            // 驗證 email 格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('請輸入有效的電子信箱!');
                return;
            }

            // 模擬送出 (實際應用中應該發送到後端)
            console.log('表單資料:', data);

            // 顯示成功訊息
            alert('感謝您的諮詢!我們會盡快回覆您。');

            // 重置表單
            contactForm.reset();
        });
    }

    // ========================================
    // Q&A 項目動畫
    // ========================================
    const qaItems = document.querySelectorAll('.qa-item');

    qaItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                // 可選:關閉其他開啟的項目
                // qaItems.forEach(otherItem => {
                //     if (otherItem !== item && otherItem.open) {
                //         otherItem.open = false;
                //     }
                // });
            }
        });
    });

    // ========================================
    // Scroll Reveal 動畫
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 觀察所有 admissions-block
    document.querySelectorAll('.admissions-block').forEach(block => {
        block.classList.add('reveal');
        observer.observe(block);
    });

    // ========================================
    // 返回頂部按鈕
    // ========================================
    const createBackToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'back-to-top';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #003366, #0055a5);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 999;
        `;

        document.body.appendChild(button);

        // 顯示/隱藏按鈕
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });

        // 點擊返回頂部
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover 效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-5px)';
            button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
    };

    createBackToTopButton();

    // ========================================
    // 統計數字動畫
    // ========================================
    const animateNumber = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    };

    // 觀察統計數字
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target;
                const targetText = numberElement.textContent.trim();
                const targetNumber = parseInt(targetText.replace(/,/g, '').replace(/[^0-9]/g, ''));

                if (!isNaN(targetNumber)) {
                    animateNumber(numberElement, targetNumber);
                }

                statsObserver.unobserve(numberElement);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item__number').forEach(stat => {
        statsObserver.observe(stat);
    });

    // ========================================
    // 下載卡片互動效果
    // ========================================
    const downloadCards = document.querySelectorAll('.download-card');

    downloadCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // 如果點擊的不是下載按鈕,則觸發下載按鈕
            if (!e.target.classList.contains('btn--download')) {
                const downloadBtn = card.querySelector('.btn--download');
                if (downloadBtn) {
                    downloadBtn.click();
                }
            }
        });
    });
});