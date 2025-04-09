import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  server: {
    proxy: {
      '/lilypad-api': {  // 代理前缀
        target: 'https://anura-testnet.lilypad.tech',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lilypad-api/, '/api/v1'),
        // 移除问题请求头
        headers: { 
          "x-stainless-timeout": "" 
        }
      }
    }
  }
})
