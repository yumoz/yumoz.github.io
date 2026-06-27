# AGENTS.md — yumoz.github.io

## What this is

A personal blog hosted on GitHub Pages. This repo is **built output only** — there is no Hexo source, no `package.json`, no build tooling, no tests, no CI.

## Key quirks

- **Dual theme**: root pages (`index.html`, `about.html`, `archives.html`) use a custom modern theme (`css/main.css`). Archive pages under `archives/` use the original Hexo default theme (`css/style.css`). Any new page should use the modern theme and link to `css/main.css`.
- **Two archives pages**: `archives.html` (modern theme) is the canonical one. `archives/index.html` (Hexo-generated, old theme) is a dead end — do not link to it.
- **Broken paths in legacy pages**: Pages under `archives/` have hardcoded paths with an incorrect `yumoz.github.io.git/` prefix. Fix these if touched.
- **No `.nojekyll`**, **no `.gitignore`** — add `.nojekyll` if underscore-prefixed directories are ever introduced.
- **All assets are vendored** (jQuery, Fancybox, FontAwesome fonts) — no CDN dependencies except the legacy archive pages.

## Adding content

No build step. Edit HTML directly. To maintain visual consistency:
- Copy an existing modern-themed page as a template.
- Reference `css/main.css` (not `css/style.css`).
- Use the nav bar pattern from `index.html`/`about.html`.
- Include the Google Fonts `<link>` tags (Playfair Display, Noto Serif SC, JetBrains Mono) from `index.html` in `<head>` — the CSS depends on them.
