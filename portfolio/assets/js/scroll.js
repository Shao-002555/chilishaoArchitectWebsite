// scroll.js
// Smooth scrolling and scroll-based animations

(function () {
  'use strict';

  // ========================================
  // 平滑滾動 - 錨點連結
  // ========================================
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', hash);
  });

  // ========================================
  // 滾動動畫 - Intersection Observer
  // ========================================
  
  // 初始化動畫元素
  function initScrollAnimations() {
    // 為卡片添加動畫類別
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.classList.add('stagger-item');
      card.style.transitionDelay = `${index * 0.1}s`;
    });

    // 為標題添加動畫
    const titles = document.querySelectorAll('.section h1, .section h2, .section-head');
    titles.forEach(title => {
      title.classList.add('fade-in');
    });

    // 為段落添加動畫
    const intros = document.querySelectorAll('.section-intro, .lede');
    intros.forEach(intro => {
      intro.classList.add('fade-in');
    });

    // 為 Hero 區塊的元素添加特殊動畫
    const heroElements = document.querySelectorAll('.hero h1, .hero .subtitle, .hero .lede, .hero-cta');
    heroElements.forEach((el, index) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${index * 0.2}s`;
    });
  }

  // 創建 Intersection Observer
  function createObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // 提前觸發動畫
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // 如果是網格容器，為內部的卡片添加交錯動畫
          if (entry.target.classList.contains('cards') || entry.target.classList.contains('grid')) {
            const items = entry.target.querySelectorAll('.stagger-item');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('visible');
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);

    // 觀察所有動畫元素
    const animatedElements = document.querySelectorAll(
      '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item, .cards, .grid'
    );
    
    animatedElements.forEach(el => {
      observer.observe(el);
    });

    return observer;
  }

  // ========================================
  // 視差效果 (可選)
  // ========================================
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * 0.3;
          
          // 視差背景
          hero.style.backgroundPositionY = `calc(50% + ${rate}px)`;
          
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ========================================
  // 導覽列滾動效果
  // ========================================
  function initNavbarScrollEffect() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // 向下滾動隱藏，向上滾動顯示
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
          } else {
            header.style.transform = 'translateY(0)';
          }
          
          // 滾動時添加陰影
          if (currentScrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
          } else {
            header.style.boxShadow = 'none';
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    });

    // 添加過渡效果
    header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  }

  // ========================================
  // 頁面載入動畫
  // ========================================
  function initPageLoadAnimation() {
    // 頁面載入時先隱藏所有動畫元素
    document.body.classList.add('page-loading');
    
    // 載入完成後移除載入狀態
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-loaded');
      }, 100);
    });
  }

  // ========================================
  // 初始化
  // ========================================
  function init() {
    // 等待 DOM 完全載入
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initScrollAnimations();
        createObserver();
        initParallax();
        initNavbarScrollEffect();
      });
    } else {
      initScrollAnimations();
      createObserver();
      initParallax();
      initNavbarScrollEffect();
    }
    
    initPageLoadAnimation();
  }

  init();
})();

