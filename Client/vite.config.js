

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy: {
      // '/api':'http://localhost:5000',
      // '/api':'https://abhishek-website-i74a.onrender.com',
    },
  },
  plugins: [react()],
})