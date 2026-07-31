import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from /<repo>/, so the CI build sets
  // VITE_BASE_PATH. Local dev and plain `npm run build` stay at the web root.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
