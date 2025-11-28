// dark.js - 深色模式切換功能

/**
 * 初始化深色模式功能
 */
function initDarkMode() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sunIcon = document.querySelector('.toggle-icon--sun');
  const moonIcon = document.querySelector('.toggle-icon--moon');

  // 確認按鈕存在
  if (!themeToggleBtn) {
    console.error('找不到深色模式切換按鈕');
    return;
  }

  // 從 localStorage 讀取使用者的主題偏好，預設淺色
  const initialTheme = localStorage.getItem('theme') || 'light';

  // 套用初始主題
  applyTheme(initialTheme);

  // 監聽按鈕點擊事件
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  /**
   * 套用主題樣式
   * @param {string} theme - 'dark' 或 'light'
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      // 深色模式：隱藏月亮，顯示太陽
      document.body.classList.add('dark-mode');
      sunIcon.classList.add('toggle-icon--active');
      moonIcon.classList.remove('toggle-icon--active');
    } else {
      // 淺色模式：隱藏太陽，顯示月亮
      document.body.classList.remove('dark-mode');
      sunIcon.classList.remove('toggle-icon--active');
      moonIcon.classList.add('toggle-icon--active');
    }
  }
}

// 監聽 DOM 載入完成
document.addEventListener('DOMContentLoaded', () => {
  // header 是動態載入的，需要等待它載入完成
  const headerContainer = document.getElementById('header-container');

  if (!headerContainer) {
    console.error('找不到 header-container');
    return;
  }

  // 建立 Observer 監聽 header 容器的變化
  const observer = new MutationObserver((mutations) => {
    const hasAddedNodes = mutations.some(mutation => mutation.addedNodes.length > 0);

    if (hasAddedNodes) {
      const themeToggleBtn = document.getElementById('theme-toggle');
      if (themeToggleBtn) {
        initDarkMode();
        observer.disconnect();
      }
    }
  });

  observer.observe(headerContainer, {
    childList: true,
    subtree: true
  });

  // 如果 header 已經載入直接初始化
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    initDarkMode();
    observer.disconnect();
  }
});