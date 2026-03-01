import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/podpiski/',
  server: {
    host: true,
    port: 5200,
  },
})
