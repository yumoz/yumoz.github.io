import { posts } from '../posts-data.js'

export function renderMedia() {
  const mediaPosts = posts.filter(p => p.tags && p.tags.some(t => ['媒体', '视频', '音频', '图片'].includes(t)))

  const mediaItems = [
    {
      type: '视频',
      title: 'B站视频嵌入',
      html: `<div class="video-wrapper"><iframe src="https://player.bilibili.com/player.html?aid=800379855&bvid=BV1uy4y1q7tw&cid=259528546&page=1&as_wide=1&high_quality=1&danmaku=0" frameborder="no" scrolling="no" allowfullscreen></iframe></div>`
    },
    {
      type: '图片',
      title: '本地图片',
      html: `<img src="/yumoz.jpg" alt="博客头像" style="width:100%;max-width:400px;border-radius:var(--radius-sm);display:block">`
    },
  ]

  return `
    <div class="main-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">媒体</h1>
          <p class="page-subtitle">视频、图片、音频等内容集合</p>
        </div>

        <div class="media-gallery">
          ${mediaItems.map(item => `
            <div class="media-section-item animate-on-scroll">
              <h2 class="media-item-title">${item.title}</h2>
              <div class="media-card">${item.html}</div>
            </div>
          `).join('')}
        </div>

        ${mediaPosts.length ? `
          <div class="media-section-item animate-on-scroll" style="margin-top:60px">
            <h2 class="media-item-title">相关文章</h2>
            <div class="link-cards">
              ${mediaPosts.map(p => `
                <a href="${p.url}" class="link-card">
                  <span class="link-card-title">${p.title}</span>
                  <span class="link-card-desc">${p.description || p.date}</span>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `
}
