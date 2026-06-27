import { posts } from '../posts-data.js'

export function renderArchives() {
  const grouped = {}
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(post)
  }

  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  let html = `
    <div class="main-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">文章归档</h1>
          <p class="page-subtitle">所有文章的集合</p>
        </div>

        <div class="archive-list-container">
  `

  for (const year of years) {
    const monthDay = (d) => {
      const m = d.slice(5, 7)
      const day = d.slice(8, 10)
      return `${parseInt(m)}月${parseInt(day)}日`
    }
    html += `
          <div class="archive-year">
            <h2 class="archive-year-title">${year}</h2>
            <ul class="archive-list">
              ${grouped[year].map(p => `
                <li class="archive-item">
                  <span class="archive-date">${monthDay(p.date)}</span>
                  <span class="archive-title">
                    <a href="${p.url}">${p.title}</a>
                  </span>
                </li>
              `).join('')}
            </ul>
          </div>
    `
  }

  html += `
        </div>
      </div>
    </div>
  `

  return html
}
