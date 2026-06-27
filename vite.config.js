import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync, existsSync } from 'fs'

function findHtmlEntries(dir) {
  const entries = {}
  function walk(d) {
    const items = readdirSync(d, { withFileTypes: true })
    for (const item of items) {
      const full = resolve(d, item.name)
      if (item.isDirectory()) walk(full)
      else if (item.name === 'index.html') {
        const key = full.replace(/\\/g, '/').replace(/^.*?src\//, '').replace('/index.html', '')
        entries[key] = full
      }
    }
  }
  walk(dir)
  return entries
}

const srcDir = resolve(__dirname, 'src')
const input = existsSync(srcDir) ? findHtmlEntries(srcDir) : {}

export default defineConfig({
  root: 'src',
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: { input }
  },
  server: {
    open: true
  }
})
