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
              博客使用 Hexo 静态网站生成器构建，托管在 GitHub Pages 上。
            </p>

            <h2>关于我</h2>
            <p>
              我是一名热爱技术的开发者，喜欢探索新技术和学习新知识。
              这个博客主要用于记录学习笔记，希望能够帮助到有同样兴趣的朋友。
            </p>

            <h2>技术栈</h2>
            <ul>
              <li><strong>前端</strong>: HTML, CSS, JavaScript</li>
              <li><strong>博客框架</strong>: Hexo</li>
              <li><strong>主题</strong>: 自定义主题</li>
              <li><strong>托管</strong>: GitHub Pages</li>
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
