import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',   // must be '/' for username.github.io
  build: { outDir: 'dist' }
})


