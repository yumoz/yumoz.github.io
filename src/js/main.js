import { renderHome } from './pages/home.js';
import { renderAbout } from './pages/about.js';
import { renderArchives } from './pages/archives.js';

const app = document.getElementById('app');

const routes = {
  '/': renderHome,
  '/about': renderAbout,
  '/archives': renderArchives,
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('hashchange', function () {
  const path = location.hash.slice(1) || '/';
  renderPage(path);
});

const initialPath = location.hash.slice(1) || '/';
renderPage(initialPath);
initTheme();
