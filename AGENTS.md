# AGENTS.md — yumoz.github.io

## What this is

A personal blog hosted on GitHub Pages. Built with **Vite** (multi-page). Source in `src/`, output in `dist/`.

## Commands

- `npm run dev` — dev server with hot reload
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the built site locally
- `npm run build:posts` — manually regenerate posts from markdown
- `npm run dev:no-posts` — skip markdown build (start dev faster): `vite`
- `npm run build:no-posts` — build without regenerating: `vite build`

## Structure

```
src/                  # Vite root — HTML, CSS, JS source
  index.html          # Single SPA entry point (hash routing)
  js/
    main.js           # Router, theme toggle, scroll observer
    pages/
      home.js         # Home page content
      about.js        # About page content
      archives.js     # Archives page content
  css/main.css        # Modern theme CSS (dark amber editorial)
posts/                # Markdown source for blog posts
  <slug>/index.md     # Each post in its own directory
scripts/
  build-posts.mjs     # Markdown → HTML generator
.github/workflows/    # CI: builds with Vite, deploys to GitHub Pages
dist/                 # Build output (gitignored)
```

## Markdown posts system

Write posts as markdown in `posts/<slug>/index.md` with YAML front-matter:

```yaml
---
title: My Post Title
date: 2026-06-27
tags: [tag1, tag2]
description: Optional description for meta tags
---

Content here...
```

On build (`npm run build`), `scripts/build-posts.mjs`:
1. Reads all `posts/*/index.md`
2. Generates `src/YYYY/MM/DD/slug/index.html` (standalone page with theme)
3. Generates `src/js/posts-data.js` (manifest → bundled into SPA)
4. Cleans up orphaned generated files

The generated HTML pages and `posts-data.js` are gitignored (`src/20??/`, `src/js/posts-data.js`). Only the markdown source in `posts/` is tracked.

## Key quirks

- **SPA**: about and archives are JS modules rendered into `#app` via hash routing (`#/`, `#/about`, `#/archives`). Blog posts are standalone static pages at `/YYYY/MM/DD/slug/`.
- **Existing hello-world post**: the markdown source lives at `posts/hello-world/index.md`. The generated HTML is in `src/2021/03/27/hello-world/` (tracked for backward compatibility; new posts under `src/20??/` are gitignored).
- **No `.nojekyll`** — add it if underscore-prefixed directories are introduced.

## Adding content

- New blog post: create `posts/<slug>/index.md` with front-matter. Run `npm run build:posts` to regenerate.
- Add a new SPA page: create a render function in `src/js/pages/` and register it in `src/js/main.js` routes.
- Reference `css/main.css`. Vite resolves relative paths from any depth.
- Use the nav bar pattern from `src/index.html`.
- Include the Google Fonts `<link>` tags from `src/index.html` in `<head>` — the CSS depends on them.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `master` and deploys `dist/` to GitHub Pages. Configure Pages source to "GitHub Actions" in repo settings.
