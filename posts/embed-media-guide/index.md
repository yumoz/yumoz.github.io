---
title: 如何在博客中嵌入媒体内容
date: 2026-06-27
tags: [媒体, 视频, 图片, 使用指南]
description: 详解在博客文章中嵌入视频、音频、图片、动图等多媒体内容的方法
---

本博客支持在文章中嵌入多种多媒体内容。以下是常见类型的用法。

## 嵌入图片

最简单的图片嵌入使用标准 Markdown：

```markdown
![图片描述](/yumoz.jpg)
```

实际效果：

![博客头像](/yumoz.jpg)

也可以使用 HTML 控制尺寸和样式：

```html
<img src="/yumoz.jpg" alt="描述" width="400" style="border-radius: 8px;">
```

使用 HTML 控制后的效果：

<img src="/yumoz.jpg" alt="博客头像" width="400" style="border-radius: 8px; display: block;">

使用 GitHub 或在线图床的外部图片：

```markdown
![示例图片](https://picsum.photos/800/400)
```

> 本地图片放在项目根目录 `public/` 下，构建时会自动复制到 `dist/`，可通过 `/文件名` 直接访问。

## 嵌入动图（GIF）

GIF 与普通图片用法相同，使用 `.gif` 格式即可：

```markdown
![动图演示](https://example.com/animation.gif)
```

## 嵌入视频

### B站视频

使用 B站 提供的嵌入代码：

```html
<div class="video-wrapper">
  <iframe src="https://player.bilibili.com/player.html?aid=视频AID&bvid=BV号&cid=CID&page=1&as_wide=1&high_quality=1&danmaku=0" frameborder="no" scrolling="no" allowfullscreen></iframe>
</div>
```

实际效果：

<div class="video-wrapper">
  <iframe src="https://player.bilibili.com/player.html?aid=800379855&bvid=BV1uy4y1q7tw&cid=259528546&page=1&as_wide=1&high_quality=1&danmaku=0" frameborder="no" scrolling="no" allowfullscreen></iframe>
</div>

参数说明：

- `aid` — 视频 AV 号
- `bvid` — 视频 BV 号（推荐）
- `cid` — 分 P ID
- `high_quality=1` — 开启高清
- `danmaku=0` — 关闭弹幕

### YouTube 视频

```html
<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/视频ID" frameborder="no" allowfullscreen></iframe>
</div>
```

> `video-wrapper` 类自动实现 16:9 比例响应式容器。

## 嵌入音频

### 本地音频文件

```html
<audio controls style="width:100%">
  <source src="/path/to/audio.mp3" type="audio/mpeg">
  您的浏览器不支持音频播放。
</audio>
```

### 网易云音乐

```html
<iframe frameborder="no" src="https://music.163.com/outchain/player?type=2&id=歌曲ID&auto=0&height=66" height="66"></iframe>
```

### QQ 音乐

打开 QQ 音乐网页版（`y.qq.com`），找到目标歌曲 → 分享 → 复制外链播放器代码：

```html
<iframe frameborder="no" src="https://y.qq.com/n/ryqq/player?type=song&id=615409845" height="80" allowfullscreen></iframe>
```

也可以直接链接到分享页：

```html
<a href="https://i.y.qq.com/v8/playsong.html?songid=615409845&songtype=0" target="_blank">收听歌曲</a>
```

实际效果：

<iframe frameborder="no" src="https://y.qq.com/n/ryqq/player?type=song&id=615409845" height="80" allowfullscreen></iframe>

## 添加媒体到「媒体」页面

在 `posts/<slug>/index.md` 的 YAML 头信息中添加 `媒体` 标签，该文章会自动出现在媒体页面的「相关文章」区域中：

```yaml
---
title: 我的视频笔记
date: 2026-06-27
tags: [媒体, 视频]
---
```

也可以在 `src/js/pages/media.js` 中添加更多内嵌媒体卡片到 `mediaItems` 数组中，格式如下：

```js
{
  type: '视频',
  title: '标题',
  html: `<div class="video-wrapper">...</div>`
}
```
