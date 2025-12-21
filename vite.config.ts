/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from 'path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
        vite: {
          build: {
            rollupOptions: {
              output: {
                format: 'cjs', // Force CommonJS
                entryFileNames: '[name].cjs', // Force .cjs extension
                inlineDynamicImports: true,
              },
            },
          },
        },
      },
      renderer: {},
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
  },
})
