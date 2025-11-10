// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Smooth in-page scrolling
document.addEventListener('click', (e) => {
  const target = e.target.closest('a[href^="#"]');
  if (!target) return;
  const id = target.getAttribute('href');
  if (id.length > 1) {
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      siteNav?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  }
});

// Project filters
const filterButtons = Array.from(document.querySelectorAll('.filter'));
const projectCards = Array.from(document.querySelectorAll('.projects .card'));
function applyFilter(kind) {
  projectCards.forEach((card) => {
    const cat = card.getAttribute('data-category');
    const match = kind === 'all' || cat === kind;
    card.classList.toggle('is-hidden', !match);
  });
}
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    applyFilter(btn.dataset.filter || 'all');
  });
});

// Simple contact form handling (no backend)
const form = document.getElementById('contact-form');
const statusEl = document.querySelector('.form-status');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    if (!name || !email || !message) {
      if (statusEl) statusEl.textContent = 'Please complete all fields.';
      return;
    }
    // mailto fallback to open email client
    const subject = encodeURIComponent(`New inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
    if (statusEl) statusEl.textContent = 'Opening your email client…';
    form.reset();
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

