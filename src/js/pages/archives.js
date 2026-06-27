export function renderArchives() {
  return `
    <div class="main-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">文章归档</h1>
          <p class="page-subtitle">所有文章的集合</p>
        </div>

        <div class="archive-list-container">
          <div class="archive-year">
            <h2 class="archive-year-title">2021</h2>
            <ul class="archive-list">
              <li class="archive-item">
                <span class="archive-date">3月27日</span>
                <span class="archive-title">
                  <a href="2021/03/27/hello-world/">Hello World</a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
