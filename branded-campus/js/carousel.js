/**
 * 輪播圖 (Carousel) 模組
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 選取 DOM 元素 ---
    const carouselSection = document.querySelector('.carouse-section');

    if (!carouselSection) {
        return;
    }

    const slidesContainer = carouselSection.querySelector('.carousel-slides');
    const slides = carouselSection.querySelectorAll('.carousel-slide');
    const prevButton = carouselSection.querySelector('.carousel-btn--prev');
    const nextButton = carouselSection.querySelector('.carousel-btn--next');
    const dotsContainer = carouselSection.querySelector('.carousel-dots');

    if (!slidesContainer || slides.length === 0 || !prevButton || !nextButton || !dotsContainer) {
        console.warn('輪播圖缺少必要的 HTML 結構 (slides, buttons, dots)。');
        return;
    }

    // --- 狀態變數 ---
    let currentSlide = 0;
    const maxSlide = slides.length - 1;
    let autoPlayTimer;

    // --- 核心功能函數 ---

    /**
     * 移動到指定的幻燈片
     * @param {number} slideIndex - 要移動到的幻燈片索引 (0-based)
     */
    const goToSlide = (slideIndex) => {
        // 移動幻燈片軌道
        slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;

        // 更新導覽點 (Dots) 的 'active' 狀態
        dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.classList.remove('carousel-dot--active');
        });
        // 確保對應的 dot 存在
        const activeDot = dotsContainer.querySelector(`.carousel-dot[data-slide="${slideIndex}"]`);
        if (activeDot) {
            activeDot.classList.add('carousel-dot--active');
        }

        // 更新當前索引
        currentSlide = slideIndex;
    };

    /**
     * 顯示下一張 (具備循環功能)
     */
    const nextSlide = () => {
        let nextIndex = currentSlide + 1;
        if (nextIndex > maxSlide) {
            nextIndex = 0;
        }
        goToSlide(nextIndex);
    };

    /**
     * 顯示上一張 (具備循環功能)
     */
    const prevSlide = () => {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = maxSlide;
        }
        goToSlide(prevIndex);
    };

    /**
     * 啟動自動播放
     */
    const startAutoPlay = (interval = 5000) => {
        // 防止重複觸發
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, interval);
    };

    /**
     * 停止自動播放
     */
    const stopAutoPlay = () => {
        clearInterval(autoPlayTimer);
    };

    // --- 初始化 ---

    // 動態生成導覽點 (Dots)
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('data-slide', index);
        dot.setAttribute('aria-label', `跳至幻燈片 ${index + 1}`);

        if (index === 0) {
            dot.classList.add('carousel-dot--active');
        }
        dotsContainer.appendChild(dot);
    });

    // 綁定事件監聽

    // 上/下頁按鈕
    prevButton.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
    });

    // 綁定事件
    dotsContainer.addEventListener('click', (e) => {
        // 確保點擊的是 .carousel-dot
        const targetDot = e.target.closest('.carousel-dot');
        if (!targetDot) return;

        const slideIndex = parseInt(targetDot.dataset.slide, 10);
        goToSlide(slideIndex);
        startAutoPlay();
    });

    // 滑鼠懸停時停止播放
    carouselSection.addEventListener('mouseenter', stopAutoPlay);
    carouselSection.addEventListener('mouseleave', () => startAutoPlay());

    // 立即開始自動播放
    startAutoPlay(5000);
});