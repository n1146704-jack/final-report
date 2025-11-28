/**
 * =========================================
 * articles.js - 文章頁面互動功能
 * =========================================
 */

// 等待 DOM 載入完成
document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 1. 滾動固定導航欄
  // ==========================================
  const pageNav = document.querySelector(".page-nav");
  const filterBar = document.querySelector(".filter-bar-section");
  const heroSection = document.querySelector(".hero-section");

  if (pageNav && heroSection) {
    let heroHeight = heroSection.offsetHeight;

    // 監聽視窗滾動事件
    window.addEventListener("scroll", function () {
      const scrollPosition = window.scrollY || window.pageYOffset;

      // 當滾動超過 Hero Section 高度時，添加 fixed class
      if (scrollPosition > heroHeight) {
        pageNav.classList.add("fixed");
        // 為了防止頁面跳動，當導航固定時給 body 添加 padding
        document.body.style.paddingTop = "70px";
      } else {
        pageNav.classList.remove("fixed");
        document.body.style.paddingTop = "0";
      }
    });

    // 視窗大小改變時重新計算高度
    window.addEventListener("resize", function () {
      heroHeight = heroSection.offsetHeight;
    });
  }

  // ==========================================
  // 2. 手機版選單切換
  // ==========================================
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", function () {
      // 切換選單顯示狀態
      mobileMenuToggle.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });

    // 點擊選單項目後關閉選單
    const mobileLinks = mobileMenu.querySelectorAll(".page-nav__mobile-link");
    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenuToggle.classList.remove("active");
        mobileMenu.classList.remove("active");
      });
    });

    // 點擊選單外部關閉選單
    document.addEventListener("click", function (event) {
      const isClickInsideMenu =
        mobileMenu.contains(event.target) ||
        mobileMenuToggle.contains(event.target);

      if (!isClickInsideMenu && mobileMenu.classList.contains("active")) {
        mobileMenuToggle.classList.remove("active");
        mobileMenu.classList.remove("active");
      }
    });
  }

  // ==========================================
  // 3. 文章分類篩選功能
  // ==========================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const articles = document.querySelectorAll(".article-list-item");

  if (filterButtons.length > 0 && articles.length > 0) {
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const category = this.getAttribute("data-category");

        // 更新按鈕狀態
        filterButtons.forEach(function (btn) {
          btn.classList.remove("filter-btn--active");
          btn.classList.add("filter-btn--inactive");
        });
        this.classList.remove("filter-btn--inactive");
        this.classList.add("filter-btn--active");

        // 篩選文章
        articles.forEach(function (article) {
          const articleCategory = article.getAttribute("data-category");

          if (category === "all" || articleCategory === category) {
            // 顯示符合條件的文章
            article.classList.remove("hidden");
            // 使用 setTimeout 確保動畫效果
            setTimeout(function () {
              article.style.opacity = "1";
              article.style.transform = "scale(1)";
            }, 10);
          } else {
            // 隱藏不符合條件的文章
            article.classList.add("hidden");
          }
        });
      });
    });
  }

  // ==========================================
  // 4. 搜尋功能
  // ==========================================
  const searchInput = document.getElementById("searchInput");

  if (searchInput && articles.length > 0) {
    // 使用防抖函數優化搜尋效能
    let searchTimeout;

    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim();

      // 清除之前的計時器
      clearTimeout(searchTimeout);

      // 設置新的計時器，300ms 後執行搜尋
      searchTimeout = setTimeout(function () {
        articles.forEach(function (article) {
          const title = article
            .querySelector(".article-list-item__title")
            .textContent.toLowerCase();
          const excerpt = article
            .querySelector(".article-list-item__excerpt")
            .textContent.toLowerCase();
          const tags = Array.from(
            article.querySelectorAll(".article-list-item__mini-tag")
          )
            .map(function (tag) {
              return tag.textContent.toLowerCase();
            })
            .join(" ");

          // 檢查標題、摘要或標籤是否包含搜尋詞
          if (
            searchTerm === "" ||
            title.includes(searchTerm) ||
            excerpt.includes(searchTerm) ||
            tags.includes(searchTerm)
          ) {
            article.classList.remove("hidden");
            setTimeout(function () {
              article.style.opacity = "1";
              article.style.transform = "scale(1)";
            }, 10);
          } else {
            article.classList.add("hidden");
          }
        });
      }, 300);
    });
  }

  // ==========================================
  // 5. 回到頂部按鈕
  // ==========================================
  const scrollToTopBtn = document.getElementById("scrollToTop");

  if (scrollToTopBtn) {
    // 監聽滾動顯示/隱藏按鈕
    window.addEventListener("scroll", function () {
      const scrollPosition = window.scrollY || window.pageYOffset;

      if (scrollPosition > 300) {
        scrollToTopBtn.classList.add("visible");
      } else {
        scrollToTopBtn.classList.remove("visible");
      }
    });

    // 點擊回到頂部
    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ==========================================
  // 6. Newsletter 訂閱功能
  // ==========================================
  const newsletterBtn = document.getElementById("newsletterBtn");
  const newsletterEmail = document.getElementById("newsletterEmail");

  if (newsletterBtn && newsletterEmail) {
    newsletterBtn.addEventListener("click", function () {
      const email = newsletterEmail.value.trim();

      // 簡單的 Email 驗證
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (email === "") {
        alert("請輸入您的 Email 地址");
        newsletterEmail.focus();
        return;
      }

      if (!emailRegex.test(email)) {
        alert("請輸入有效的 Email 地址");
        newsletterEmail.focus();
        return;
      }

      // 這裡可以串接後端 API
      // 目前只顯示成功訊息
      alert("訂閱成功！感謝您的支持 🎉");
      newsletterEmail.value = "";
    });

    // 按下 Enter 鍵也可以訂閱
    newsletterEmail.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        newsletterBtn.click();
      }
    });
  }

  // ==========================================
  // 7. 分頁功能
  // ==========================================
  const paginationButtons = document.querySelectorAll(".pagination__btn");

  if (paginationButtons.length > 0) {
    paginationButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        // 如果按鈕被禁用，不執行任何操作
        if (this.hasAttribute("disabled")) {
          return;
        }

        // 移除所有按鈕的 active 狀態
        paginationButtons.forEach(function (btn) {
          btn.classList.remove("pagination__btn--active");
        });

        // 只為數字按鈕添加 active 狀態
        if (
          !this.textContent.includes("上一頁") &&
          !this.textContent.includes("下一頁")
        ) {
          this.classList.add("pagination__btn--active");
        }

        // 滾動到頁面頂部
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        // 這裡可以添加載入新頁面文章的邏輯
        console.log("切換到頁面:", this.textContent);
      });
    });
  }

  // ==========================================
  // 8. 平滑滾動效果（針對錨點連結）
  // ==========================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = this.getAttribute("href");

      // 只處理非空的錨點
      if (href !== "#" && href !== "") {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          event.preventDefault();

          // 計算目標位置（考慮固定導航欄的高度）
          const navHeight = pageNav ? pageNav.offsetHeight : 0;
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // ==========================================
  // 9. 載入動畫
  // ==========================================
  // 為文章添加進場動畫
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // 觀察所有文章項目
  articles.forEach(function (article) {
    // 初始狀態
    article.style.opacity = "0";
    article.style.transform = "translateY(20px)";
    article.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    observer.observe(article);
  });

  // ==========================================
  // 10. 效能優化：圖片懶載入
  // ==========================================
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // 如果有使用 data-src 的圖片，可以在這裡觀察
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  // ==========================================
  // 11. 列印功能支援
  // ==========================================
  window.addEventListener("beforeprint", function () {
    // 列印前移除固定定位
    if (pageNav) {
      pageNav.classList.remove("fixed");
    }
  });

  window.addEventListener("afterprint", function () {
    // 列印後根據滾動位置恢復固定定位
    const scrollPosition = window.scrollY || window.pageYOffset;
    if (scrollPosition > heroHeight && pageNav) {
      pageNav.classList.add("fixed");
    }
  });

  // ==========================================
  // 12. 鍵盤快捷鍵
  // ==========================================
  document.addEventListener("keydown", function (event) {
    // Ctrl/Cmd + K 聚焦搜尋框
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Esc 清空搜尋框
    if (event.key === "Escape" && searchInput) {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
      searchInput.blur();
    }
  });
});