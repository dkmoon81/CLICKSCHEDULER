import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base path for GitHub Pages under the repo name
export default defineConfig({
  base: '/CLICKSCHEDULER/',
  plugins: [react()]
})
