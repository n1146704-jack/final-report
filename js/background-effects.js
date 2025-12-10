// background-effects.js

/**
 * 裝飾動畫管理器
 */
class DecorationManager {
  constructor() {
    this.container = document.getElementById('decorations-container');
    this.isRunning = false;
    this.spawnInterval = null;
    this.decorationTypes = ['bubble', 'glass', 'balloon'];

    // 彩色氣球的顏色選項
    this.balloonColors = [
      'hsla(0, 80%, 65%, 0.8)',
      'hsla(30, 90%, 60%, 0.8)',
      'hsla(60, 85%, 55%, 0.8)',
      'hsla(120, 60%, 55%, 0.8)',
      'hsla(200, 80%, 60%, 0.8)',
      'hsla(280, 70%, 65%, 0.8)',
      'hsla(320, 75%, 65%, 0.8)',
    ];

    // 配置選項
    this.config = {
      minSpawnDelay: 800,
      maxSpawnDelay: 2000,
      minSize: 20,
      maxSize: 60,
      minDuration: 8,
      maxDuration: 15,
      maxDecorations: 15,
    };
  }

  /**
   * 初始化並開始動畫
   */
  init() {
    if (!this.container) {
      console.error('找不到裝飾容器');
      return;
    }

    this.start();

    // 監聽頁面可見性變化，節省效能
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  /**
   * 開始生成裝飾
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleNextSpawn();
  }

  /**
   * 暫停生成
   */
  pause() {
    this.isRunning = false;
    if (this.spawnInterval) {
      clearTimeout(this.spawnInterval);
      this.spawnInterval = null;
    }
  }

  /**
   * 恢復生成
   */
  resume() {
    if (!this.isRunning) {
      this.start();
    }
  }

  /**
   * 排程下一次生成
   */
  scheduleNextSpawn() {
    if (!this.isRunning) return;

    const delay = this.randomBetween(
      this.config.minSpawnDelay,
      this.config.maxSpawnDelay
    );

    this.spawnInterval = setTimeout(() => {
      this.spawnDecoration();
      this.scheduleNextSpawn();
    }, delay);
  }

  /**
   * 生成一個裝飾元素
   */
  spawnDecoration() {
    // 檢查是否超過最大數量
    const currentCount = this.container.querySelectorAll('.floating-decoration').length;
    if (currentCount >= this.config.maxDecorations) return;

    const decoration = document.createElement('div');
    decoration.className = 'floating-decoration';

    // 隨機選擇類型
    const type = this.decorationTypes[
      Math.floor(Math.random() * this.decorationTypes.length)
    ];
    decoration.classList.add(`decoration-${type}`);

    // 隨機尺寸
    const size = this.randomBetween(this.config.minSize, this.config.maxSize);
    decoration.style.width = `${size}px`;
    decoration.style.height = `${size}px`;

    // 隨機水平位置
    const leftPos = this.randomBetween(5, 95);
    decoration.style.left = `${leftPos}%`;

    // 從底部開始
    decoration.style.bottom = `-${size}px`;

    // 隨機動畫時長
    const duration = this.randomBetween(
      this.config.minDuration,
      this.config.maxDuration
    );

    // 隨機選擇動畫類型（直線上升或搖擺）
    const animationType = Math.random() > 0.5 ? 'floatUp' : 'floatUpSway';
    decoration.style.animation = `${animationType} ${duration}s linear forwards`;

    // 如果是氣球，添加隨機顏色
    if (type === 'balloon') {
      const color = this.balloonColors[
        Math.floor(Math.random() * this.balloonColors.length)
      ];
      decoration.style.background = color;
      decoration.style.borderTopColor = color;
    }

    // 添加到容器
    this.container.appendChild(decoration);

    // 動畫結束後移除元素
    decoration.addEventListener('animationend', () => {
      decoration.remove();
    });
  }

  /**
   * 生成範圍內隨機數
   */
  randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
}

// 頁面載入後初始化
document.addEventListener('DOMContentLoaded', () => {
  const decorationManager = new DecorationManager();
  decorationManager.init();
});