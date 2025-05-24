import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // allowedHosts: ['shoes-auctions-amongst-contrast.trycloudflare.com'],
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    outDir: 'dist', // Default for Vite
  }
})
