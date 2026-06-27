export function renderHome() {
  return `
    <section class="hero">
      <div class="container">
        <div class="hero-inner">
          <h1 class="hero-title">Yumoz</h1>
          <p class="hero-tagline">yumoz的专属博客</p>
          <div class="hero-divider">
            <span>&#9670;</span>
          </div>
          <p class="hero-description">
            欢迎访问我的博客，感谢收藏，常来
          </p>
        </div>
      </div>
    </section>

    <section class="posts-section">
      <div class="container">
        <div class="section-label animate-on-scroll">最新文章</div>

        <article class="article-card animate-on-scroll">
          <div class="article-header">
            <div class="article-meta">
              <span class="article-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                2021年3月27日
              </span>
            </div>
            <h2 class="article-title">
              <a href="2021/03/27/hello-world/">Hello World</a>
            </h2>
          </div>
          <p class="article-excerpt">
            Welcome to Hexo! This is your very first post. Check documentation for more info. If you get any problems when using Hexo, you can find the answer in troubleshooting or you can ask me on GitHub...
          </p>
          <div class="article-footer">
            <a href="2021/03/27/hello-world/" class="read-more">
              阅读全文
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <div class="tags">
              <span class="tag">Hexo</span>
              <span class="tag">入门</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="media-section">
      <div class="container">
        <div class="section-label animate-on-scroll">媒体内容</div>
        <div class="media-card animate-on-scroll">
          <div class="video-wrapper">
            <iframe src="https://player.bilibili.com/player.html?aid=800379855&bvid=BV1uy4y1q7tw&cid=259528546&page=1&as_wide=1&high_quality=1&danmaku=0" frameborder="no" scrolling="no" allowfullscreen></iframe>
          </div>
        </div>
      </div>
    </section>
  `;
}
