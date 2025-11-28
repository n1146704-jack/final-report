// card-3d.js

/**
 * 卡片 3D 效果管理器
 */
class Card3DEffect {
    constructor() {
        this.cards = [];
        this.config = {
            maxRotation: 15,
            perspective: 1000,
            transitionDuration: 0.1,
            glowIntensity: 0.4,
            scale: 1.02,
        };
    }

    /**
     * 初始化
     */
    init() {
        const cardWrappers = document.querySelectorAll('.card-wrapper');

        cardWrappers.forEach(wrapper => {
            const card = wrapper.querySelector('.card');
            const glow = wrapper.querySelector('.card-glow');

            if (!card) return;

            // 儲存卡片資訊
            const cardData = { wrapper, card, glow };
            this.cards.push(cardData);

            // 綁定事件
            this.bindEvents(cardData);
        });
    }

    /**
     * 綁定事件處理器
     */
    bindEvents(cardData) {
        const { wrapper, card, glow } = cardData;

        // 滑鼠進入
        wrapper.addEventListener('mouseenter', (e) => {
            this.onMouseEnter(cardData, e);
        });

        // 滑鼠移動
        wrapper.addEventListener('mousemove', (e) => {
            this.onMouseMove(cardData, e);
        });

        // 滑鼠離開
        wrapper.addEventListener('mouseleave', (e) => {
            this.onMouseLeave(cardData, e);
        });

        // 觸控支援
        wrapper.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                this.onMouseMove(cardData, {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            }
        });

        wrapper.addEventListener('touchend', () => {
            this.onMouseLeave(cardData);
        });
    }

    /**
     * 滑鼠進入處理
     */
    onMouseEnter(cardData) {
        const { card, glow } = cardData;

        card.style.transition = `transform ${this.config.transitionDuration}s ease-out`;

        if (glow) {
            glow.style.opacity = this.config.glowIntensity;
        }
    }

    /**
     * 滑鼠移動處理 - 計算 3D 旋轉
     */
    onMouseMove(cardData, e) {
        const { wrapper, card, glow } = cardData;
        const rect = wrapper.getBoundingClientRect();

        // 計算滑鼠在卡片上的相對位置 (-0.5 到 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // 計算旋轉角度
        const rotateY = x * this.config.maxRotation;
        const rotateX = -y * this.config.maxRotation;

        // 套用 3D 變換
        card.style.transform = `
            perspective(${this.config.perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(${this.config.scale}, ${this.config.scale}, ${this.config.scale})
        `;

        // 更新光暈位置
        if (glow) {
            const glowX = (x + 0.5) * 100;
            const glowY = (y + 0.5) * 100;
            glow.style.background = `
                radial-gradient(
                    circle at ${glowX}% ${glowY}%,
                    rgba(255, 255, 255, 0.3) 0%,
                    rgba(255, 255, 255, 0.1) 30%,
                    transparent 60%
                )
            `;
        }
    }

    /**
     * 滑鼠離開處理 - 重置狀態
     */
    onMouseLeave(cardData) {
        const { card, glow } = cardData;

        card.style.transition = 'transform 0.5s ease-out';
        card.style.transform = `
            perspective(${this.config.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;

        if (glow) {
            glow.style.opacity = '0';
        }
    }
}

// 頁面載入後初始化
document.addEventListener('DOMContentLoaded', () => {
    const card3D = new Card3DEffect();
    card3D.init();
});