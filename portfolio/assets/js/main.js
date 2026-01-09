/**
 * main.js - 作品集網站主程式
 * 負責動態載入和渲染各頁面內容
 * Updated: 加入 Project Detail Page 邏輯
 */

(function () {
  "use strict";

  // ========================================
  // DOM 元素快取
  // ========================================
  const DOM = {
    yearEl: document.getElementById("year"),
    aboutContainer: document.getElementById("about-info"),
    skillsContainer: document.getElementById("skills-container"),
    featuredGrid: document.getElementById("featured-projects"),
    projectsGrid: document.getElementById("projects-grid"),
    ideasRibbon: document.getElementById("ideas-ribbon"),
    pdfIframe: document.getElementById("pdf-iframe"),
    docTitle: document.getElementById("current-doc-title"),
    docDesc: document.getElementById("current-doc-desc"),
    prevDocBtn: document.getElementById("prev-doc"),
    nextDocBtn: document.getElementById("next-doc"),
    projectContent: document.getElementById("project-content"), // 專案詳情頁容器
  };

  // ========================================
  // 工具函式
  // ========================================

  /**
   * 逸出 HTML 特殊字元以防止 XSS 攻擊
   * @param {string} str - 要逸出的字串
   * @returns {string} 安全的 HTML 字串
   */
  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  /**
   * 非同步載入 JSON 資料
   * @param {string} url - JSON 檔案路徑
   * @returns {Promise<Object>} JSON 資料
   */
  async function loadJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${url}:`, error);
      throw error;
    }
  }

  /**
   * 顯示錯誤訊息
   * @param {HTMLElement} element - 要顯示錯誤的元素
   * @param {string} message - 錯誤訊息
   */
  function showError(element, message) {
    if (element) {
      element.innerHTML = `<p class="error-message" style="color:red; padding:2rem;">${escapeHTML(
        message
      )}</p>`;
    }
  }

  // ========================================
  // HTML 模板生成器
  // ========================================

  /**
   * 生成專案卡片 HTML
   * @param {Object} project - 專案資料
   * @param {boolean} withActions - 是否包含操作按鈕
   * @returns {string} 卡片 HTML
   */
  function createProjectCard(project, withActions = false) {
    const img = project.image || "assets/images/project1.jpg";
    // 如果有 link 屬性則使用，否則如果 id 存在則自動生成詳情頁連結
    const link =
      project.link || (project.id ? `project-detail.html?id=${project.id}` : "#");
    const title = escapeHTML(project.title);
    const description = escapeHTML(project.description);

    return `
      <article class="card">
        <a href="${link}" style="display:block; overflow:hidden;">
            <img class="card-media" src="${img}" alt="${title}" loading="lazy" style="transition: transform 0.3s ease;" />
        </a>
        <div class="card-body">
          <h3><a href="${link}">${title}</a></h3>
          <p>${description}</p>
          ${
            withActions
              ? `
            <div class="card-actions">
              <a class="btn" href="${link}">View Project</a>
            </div>
          `
              : ""
          }
        </div>
      </article>
    `;
  }

  /**
   * 生成 Idea 卡片 HTML
   * @param {Object} idea - Idea 資料
   * @returns {string} 卡片 HTML
   */
  function createIdeaCard(idea) {
    const img = idea.image || "assets/images/project1.jpg";
    const title = escapeHTML(idea.title);
    const excerpt = escapeHTML(idea.excerpt);
    const date = idea.date
      ? `<small class="muted">${escapeHTML(idea.date)}</small>`
      : "";

    return `
      <article class="card ribbon-card">
        <img class="card-media" src="${img}" alt="${title}" loading="lazy" />
        <div class="card-body">
          <h3>${title}</h3>
          ${date}
          <p>${excerpt}</p>
        </div>
      </article>
    `;
  }

  // ========================================
  // 頁面初始化函式
  // ========================================

  /**
   * 初始化年份顯示
   */
  function initYear() {
    if (DOM.yearEl) {
      DOM.yearEl.textContent = new Date().getFullYear();
    }
  }

  /**
   * 初始化關於頁面（About & Skills）
   */
  async function initAboutPage() {
    if (!DOM.aboutContainer && !DOM.skillsContainer) return;

    try {
      const [aboutData, skillsData] = await Promise.all([
        loadJSON("data/about.json"),
        loadJSON("data/skills.json"),
      ]);

      // 渲染 About 內容
      if (DOM.aboutContainer) {
        const paragraphsHTML = aboutData.paragraphs
          .map((p) => `<p>${escapeHTML(p)}</p>`)
          .join("");

        DOM.aboutContainer.innerHTML = `
          <h1>${escapeHTML(aboutData.title)}</h1>
          ${paragraphsHTML}
          ${
            aboutData.closing
              ? `<p>${escapeHTML(aboutData.closing)}</p>`
              : ""
          }
        `;
      }

      // 渲染 Skills 內容
      if (DOM.skillsContainer && skillsData.skills) {
        DOM.skillsContainer.innerHTML = skillsData.skills
          .map((skill) => `<li>${escapeHTML(skill)}</li>`)
          .join("");
      }
    } catch (error) {
      console.error("Failed to load about/skills:", error);
      showError(DOM.aboutContainer, "Could not load about information.");
      showError(DOM.skillsContainer, "Could not load skills information.");
    }
  }

  /**
   * 初始化專案列表頁面（Featured & All Projects）
   */
  async function initProjectsPage() {
    if (!DOM.featuredGrid && !DOM.projectsGrid) return;

    try {
      const projects = await loadJSON("data/projects.json");

      // 渲染精選專案（首頁）
      if (DOM.featuredGrid) {
        const featuredProjects = projects.slice(0, 3);
        DOM.featuredGrid.innerHTML = featuredProjects
          .map((p) => createProjectCard(p))
          .join("");
      }

      // 渲染所有專案（專案頁）
      if (DOM.projectsGrid) {
        DOM.projectsGrid.innerHTML =
          projects.length > 0
            // UPDATE: 修改此處為 false，不再顯示 "View Project" 按鈕
            ? projects.map((p) => createProjectCard(p, false)).join("")
            : "<p>No projects available yet.</p>";
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
      showError(DOM.featuredGrid, "Error loading projects.");
      showError(DOM.projectsGrid, "Error loading projects.");
    }
  }

  /**
   * 初始化單一專案詳情頁面 (Project Detail Page)
   * 邏輯：解析 URL 參數 ?id=XX，並渲染對應內容
   */
  async function initProjectDetailPage() {
    // 如果頁面上沒有專案容器，代表不在詳情頁，直接離開
    if (!DOM.projectContent) return;

    // 1. 取得 URL 參數
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");

    if (!projectId) {
      showError(DOM.projectContent, "No project ID specified.");
      return;
    }

    try {
      // 2. 載入資料
      const projects = await loadJSON("data/projects.json");
      
      // 3. 尋找對應的專案 (確保型別一致，轉為 String 比對)
      const project = projects.find(p => String(p.id) === projectId);

      if (!project) {
        showError(DOM.projectContent, "Project not found.");
        return;
      }

      // 4. 生成 HTML 內容
      // 處理多段落內文
      const detailsHTML = project.details
        ? project.details.map(text => `<p class="lede" style="margin-bottom: 1.5rem;">${escapeHTML(text)}</p>`).join("")
        : `<p>${escapeHTML(project.description)}</p>`;

      // 處理畫廊圖片
      const galleryHTML = project.gallery
        ? `<div class="project-gallery grid cards" style="margin-top: var(--space-7);">
            ${project.gallery.map(img => `
              <div class="card" style="padding:0; border:none;">
                <img src="${img}" class="card-media" loading="lazy" alt="Gallery Image" style="width:100%; height:auto; display:block;">
              </div>
            `).join("")}
           </div>`
        : "";

      // 組合最終 HTML
      DOM.projectContent.innerHTML = `
        <article class="project-detail">
          <header class="section-head" style="display:block; margin-bottom: var(--space-6); border-bottom: none;">
            <h1 style="font-size: clamp(2rem, 5vw, 4rem); margin-bottom: var(--space-2); line-height: 1.1;">${escapeHTML(project.title)}</h1>
            <div class="meta" style="color: var(--color-muted); font-family: var(--font-mono); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">
              <span>${escapeHTML(project.date || "")}</span>
              ${project.category ? `<span> | ${escapeHTML(project.category)}</span>` : ""}
            </div>
          </header>

          <figure class="hero-image-container" style="margin-bottom: var(--space-6);">
            <img src="${project.image}" alt="${escapeHTML(project.title)}" class="hero-image" style="width:100%; height:auto; object-fit: cover; max-height: 80vh;">
          </figure>

          <div class="content-body" style="max-width: 70ch; margin: 0 auto;">
            ${detailsHTML}
          </div>

          ${galleryHTML}

          <div class="project-nav" style="margin-top: var(--space-8); padding-top: var(--space-6); border-top: 1px solid var(--color-border); text-align: center;">
            <a href="projects.html" class="btn primary">← Back to Projects</a>
          </div>
        </article>
      `;

    } catch (error) {
      console.error("Failed to load project details:", error);
      showError(DOM.projectContent, "Error loading project details.");
    }
  }

  /**
   * 初始化出版物頁面（PDF Viewer）
   */
  function initPublicationsPage() {
    if (!DOM.pdfIframe) return;

    let publicationsData = [];
    let currentIndex = 0;

    function updateViewer(index) {
      if (publicationsData.length === 0 || !publicationsData[index]) return;

      const doc = publicationsData[index];
      if (DOM.docTitle) DOM.docTitle.textContent = doc.title;
      if (DOM.docDesc) DOM.docDesc.textContent = doc.description;

      DOM.pdfIframe.src = `${doc.docs}#toolbar=0&navpanes=0&scrollbar=1`;
      currentIndex = index;

      if (DOM.prevDocBtn) DOM.prevDocBtn.disabled = currentIndex === 0;
      if (DOM.nextDocBtn)
        DOM.nextDocBtn.disabled = currentIndex === publicationsData.length - 1;
    }

    function navigatePrevious() {
      if (currentIndex > 0) updateViewer(currentIndex - 1);
    }

    function navigateNext() {
      if (currentIndex < publicationsData.length - 1)
        updateViewer(currentIndex + 1);
    }

    loadJSON("data/publications.json")
      .then((data) => {
        publicationsData = data;
        if (publicationsData.length > 0) {
          updateViewer(0);
        }
      })
      .catch((error) => {
        console.error("Failed to load publications:", error);
        if (DOM.docDesc) DOM.docDesc.textContent = "無法載入文件列表。";
      });

    DOM.prevDocBtn?.addEventListener("click", navigatePrevious);
    DOM.nextDocBtn?.addEventListener("click", navigateNext);
    DOM.pdfIframe.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  /**
   * 禁止全網頁右鍵選單
   */
  document.addEventListener("contextmenu", (e) => e.preventDefault(), false);

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.key === "u") ||
      (e.ctrlKey && e.key === "s")
    ) {
      e.preventDefault();
    }
  });

  /**
   * 初始化 Ideas 頁面
   */
  async function initIdeasPage() {
    if (!DOM.ideasRibbon) return;

    try {
      const ideas = await loadJSON("data/ideas.json");
      DOM.ideasRibbon.innerHTML =
        ideas.length > 0
          ? ideas.map((idea) => createIdeaCard(idea)).join("")
          : "<p>No posts yet.</p>";
    } catch (error) {
      console.error("Failed to load ideas:", error);
      showError(DOM.ideasRibbon, "Could not load ideas.");
    }
  }

  /**
   * 初始化 Ribbon 捲動控制
   */
  function initRibbonScrollControls() {
    if (!DOM.ideasRibbon) return;

    document.addEventListener("click", (event) => {
      const btn = event.target.closest(".ribbon-nav");
      if (!btn) return;

      const target = document.querySelector(btn.dataset.target);
      if (!target) return;

      const direction = btn.classList.contains("prev") ? -1 : 1;
      target.scrollBy({
        left: target.clientWidth * 0.8 * direction,
        behavior: "smooth",
      });
    });
  }

  // ========================================
  // 主程式初始化
  // ========================================

  /**
   * 應用程式初始化
   */
  function init() {
    initYear();
    initAboutPage();
    initProjectsPage();
    initProjectDetailPage(); // 新增：初始化詳情頁邏輯
    initPublicationsPage();
    initIdeasPage();
    initRibbonScrollControls();
  }

  // DOM 載入完成後執行初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();