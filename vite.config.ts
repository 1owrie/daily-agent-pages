import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 本地开发时，将 /api 请求代理到 Workers
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false,
      },
      // GraphQL endpoint 代理
      '/graphql': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
