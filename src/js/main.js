import { renderHome, initHome } from './pages/home.js';
import { renderAbout } from './pages/about.js';
import { renderArchives } from './pages/archives.js';
import { renderMedia } from './pages/media.js';
import { renderTools, initTools } from './pages/tools.js';

const app = document.getElementById('app');

const routes = {
  '/': renderHome,
  '/about': renderAbout,
  '/archives': renderArchives,
  '/media': renderMedia,
  '/tools': renderTools,
};

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  const html = document.documentElement;
  const sun = toggle.querySelector('.theme-icon-sun');
  const moon = toggle.querySelector('.theme-icon-moon');

  function setTheme(theme) {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
      sun.style.display = 'none';
      moon.style.display = '';
    } else {
      html.removeAttribute('data-theme');
      sun.style.display = '';
      moon.style.display = 'none';
    }
    localStorage.setItem('theme', theme);
  }

  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved);

  toggle.addEventListener('click', function () {
    setTheme(html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });
}

function initScrollObserver() {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
    observer.observe(el);
  });
}

function updateActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(function (el) {
    el.classList.toggle('active', el.getAttribute('href') === '#' + path);
  });
}

function renderPage(path) {
  const render = routes[path] || routes['/'];
  app.innerHTML = render();
  updateActiveNav(path);
  initScrollObserver();
  if (path === '/') initHome();
  if (path === '/tools') initTools();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('hashchange', function () {
  const path = location.hash.slice(1) || '/';
  renderPage(path);
});

function initHamburger() {
  var btn = document.getElementById('hamburgerBtn');
  var menu = document.getElementById('hamburgerMenu');
  var backdrop = document.getElementById('hamburgerBackdrop');
  var closeBtn = document.getElementById('hamburgerClose');
  if (!btn || !menu) return;

  function open() {
    menu.classList.add('hamburger-menu--open');
    btn.classList.add('hamburger-btn--open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    menu.classList.remove('hamburger-menu--open');
    btn.classList.remove('hamburger-btn--open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    if (menu.classList.contains('hamburger-menu--open')) {
      close();
    } else {
      open();
    }
  });

  if (backdrop) backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Close when a nav link is clicked
  menu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', close);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('hamburger-menu--open')) close();
  });
}

const initialPath = location.hash.slice(1) || '/';
renderPage(initialPath);
initTheme();
initHamburger();
