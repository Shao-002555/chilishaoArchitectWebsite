Architect Portfolio — Static Template
====================================

Overview
--------
- Clean, responsive portfolio template for architects.
- Sections: Hero, Selected Work (filterable), About, Services, Contact.
- No build tools required; works as plain HTML/CSS/JS.

Files
-----
- `index.html` — Page structure and content.
- `styles.css` — Responsive layout and visual design.
- `script.js` — Mobile nav, filters, contact form mailto fallback.
- `assets/` — Put your images here. Placeholder folders are included.

Quick Start
-----------
1. Open `index.html` in a browser.
2. Replace placeholder text and update contact info in `index.html` and `script.js`.
3. Add your images under `assets/images/` and update project card image paths.

Customize
---------
- Colors/typography: tweak CSS variables in `styles.css` under `:root`.
- Projects: edit each `.card` in `#projects` and set `data-category`.
- Contact: swap `mailto:` in `script.js` for Formspree or your backend if desired.

Deploy
------
- Any static host works: GitHub Pages, Netlify, Vercel, etc.
- Ensure the site root contains `index.html`, `styles.css`, `script.js`, and `assets/`.

