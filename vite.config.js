import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  base: '/',
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        '2021/03/27/hello-world/index': resolve(__dirname, 'src/2021/03/27/hello-world/index.html'),
      }
    }
  },
  server: {
    open: true
  }
})
