/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is only set for production builds so `npm run dev` still serves at
// the site root; GitHub Pages project sites are served from /<repo-name>/.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/tiam-diagnostic/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
}))
