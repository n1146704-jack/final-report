document.addEventListener('DOMContentLoaded', function () {
    // =========================================
    // 導航選單功能
    // =========================================
    const nav = document.querySelector('.page-nav');
    const toggleBtn = document.querySelector('.page-nav__toggle');
    const backdrop = document.querySelector('.page-nav__backdrop');
    const navLinks = document.querySelectorAll('.page-nav__link');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            // 切換 .is-active class
            nav.classList.toggle('is-active');

            // 更新屬性
            const isActive = nav.classList.contains('is-active');
            toggleBtn.setAttribute('aria-expanded', isActive);
        });
    }

    // 點擊遮罩層也會關閉選單
    if (backdrop) {
        backdrop.addEventListener('click', function () {
            nav.classList.remove('is-active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // 點擊導航連結後關閉選單
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            nav.classList.remove('is-active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // =========================================
    // 平滑滾動功能
    // =========================================
    const scrollLinks = document.querySelectorAll('.scroll-link');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // 只處理錨點連結
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerHeight = document.querySelector('#page-header-container').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // =========================================
    // 統計數字動畫
    // =========================================
    const statNumbers = document.querySelectorAll('.stat-card__number');
    let hasAnimated = false;

    function animateNumbers() {
        if (hasAnimated) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    hasAnimated = true;

                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        const duration = 2000; // 動畫持續時間(毫秒)
                        const increment = target / (duration / 16); // 每幀增加的數值
                        let current = 0;

                        const updateNumber = () => {
                            current += increment;
                            if (current < target) {
                                stat.textContent = Math.floor(current);
                                requestAnimationFrame(updateNumber);
                            } else {
                                stat.textContent = target;
                            }
                        };

                        updateNumber();
                    });

                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateNumbers();

    // =========================================
    // 技能篩選功能
    // =========================================
    const skillFilters = document.querySelectorAll('.skill-filter');
    const skillTags = document.querySelectorAll('.skill-tag[data-category]');

    skillFilters.forEach(filter => {
        filter.addEventListener('click', function () {
            // 移除所有 active 類別
            skillFilters.forEach(f => f.classList.remove('active'));

            // 添加 active 到當前按鈕
            this.classList.add('active');

            // 獲取篩選類別
            const filterValue = this.getAttribute('data-filter');

            // 顯示/隱藏技能標籤
            skillTags.forEach(tag => {
                const category = tag.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    tag.classList.remove('hidden');
                    // 添加淡入動畫
                    tag.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    tag.classList.add('hidden');
                }
            });
        });
    });

    // =========================================
    // 返回頂部按鈕
    // =========================================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // 監聽滾動事件
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // 點擊返回頂部
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========================================
    // 聯絡表單驗證與提交
    // =========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');

        // 即時驗證
        formInputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                // 清除錯誤狀態
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorSpan = this.parentElement.querySelector('.form-error');
                    if (errorSpan) {
                        errorSpan.textContent = '';
                    }
                }
            });
        });

        // 表單提交
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;

            // 驗證所有欄位
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // 模擬表單提交
                const submitBtn = contactForm.querySelector('.form-submit');
                const originalText = submitBtn.innerHTML;

                submitBtn.innerHTML = '<span class="form-submit__icon">⏳</span>傳送中...';
                submitBtn.disabled = true;

                // 模擬 API 請求
                setTimeout(() => {
                    submitBtn.innerHTML = '<span class="form-submit__icon">✓</span>傳送成功!';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

                    // 重置表單
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;

                        alert('感謝您的訊息!我會盡快回覆您。');
                    }, 2000);
                }, 1500);
            }
        });
    }

    // 驗證欄位函數
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        const errorSpan = field.parentElement.querySelector('.form-error');
        let errorMessage = '';

        // 必填欄位驗證
        if (field.hasAttribute('required') && value === '') {
            errorMessage = '此欄位為必填';
        }
        // Email 格式驗證
        else if (fieldName === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = '請輸入有效的 Email 地址';
            }
        }
        // 姓名長度驗證
        else if (fieldName === 'name' && value !== '' && value.length < 2) {
            errorMessage = '姓名至少需要 2 個字元';
        }
        // 訊息長度驗證
        else if (fieldName === 'message' && value !== '' && value.length < 10) {
            errorMessage = '訊息內容至少需要 10 個字元';
        }

        if (errorMessage) {
            field.classList.add('error');
            if (errorSpan) {
                errorSpan.textContent = errorMessage;
            }
            return false;
        } else {
            field.classList.remove('error');
            if (errorSpan) {
                errorSpan.textContent = '';
            }
            return true;
        }
    }

    // =========================================
    // 滾動動畫觸發
    // =========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 觀察需要動畫的元素
    const animatedElements = document.querySelectorAll('.service-card, .navigation-card, .project-card, .testimonial-card, .timeline-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // =========================================
    // 專案卡片懸浮效果增強
    // =========================================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // =========================================
    // 技能標籤互動效果
    // =========================================
    skillTags.forEach(tag => {
        tag.addEventListener('click', function () {
            // 添加點擊動畫效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // =========================================
    // 載入完成後顯示內容
    // =========================================
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    console.log('🎉 履歷網站已完全載入!');
});