---
title: 如何使用本项目添加笔记
date: 2021-03-27
tags: [使用指南, Markdown]
description: 介绍如何在本博客中添加和管理笔记文章
---

本博客使用 Markdown 驱动的内容管理系统。写新文章只需两步：创建 Markdown 文件，推送到 GitHub。

## 快速开始

### 新建文章

在 `posts/` 下创建目录和 `index.md`：

```
posts/<文章英文名>/index.md
```

文件头写入 YAML 元信息：

```yaml
---
title: 文章标题
date: 2026-06-27
tags: [标签1, 标签2]
---
```

正文直接写 Markdown 即可。

### 本地预览

```bash
npm install        # 首次安装依赖
npm run dev        # 启动开发服务器（热更新）
```

浏览器打开 `http://localhost:5173` 即可实时预览。

### 生产构建

```bash
npm run build      # 生成静态文件到 dist/
npm run preview    # 预览构建结果
```

构建过程会自动执行以下步骤：

1. `npm run build:posts` — 读取 `posts/` 下所有 Markdown，转换为完整 HTML 页面
2. `vite build` — Vite 打包 SPA 和所有页面到 `dist/`

### 部署

推送到 `master` 分支：

```bash
git add .
git commit -m "新文章：xxx"
git push origin master
```

GitHub Actions 自动构建并部署到 GitHub Pages，几分钟后即可在 `https://yumoz.github.io` 查看。

## 支持的语法

本项目支持标准 Markdown，以及：

- **代码块** — 带语法高亮
- **表格** — 自动添加边框和斑马纹
- **数学公式** — 行内 `$...$` 和块级 `$$...$$`，构建时由 KaTeX 渲染
- **YAML 头信息** — 设置标题、日期、标签

## 目录结构

```
posts/                    # Markdown 源文件
  <slug>/index.md         # 每篇文章一个目录
scripts/
  build-posts.mjs         # Markdown → HTML 构建脚本
src/                      # Vite 源文件
  index.html              # SPA 入口
  css/main.css            # 主题样式
  js/                     # SPA 路由和页面组件
dist/                     # 构建输出（自动生成，不提交）
```
