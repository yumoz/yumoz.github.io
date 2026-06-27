# Yumoz Blog

个人技术博客，记录学习与成长。

基于 Vite 构建，Markdown 驱动，部署在 GitHub Pages。

## 快速开始

```bash
npm install      # 安装依赖
npm run dev      # 本地开发（热更新）
npm run build    # 生产构建 → dist/
```

## 写新文章

在 `posts/<slug>/index.md` 创建 Markdown 文件：

```yaml
---
title: 文章标题
date: 2026-06-27
tags: [标签]
---

正文内容...
```

推送到 `master` → GitHub Actions 自动构建部署。

## 技术栈

- Vite 6 — 构建工具
- vanilla JS — SPA 路由
- marked + gray-matter — Markdown / front-matter 处理
- GitHub Pages + Actions — 部署
- AI（Claude / ChatGPT）— 部分代码与内容由 AI 辅助生成
