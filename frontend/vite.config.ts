import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@wheredidmycatgo/prediction-engine': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url))
    }
  },
  server: { proxy: { '/api': 'http://localhost:4000' } }
})
