import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Add any path aliases you need (matches your existing directories)
      '@': '/',
      '@components': '/components',
      '@assets': '/assets'
    }
  }
})