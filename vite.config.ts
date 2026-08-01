import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev-server config only. The distributable package is built by tsup
 * (see tsup.config.ts) and the stylesheet by the Tailwind CLI.
 * Tailwind is wired through PostCSS (postcss.config.mjs), so Vite and
 * Storybook share one pipeline.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
