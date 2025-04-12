import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // <-- Make sure this matches what Vercel expects
  },
  base: './' // <-- Required if you're deploying under a subpath or want relative URLs
})
