/**
 * main.js - 主要互動功能
 */
document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // 導航列功能
    // ========================================
    const initNavigation = () => {
        console.log('🚀 導航列開始初始化...');

        // === 選取元素 ===
        const navItems = document.querySelectorAll('.sliding-nav__item');
        const indicator = document.querySelector('.sliding-nav__indicator');
        const navList = document.querySelector('.sliding-nav__list');

        console.log('📋 找到的導航項目數量:', navItems.length);
        console.log('📊 指示器元素:', indicator ? '✅ 找到' : '❌ 未找到');
        console.log('📜 導航列表元素:', navList ? '✅ 找到' : '❌ 未找到');

        if (!navItems.length || !indicator || !navList) {
            console.error('❌ 滑動導航元素未找到，停止初始化');
            return;
        }

        // === 下拉選單相關元素 ===
        const dropdownItems = document.querySelectorAll('.sliding-nav__item.has-dropdown');
        console.log('🔽 下拉選單項目數量:', dropdownItems.length);

        /**
         * 計算並移動指示器到指定項目
         */
        const moveIndicator = (targetItem) => {
            navItems.forEach(item => item.classList.remove('active'));
            targetItem.classList.add('active');

            const targetIndex = Array.from(navItems).indexOf(targetItem);
            const itemWidth = navList.offsetWidth / navItems.length;
            const targetPosition = targetIndex * itemWidth;

            indicator.style.transform = `translateX(${targetPosition}px)`;
            indicator.style.width = `${itemWidth}px`;
        };

        /**
         * 初始化指示器位置
         */
        const initIndicator = () => {
            const activeItem = document.querySelector('.sliding-nav__item.active') || navItems[0];
            const itemWidth = navList.offsetWidth / navItems.length;
            indicator.style.width = `${itemWidth}px`;
            moveIndicator(activeItem);
        };

        // === 處理下拉選單 ===
        dropdownItems.forEach((dropdownItem, index) => {
            console.log(`🔽 設置第 ${index + 1} 個下拉選單`);

            const toggle = dropdownItem.querySelector('.dropdown-toggle');
            const menu = dropdownItem.querySelector('.dropdown-menu');

            if (!toggle || !menu) {
                console.warn(`⚠️ 下拉選單 ${index + 1} 缺少必要元素`);
                return;
            }

            // 點擊切換下拉選單
            const handleToggle = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isCurrentlyOpen = dropdownItem.classList.contains('open');

                // 先關閉所有下拉選單
                dropdownItems.forEach(item => {
                    item.classList.remove('open');
                });

                // 打開選中的選單
                if (!isCurrentlyOpen) {
                    dropdownItem.classList.add('open');

                    // 手機版：計算 fixed 位置
                    if (window.innerWidth <= 768) {
                        const rect = toggle.getBoundingClientRect();
                        const menuRect = menu.getBoundingClientRect();

                        // 計算選單應該顯示的位置
                        const topPosition = rect.bottom + window.scrollY;
                        const leftPosition = rect.left + rect.width / 2 - menuRect.width / 2;

                        menu.style.position = 'fixed';
                        menu.style.top = topPosition + 'px';
                        menu.style.left = leftPosition + 'px';
                        menu.style.transform = 'none';
                    } else {
                        // 桌面版：回復 absolute 定位
                        menu.style.position = 'absolute';
                        menu.style.top = '100%';
                        menu.style.left = '50%';
                        menu.style.transform = 'translateX(-50%)';
                    }
                }
            };

            // 綁定點擊和觸控事件
            toggle.addEventListener('click', handleToggle);
            toggle.addEventListener('touchend', handleToggle);

            // 下拉選單內的連結
            const dropdownLinks = menu.querySelectorAll('a');
            dropdownLinks.forEach((link, linkIndex) => {
                link.addEventListener('click', (e) => {
                    console.log(`🔗 點擊下拉選單連結 ${linkIndex + 1}: ${link.textContent}`);
                    // 允許正常導向，只關閉選單
                    dropdownItem.classList.remove('open');
                });
            });
        });

        // === 點擊外部關閉所有下拉選單 ===
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.sliding-nav__item.has-dropdown')) {
                console.log('🌍 點擊導航外部，關閉所有下拉選單');
                dropdownItems.forEach(item => {
                    item.classList.remove('open');
                });
            }
        });

        // === 處理一般導航項目點擊 ===
        navItems.forEach((item, index) => {
            // 跳過下拉選單項目（已經單獨處理）
            if (item.classList.contains('has-dropdown')) {
                return;
            }

            const link = item.querySelector('a');
            if (!link) return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`📍 點擊導航項目 ${index + 1}: ${link.textContent}`);

                moveIndicator(item);

                // 處理錨點滾動
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        const header = document.querySelector('#page-header-container');
                        const headerHeight = header ? header.offsetHeight : 0;
                        const targetPosition = targetSection.offsetTop - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // === 視窗大小變化 ===
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                console.log('📐 視窗大小改變，重新計算指示器位置');
                initIndicator();
            }, 250);
        });

        // === 根據滾動位置更新 active 狀態 ===
        const updateActiveOnScroll = () => {
            const header = document.querySelector('#page-header-container');
            const headerHeight = header ? header.offsetHeight : 0;
            const scrollPosition = window.scrollY + headerHeight + 100;

            const sections = [];
            navItems.forEach(item => {
                // 跳過下拉選單項目
                if (item.classList.contains('has-dropdown')) return;

                const link = item.querySelector('a');
                if (link) {
                    const targetId = link.getAttribute('href');
                    if (targetId && targetId.startsWith('#')) {
                        const section = document.querySelector(targetId);
                        if (section) {
                            sections.push({
                                item: item,
                                section: section,
                                top: section.offsetTop
                            });
                        }
                    }
                }
            });

            let currentSection = null;
            for (let i = sections.length - 1; i >= 0; i--) {
                if (scrollPosition >= sections[i].top) {
                    currentSection = sections[i];
                    break;
                }
            }

            if (currentSection && !currentSection.item.classList.contains('active')) {
                moveIndicator(currentSection.item);
            }
        };

        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateActiveOnScroll, 100);
        });

        // === 初始化 ===
        initIndicator();
        console.log('✅ 導航列初始化完成');
    };

    // ========================================
    // 新聞分類篩選功能
    // ========================================
    const initNewsFilter = () => {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const newsItems = document.querySelectorAll('.news-item');

        if (!tabButtons.length || !newsItems.length) {
            return;
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;

                // 更新按鈕狀態
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // 篩選新聞項目
                newsItems.forEach(item => {
                    const itemCategory = item.dataset.category;

                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'flex';
                        // 添加淡入動畫
                        item.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    };

    // ========================================
    // 統計數字動畫效果
    // ========================================
    const initStatsAnimation = () => {
        const statValues = document.querySelectorAll('.stat-item__value');

        if (!statValues.length) {
            return;
        }

        const animateValue = (element, start, end, duration) => {
            const range = end - start;
            const increment = range / (duration / 16); // 60fps
            let current = start;
            const isPercentage = element.textContent.includes('%');
            const hasPlus = element.textContent.includes('+');

            const timer = setInterval(() => {
                current += increment;
                if (current >= end) {
                    current = end;
                    clearInterval(timer);
                }

                const formattedValue = Math.floor(current).toLocaleString();
                element.textContent = formattedValue + (hasPlus ? '+' : '') + (isPercentage ? '%' : '');
            }, 16);
        };

        // 使用 Intersection Observer 在元素可見時觸發動畫
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    const element = entry.target;
                    const text = element.textContent;
                    const value = parseInt(text.replace(/[^0-9]/g, ''));

                    if (!isNaN(value)) {
                        element.dataset.animated = 'true';
                        animateValue(element, 0, value, 2000);
                    }
                }
            });
        }, { threshold: 0.5 });

        statValues.forEach(stat => observer.observe(stat));
    };

    // ========================================
    // 平滑滾動到頂部按鈕
    // ========================================
    const initScrollToTop = () => {
        // 創建按鈕
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', '回到頂部');
        document.body.appendChild(scrollBtn);

        // 添加樣式
        const style = document.createElement('style');
        style.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 50px;
                height: 50px;
                background: var(--color-primary);
                color: var(--color-white);
                border: none;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
            }

            .scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
            }

            .scroll-to-top:hover {
                background: var(--color-secondary);
                transform: translateY(-5px);
            }

            @media (max-width: 768px) {
                .scroll-to-top {
                    width: 45px;
                    height: 45px;
                    bottom: 1.5rem;
                    right: 1.5rem;
                    font-size: 1.3rem;
                }
            }
        `;
        document.head.appendChild(style);

        // 顯示/隱藏按鈕
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        // 點擊滾動到頂部
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // ========================================
    // 搜尋功能 (簡易版)
    // ========================================
    const initSearch = () => {
        const searchBtn = document.querySelector('.search-btn');

        if (!searchBtn) {
            return;
        }

        searchBtn.addEventListener('click', () => {
            const query = prompt('請輸入搜尋關鍵字:');

            if (query && query.trim()) {
                // 這裡可以實作實際的搜尋功能
                // 目前只是示例,顯示警告訊息
                alert(`搜尋功能開發中...\n您搜尋的關鍵字:${query}`);
            }
        });
    };

    // ========================================
    // 活動卡片懸停效果
    // ========================================
    const initEventCardEffects = () => {
        const eventCards = document.querySelectorAll('.event-card');

        eventCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.3s ease';
            });
        });
    };

    // ========================================
    // 學院卡片點擊統計
    // ========================================
    const initCollegeCardTracking = () => {
        const collegeCards = document.querySelectorAll('.college-card');

        collegeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const collegeTitle = card.querySelector('.college-card__title').textContent;
                console.log(`用戶點擊了:${collegeTitle}`);
            });
        });
    };

    // ========================================
    // 添加淡入動畫的 CSS
    // ========================================
    const addAnimationStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .content-section {
                animation: fadeIn 0.6s ease;
            }

            .sidebar-card {
                animation: slideInRight 0.6s ease;
            }

            .sidebar-card:nth-child(2) {
                animation-delay: 0.1s;
            }

            .sidebar-card:nth-child(3) {
                animation-delay: 0.2s;
            }
        `;
        document.head.appendChild(style);
    };

    // ========================================
    // 初始化所有功能
    // ========================================
    initNavigation();
    initNewsFilter();
    initStatsAnimation();
    initScrollToTop();
    initSearch();
    initEventCardEffects();
    initCollegeCardTracking();
    addAnimationStyles();
});