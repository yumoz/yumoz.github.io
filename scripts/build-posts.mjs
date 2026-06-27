import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, rmdirSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { marked } from 'marked'
import matter from 'gray-matter'

const ROOT = join(import.meta.dirname, '..')
const SRC = join(ROOT, 'src')
const POSTS = join(ROOT, 'posts')
const DATA_FILE = join(SRC, 'js', 'posts-data.js')
const MANIFEST = join(SRC, '.posts-manifest.json')

if (!existsSync(POSTS)) {
  writeFileSync(DATA_FILE, 'export const posts = []\n', 'utf-8')
  writeFileSync(MANIFEST, '[]', 'utf-8')
  process.exit(0)
}

// read current manifest
let previous = []
try { previous = JSON.parse(readFileSync(MANIFEST, 'utf-8')) } catch {}

const entries = readdirSync(POSTS, { withFileTypes: true })
const generated = []
const postsMeta = []

for (const entry of entries) {
  if (!entry.isDirectory()) continue
  const slug = entry.name
  const mdPath = join(POSTS, slug, 'index.md')
  if (!existsSync(mdPath)) continue

  const raw = readFileSync(mdPath, 'utf-8')
  const { data, content } = matter(raw)

  const title = data.title || slug
  const date = data.date ? new Date(data.date) : new Date()
  const tags = data.tags || []
  const description = data.description || title

  const yyyy = String(date.getFullYear())
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  const bodyHtml = marked.parse(content)

  const html = buildPage({ title, description, date, yyyy, mm, dd, slug, bodyHtml })
  const outDir = join(SRC, yyyy, mm, dd, slug)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8')

  generated.push(join(yyyy, mm, dd, slug, 'index.html'))
  postsMeta.push({ title, date: `${yyyy}-${mm}-${dd}`, slug, url: `/${yyyy}/${mm}/${dd}/${slug}/`, tags })
}

// sort newest first
postsMeta.sort((a, b) => b.date.localeCompare(a.date))

// write data module
const dataCode = `export const posts = ${JSON.stringify(postsMeta, null, 2)}\n`
writeFileSync(DATA_FILE, dataCode, 'utf-8')

// clean orphaned files
for (const file of previous) {
  if (!generated.includes(file)) {
    const fullPath = join(SRC, file)
    if (existsSync(fullPath)) {
      unlinkSync(fullPath)
      // clean empty parent dirs
      let dir = dirname(fullPath)
      while (dir !== SRC) {
        try {
          const children = readdirSync(dir)
          if (children.length === 0) { rmdirSync(dir); dir = dirname(dir) }
          else break
        } catch { break }
      }
    }
  }
}

writeFileSync(MANIFEST, JSON.stringify(generated, null, 2), 'utf-8')

function buildPage({ title, description, date, yyyy, mm, dd, slug, bodyHtml }) {
  const dateStr = `${yyyy}年${mm}月${dd}日`
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Yumoz</title>
  <meta name="description" content="${description}">
  <link rel="preconnect" href="https://fonts.geekzu.org">
  <link href="https://fonts.geekzu.org/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif+SC:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>

  <header class="site-header">
    <div class="container">
      <div class="header-inner">
        <a href="/" class="site-logo">
          <span class="logo-icon">Y</span>
          Yumoz
        </a>
        <nav class="main-nav">
          <a href="/" class="nav-link">\u9996\u9875</a>
          <a href="/#/archives" class="nav-link">\u5F52\u6863</a>
          <a href="/#/about" class="nav-link">\u5173\u4E8E</a>
          <button class="theme-toggle" id="themeToggle" aria-label="\u5207\u6362\u4E3B\u9898">
            <svg class="theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </header>

  <main class="main-content">
    <div class="container">
      <div class="page-header animate-on-scroll">
        <h1 class="page-title">${title}</h1>
        <p class="page-subtitle">${dateStr}</p>
      </div>

      <article class="article-full animate-on-scroll">
        <div class="article-content">
          ${bodyHtml}
        </div>
      </article>

      <div class="article-card" style="text-align: center;">
        <a href="/" class="read-more">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          \u8FD4\u56DE\u9996\u9875
        </a>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <p class="footer-text">
          &copy; ${yyyy} Yumoz
        </p>
        <p class="footer-text">
          <a href="https://github.com/yumoz" target="_blank">GitHub</a>
          <span class="footer-sep">&middot;</span>
          <a href="https://gitee.com/yumoz/" target="_blank">Gitee</a>
          <span class="footer-sep">&middot;</span>
          <a href="https://blog.csdn.net/qq_37857219" target="_blank">CSDN</a>
          <span class="footer-sep">&middot;</span>
          <a href="https://www.cnblogs.com/yumoz/" target="_blank">\u535A\u5BA2\u56ED</a>
        </p>
      </div>
    </div>
  </footer>

  <script>
    (function() {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
        observer.observe(el);
      });
    })();

    (function() {
      var toggle = document.getElementById('themeToggle');
      if (!toggle) return;
      var html = document.documentElement;
      var sun = toggle.querySelector('.theme-icon-sun');
      var moon = toggle.querySelector('.theme-icon-moon');
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
      var saved = localStorage.getItem('theme');
      if (saved) setTheme(saved);
      toggle.addEventListener('click', function() {
        setTheme(html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
      });
    })();
  </script>

</body>
</html>`
}
