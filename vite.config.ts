import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/styles/_variables.scss";`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
