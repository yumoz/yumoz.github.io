export function renderAbout() {
  return `
    <div class="main-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">关于</h1>
          <p class="page-subtitle">了解这个博客</p>
        </div>

        <div class="article-full">
          <div class="article-content">
            <h2>关于博客</h2>
            <p>
              这是一个个人技术博客，用于记录学习过程中的笔记和心得。
              博客基于 Vite 构建，使用 Markdown 驱动内容，托管在 GitHub Pages 上。
            </p>

            <h2>关于我</h2>
            <p>
              我是一名热爱技术的开发者，喜欢探索新技术和学习新知识。
              这个博客主要用于记录学习笔记，希望能够帮助到有同样兴趣的朋友。
            </p>

            <h2>技术栈</h2>
            <ul>
              <li><strong>构建工具</strong>: Vite 6</li>
              <li><strong>内容</strong>: Markdown + marked + gray-matter</li>
              <li><strong>数学</strong>: KaTeX（构建时渲染）</li>
              <li><strong>主题</strong>: 自定义暗色琥珀主题</li>
              <li><strong>托管</strong>: GitHub Pages + Actions</li>
            </ul>

            <h2>联系方式</h2>
            <p>
              你可以通过以下方式找到我：
            </p>
            <ul>
              <li>GitHub: <a href="https://github.com/yumoz">github.com/yumoz</a></li>
              <li>邮箱: zealouszxl@163.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
