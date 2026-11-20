/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is only set for production builds so `npm run dev` still serves at
// the site root; GitHub Pages project sites are served from /<repo-name>/.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ai-worldview-atlas/' : '/',
  plugins: [react()],
  build: {
    // Two chunks are large on purpose and load only when needed: the PDF library (on "Download PDF") and the results
    // page with its 50 reports. The first screen loads about 245 kB.
    chunkSizeWarningLimit: 1500,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
}))
