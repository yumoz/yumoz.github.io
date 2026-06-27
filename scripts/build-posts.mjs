import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, rmdirSync } from 'fs'
import { join, dirname } from 'path'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import matter from 'gray-matter'

marked.use(markedKatex({ throwOnError: false, nonStandard: true }))

// heading counter for TOC IDs
let tocHeadings = []
marked.use({
  walkTokens(token) {
    if (token.type === 'heading' && token.depth >= 2) {
      tocHeadings.push({ level: token.depth, text: token.text })
    }
  }
})

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

// First pass: collect metadata
for (const entry of entries) {
  if (!entry.isDirectory()) continue
  const slug = entry.name
  const mdPath = join(POSTS, slug, 'index.md')
  if (!existsSync(mdPath)) continue

  const raw = readFileSync(mdPath, 'utf-8')
  const { data } = matter(raw)
  const title = data.title || slug
  const date = data.date ? new Date(data.date) : new Date()
  const tags = data.tags || []
  const description = data.description || title
  const yyyy = String(date.getFullYear())
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  postsMeta.push({ title, description, date: `${yyyy}-${mm}-${dd}`, slug, url: `/${yyyy}/${mm}/${dd}/${slug}/`, tags, _yyyy: yyyy, _mm: mm, _dd: dd })
}

// sort newest first
postsMeta.sort((a, b) => b.date.localeCompare(a.date))

// Second pass: generate pages with full sidebar
for (const meta of postsMeta) {
  const { title, description, slug, tags, _yyyy: yyyy, _mm: mm, _dd: dd, url: currentUrl } = meta
  const mdPath = join(POSTS, slug, 'index.md')
  const raw = readFileSync(mdPath, 'utf-8')
  const { content } = matter(raw)
  tocHeadings = []
  let rawHtml = marked.parse(content)
  // add id to h2-h4 for TOC anchors
  let hid = 0
  rawHtml = rawHtml.replace(/<h([2-4])(?:\s[^>]*)?>/gi, (m, level) => {
    const id = `h-${++hid}`
    // align with walkTokens order
    if (tocHeadings[hid - 1]) tocHeadings[hid - 1].id = id
    return `<h${level} id="${id}">`
  })
  const bodyHtml = rawHtml

  const html = buildPage({ title, description, date: meta.date, yyyy, mm, dd, slug, bodyHtml, postsMeta, currentUrl })
  const outDir = join(SRC, yyyy, mm, dd, slug)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8')

  generated.push(join(yyyy, mm, dd, slug, 'index.html'))
}

// keep postsMeta clean for data file
const cleanMeta = postsMeta.map(({ _yyyy, _mm, _dd, ...rest }) => rest)

// write data module
const dataCode = `export const posts = ${JSON.stringify(cleanMeta, null, 2)}\n`
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

function buildTOCTree(headings) {
  const root = []
  const stack = [{ level: 1, children: root }]
  for (const h of headings) {
    const node = { ...h, children: [] }
    while (stack.length && stack[stack.length - 1].level >= h.level) stack.pop()
    stack[stack.length - 1].children.push(node)
    stack.push(node)
  }
  return root
}

function renderTOC(children, depth) {
  if (!children.length) return ''
  return `<ul class="toc-list${depth > 0 ? ' toc-list--nested' : ''}">
      ${children.map(c => {
        const hasChildren = c.children.length > 0
        return `<li class="toc-item toc-item--h${c.level}" data-level="${c.level}">
          <div class="toc-entry">
            ${hasChildren ? '<button class="toc-toggle" aria-label="展开/折叠"><svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2.5 3L4 5.5L5.5 3"/></svg></button>' : '<span class="toc-toggle toc-toggle--spacer"></span>'}
            <a class="toc-link" href="#${c.id}" data-toc-id="${c.id}">${c.text}</a>
          </div>
          ${renderTOC(c.children, depth + 1)}
        </li>`
      }).join('')}
    </ul>`
}

function buildPage({ title, description, date, yyyy, mm, dd, slug, bodyHtml, postsMeta, currentUrl }) {
  const dateStr = `${yyyy}年${mm}月${dd}日`

  // TOC — use collected headingIds from marked parse
  const tocTree = buildTOCTree(tocHeadings)
  const tocHTML = tocTree.length ? renderTOC(tocTree, 0) : ''

  // post list
  const sidebarList = postsMeta.map(p => {
    const active = p.url === currentUrl ? ' sidebar-item--active' : ''
    const label = p.date.replace(/-/g, '/')
    return `<li><a class="sidebar-item${active}" href="${p.url}"><span class="sidebar-date">${label}</span><span class="sidebar-title">${p.title}</span></a></li>`
  }).join('\n          ')

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
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">
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
          <a href="/#/media" class="nav-link">\u5A92\u4F53</a>
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
      <div class="page-header page-header--article animate-on-scroll">
        <h1 class="page-title">${title}</h1>
        <p class="page-subtitle">${dateStr}</p>
      </div>

      <div class="article-layout">
        <aside class="article-sidebar animate-on-scroll">
          <div class="sidebar-tabs">
            <button class="sidebar-tab sidebar-tab--active" data-tab="posts">\u6587\u7AE0\u5BFC\u822A</button>
            <button class="sidebar-tab" data-tab="toc">\u6587\u6863\u5BFC\u822A</button>
          </div>
          <div class="sidebar-tab-content sidebar-tab-content--active" data-tab-content="posts">
            <ul class="sidebar-list">
              ${sidebarList}
            </ul>
          </div>
          <div class="sidebar-tab-content" data-tab-content="toc">
            ${tocHTML || '<p style="color:var(--text-muted);font-size:13px">\u6CA1\u6709\u4E8C\u7EA7\u6807\u9898</p>'}
          </div>
        </aside>

        <article class="article-full animate-on-scroll">
          <div class="article-content">
            ${bodyHtml}
          </div>
        </article>
      </div>

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

  <div class="toc-context-menu" id="tocContextMenu" style="display:none">
    <div class="toc-context-item" data-action="expand-all">\u5168\u90E8\u5C55\u5F00</div>
    <div class="toc-context-item" data-action="collapse-all">\u5168\u90E8\u6298\u53E0</div>
    <div class="toc-context-divider"></div>
    <div class="toc-context-item" data-action="expand-level" data-level="2">\u5C55\u5F00\u5230\u7B2C\u4E8C\u7EA7</div>
    <div class="toc-context-item" data-action="expand-level" data-level="3">\u5C55\u5F00\u5230\u7B2C\u4E09\u7EA7</div>
  </div>

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

    // sidebar tabs
    (function() {
      var tabs = document.querySelectorAll('.sidebar-tab');
      if (!tabs.length) return;
      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          var name = this.getAttribute('data-tab');
          tabs.forEach(function(t) { t.classList.remove('sidebar-tab--active'); });
          this.classList.add('sidebar-tab--active');
          document.querySelectorAll('.sidebar-tab-content').forEach(function(c) {
            c.classList.toggle('sidebar-tab-content--active', c.getAttribute('data-tab-content') === name);
          });
        });
      });
    })();

    // toc toggle
    (function() {
      var toggles = document.querySelectorAll('.toc-toggle:not(.toc-toggle--spacer)');
      toggles.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var item = this.closest('.toc-item');
          if (!item) return;
          item.classList.toggle('toc-collapsed');
        });
      });
    })();

    // toc scroll spy
    (function() {
      var links = document.querySelectorAll('.toc-link');
      if (!links.length) return;
      var items = [];
      links.forEach(function(link) {
        var id = link.getAttribute('data-toc-id');
        var el = document.getElementById(id);
        if (el) items.push({ el: el, link: link });
      });
      if (!items.length) return;
      function update() {
        var scrollY = window.scrollY + 130;
        var active = items[0];
        for (var i = 0; i < items.length; i++) {
          if (items[i].el.offsetTop <= scrollY) active = items[i];
          else break;
        }
        links.forEach(function(l) { l.classList.remove('toc-link--active'); });
        active.link.classList.add('toc-link--active');
        // expand parent items so active link is visible
        var parent = active.link.closest('.toc-item');
        while (parent) {
          parent.classList.remove('toc-collapsed');
          parent = parent.parentElement ? parent.parentElement.closest('.toc-item') : null;
        }
      }
      window.addEventListener('scroll', update);
      update();
    })();

    // toc context menu
    (function() {
      var toc = document.querySelector('[data-tab-content="toc"]');
      var menu = document.getElementById('tocContextMenu');
      if (!toc || !menu) return;

      toc.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        menu.style.display = 'block';
        menu.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px';
        menu.style.top = e.clientY + 'px';
      });

      document.addEventListener('click', function() {
        menu.style.display = 'none';
      });

      document.querySelectorAll('.toc-context-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          var action = this.getAttribute('data-action');
          var level = parseInt(this.getAttribute('data-level'));
          menu.style.display = 'none';

          var items = toc.querySelectorAll('.toc-item');
          if (action === 'expand-all') {
            items.forEach(function(it) { it.classList.remove('toc-collapsed'); });
          } else if (action === 'collapse-all') {
            items.forEach(function(it) { it.classList.add('toc-collapsed'); });
          } else if (action === 'expand-level') {
            items.forEach(function(it) {
              var lvl = parseInt(it.getAttribute('data-level'));
              if (lvl <= level) {
                it.classList.remove('toc-collapsed');
              } else {
                it.classList.add('toc-collapsed');
              }
            });
          }
        });
      });
    })();
  </script>

</body>
</html>`
}
