// main.js
// - Navigation highlighting
// - Footer year
// - Load featured projects on the home page

(function () {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Highlight current nav link
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const pageKey = path.replace('.html', '') || 'index';
  const navMap = { index: 'home', about: 'about', projects: 'projects', idea: 'ideas', contact: 'contact' };
  const currentKey = navMap[pageKey] || 'home';
  document.querySelectorAll('.site-nav a').forEach((a) => {
    const key = a.getAttribute('data-nav');
    if (key === currentKey) a.classList.add('active');
  });

  // Load featured projects on index
  const featured = document.getElementById('featured-projects');
  if (featured) {
    fetch('data/projects.json')
      .then((res) => res.json())
      .then((projects) => {
        const items = projects.slice(0, 3);
        featured.innerHTML = items
          .map((p) => cardHTML(p))
          .join('');
      })
      .catch(() => {
        featured.innerHTML = '<p>Could not load projects right now.</p>';
      });
  }

  // Load all projects on the projects page
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid) {
    fetch('data/projects.json')
      .then((res) => res.json())
      .then((projects) => {
        if (!projects.length) {
          projectsGrid.innerHTML = '<p>No projects available yet.</p>';
          return;
        }
        projectsGrid.innerHTML = projects.map((p) => cardHTML(p, true)).join('');
      })
      .catch(() => {
        projectsGrid.innerHTML = '<p>Could not load projects. Please try again later.</p>';
      });
  }

  // Load ideas into ribbon on the Ideas page
  const ideasRibbon = document.getElementById('ideas-ribbon');
  if (ideasRibbon) {
    fetch('data/ideas.json')
      .then((res) => res.json())
      .then((ideas) => {
        if (!ideas.length) {
          ideasRibbon.innerHTML = '<p>No posts yet. Check back soon.</p>';
          return;
        }
        ideasRibbon.innerHTML = ideas.map((i) => ideaCardHTML(i)).join('');
      })
      .catch(() => {
        ideasRibbon.innerHTML = '<p>Could not load ideas right now.</p>';
      });

    // Ribbon nav buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.ribbon-nav');
      if (!btn) return;
      const sel = btn.getAttribute('data-target');
      const el = sel ? document.querySelector(sel) : null;
      if (!el) return;
      const dir = btn.classList.contains('prev') ? -1 : 1;
      const delta = Math.round(el.clientWidth * 0.8) * dir;
      el.scrollBy({ left: delta, behavior: 'smooth' });
    });
  }

  function cardHTML(p, withActions) {
    const img = p.image || 'assets/images/project1.jpg';
    const link = p.link || '#';
    const safeTitle = escapeHTML(p.title || 'Untitled');
    const safeDesc = escapeHTML(p.description || '');
    return `
      <article class="card">
        <img class="card-media" src="${img}" alt="${safeTitle}" loading="lazy" />
        <div class="card-body">
          <h3>${safeTitle}</h3>
          <p>${safeDesc}</p>
          ${withActions ? `<div class="card-actions"><a class="btn" href="${link}" target="_blank" rel="noopener">View Project</a></div>` : ''}
        </div>
      </article>
    `;
  }

  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function ideaCardHTML(i) {
    const img = i.image || 'assets/images/project1.jpg';
    const safeTitle = escapeHTML(i.title || 'Untitled');
    const safeExcerpt = escapeHTML(i.excerpt || '');
    const date = i.date ? `<small class="muted">${escapeHTML(i.date)}</small>` : '';
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
})();
