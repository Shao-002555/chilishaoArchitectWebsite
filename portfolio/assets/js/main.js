// main.js - 效能優化版

(function () {
  // 1. 快取 DOM 節點，避免重複選取
  const yearEl = document.getElementById("year");
  const aboutContainer = document.getElementById("about-info");
  const skillsContainer = document.getElementById("skills-container");
  const featuredGrid = document.getElementById("featured-projects");
  const projectsGrid = document.getElementById("projects-grid");
  const ideasRibbon = document.getElementById("ideas-ribbon");

  // 設定頁腳年份
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /**
   * 輔助函式：逸出 HTML 特殊字元 (防止 XSS)
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
   * 生成專案卡片 HTML
   */
  function cardHTML(p, withActions = false) {
    const img = p.image || "assets/images/project1.jpg";
    const link = p.link || "#";
    const safeTitle = escapeHTML(p.title);
    const safeDesc = escapeHTML(p.description);
    return `
      <article class="card">
        <img class="card-media" src="${img}" alt="${safeTitle}" loading="lazy" />
        <div class="card-body">
          <h3>${safeTitle}</h3>
          <p>${safeDesc}</p>
          ${
            withActions
              ? `<div class="card-actions"><a class="btn" href="${link}" target="_blank" rel="noopener">View Project</a></div>`
              : ""
          }
        </div>
      </article>
    `;
  }

  /**
   * 生成 Idea 卡片 HTML
   */
  function ideaCardHTML(i) {
    const img = i.image || "assets/images/project1.jpg";
    const safeTitle = escapeHTML(i.title);
    const safeExcerpt = escapeHTML(i.excerpt);
    const date = i.date
      ? `<small class="muted">${escapeHTML(i.date)}</small>`
      : "";
    return `
      <article class="card ribbon-card">
        <img class="card-media" src="${img}" alt="${safeTitle}" loading="lazy" />
        <div class="card-body">
          <h3>${safeTitle}</h3>
          ${date}
          <p>${safeExcerpt}</p>
        </div>
      </article>
    `;
  }

  // --- 初始化各頁面邏輯 ---

  // 關於頁面 (About & Skills)
  if (aboutContainer || skillsContainer) {
    // 使用 Promise.all 同時載入兩個 JSON，減少等待時間
    Promise.all([
      fetch("data/about.json").then((res) => res.json()),
      fetch("data/skills.json").then((res) => res.json()),
    ])
      .then(([aboutData, skillsData]) => {
        if (aboutContainer) {
          const paragraphsHTML = aboutData.paragraphs
            .map((p) => `<p>${p}</p>`)
            .join("");
          aboutContainer.innerHTML = `
          <h1>${escapeHTML(aboutData.title)}</h1>
          ${paragraphsHTML}
          <p>${aboutData.closing ? escapeHTML(aboutData.closing) : ""}</p>
        `;
        }
        if (skillsContainer && skillsData.skills) {
          skillsContainer.innerHTML = skillsData.skills
            .map((skill) => `<li>${escapeHTML(skill)}</li>`)
            .join("");
        }
      })
      .catch((err) => console.error("Could not load about/skills info:", err));
  }

  // 專案列表 (首頁與專案頁)
  if (featuredGrid || projectsGrid) {
    fetch("data/projects.json")
      .then((res) => res.json())
      .then((projects) => {
        if (featuredGrid) {
          // 首頁僅顯示前 3 個
          featuredGrid.innerHTML = projects
            .slice(0, 3)
            .map((p) => cardHTML(p))
            .join("");
        }
        if (projectsGrid) {
          // 專案頁顯示全部
          projectsGrid.innerHTML =
            projects.length > 0
              ? projects.map((p) => cardHTML(p, true)).join("")
              : "<p>No projects available yet.</p>";
        }
      })
      .catch((err) => {
        if (featuredGrid)
          featuredGrid.innerHTML = "<p>Error loading projects.</p>";
        if (projectsGrid)
          projectsGrid.innerHTML = "<p>Error loading projects.</p>";
      });
  }

  // Ideas 頁面
  if (ideasRibbon) {
    fetch("data/ideas.json")
      .then((res) => res.json())
      .then((ideas) => {
        ideasRibbon.innerHTML =
          ideas.length > 0
            ? ideas.map((i) => ideaCardHTML(i)).join("")
            : "<p>No posts yet.</p>";
      })
      .catch(() => (ideasRibbon.innerHTML = "<p>Could not load ideas.</p>"));

    // Ribbon 捲動控制事件代理
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".ribbon-nav");
      if (!btn) return;
      const target = document.querySelector(btn.dataset.target);
      if (!target) return;
      const dir = btn.classList.contains("prev") ? -1 : 1;
      target.scrollBy({
        left: target.clientWidth * 0.8 * dir,
        behavior: "smooth",
      });
    });
  }
})();
