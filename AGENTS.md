# AGENTS.md — yumoz.github.io

## What this is

A personal blog hosted on GitHub Pages. Built with **Vite** (multi-page). Source in `src/`, static assets in `public/`, output in `dist/`.

## Commands

- `npm run dev` — dev server with hot reload
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the built site locally

## Structure

```
src/                  # Vite root — HTML, CSS source
  index.html          # Home page (modern theme)
  about.html          # About page
  archives.html       # Archives (modern theme)
  2021/03/27/hello-world/index.html  # Blog post
  css/main.css        # Modern theme CSS (dark amber editorial)
public/               # Copied as-is to dist/
  css/style.css       # Legacy Hexo theme (for old archive pages)
  css/fonts/          # FontAwesome webfonts
  css/images/         # banner.jpg
  fancybox/           # jQuery Fancybox lightbox
  js/                 # jQuery 3.4.1, script.js
archives/             # Legacy Hexo-generated archive pages (old theme)
.github/workflows/    # CI: builds with Vite, deploys to GitHub Pages
dist/                 # Build output (gitignored)
```

## Key quirks

- **Dual theme**: `src/` pages use a custom dark amber theme (`css/main.css`). Pages under `archives/` use the original Hexo default theme (`css/style.css` in `public/`). Any new page should go in `src/` and use `css/main.css`.
- **Two archives pages**: `src/archives.html` (modern theme) is the canonical one. `archives/index.html` (Hexo-generated, old theme) is a dead end — do not link to it.
- **Broken paths in legacy pages**: Pages under `archives/` have hardcoded paths with an incorrect `yumoz.github.io.git/` prefix. Fix these if touched.
- **No `.nojekyll`** — add it if underscore-prefixed directories are introduced.
- **All assets are vendored** in `public/` (jQuery, Fancybox, FontAwesome fonts) — no CDN dependencies except the legacy archive pages.

## Adding content

- Add new HTML in `src/` and register it in `vite.config.js` `rollupOptions.input`.
- Copy an existing modern-themed page as a template.
- Reference `css/main.css` (not `css/style.css`). Relative path from any depth works (Vite resolves it).
- Use the nav bar pattern from `src/index.html`.
- Include the Google Fonts `<link>` tags from `src/index.html` in `<head>` — the CSS depends on them.
- Static files (images, vendor JS) go in `public/` and are referenced with absolute paths (`/js/...`).

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `master` and deploys `dist/` to GitHub Pages. Configure Pages source to "GitHub Actions" in repo settings.
