import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, // disables JS minification (esbuild by default)
    cssMinify: false, // optional: also disable CSS minification
      rollupOptions: {
        output: {
          dir: './dist/',
          entryFileNames: 'jj-aaron-winefest-vendor-dashboard-1.1.0.js',
          assetFileNames: 'jj-aaron-winefest-vendor-dashboard-1.1.0.css',
        },
      }
    },
})
