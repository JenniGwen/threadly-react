import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Semua request ke /api/... diteruskan ke Laravel (php artisan serve).
    // Jadi dari React cukup fetch("/api/posts") tanpa mikirin CORS.
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
