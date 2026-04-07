import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// GitHub Pages project sites use a subpath; set base to your repo name for production builds.
// Example: `npm run build -- --base=/tamil-trainer/`
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_URL ?? '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
