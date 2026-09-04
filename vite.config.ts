import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
      rollupOptions: {
        output: {
          dir: './dist/',
          entryFileNames: 'jj-aaron-winefest-vendor-dashboard-1.0.0.js',
          assetFileNames: 'jj-aaron-winefest-vendor-dashboard.css',
        }
      }
    },
})
