import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Force this port
    strictPort: true, // Exit if port is occupied
  },
  resolve: {
    alias: {
      // Add any path aliases you need (matches your existing directories)
      '@': '/',
      '@components': '/components',
      '@assets': '/assets'
    }
  }
})