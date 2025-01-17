import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'
import fs from 'fs'

const isDev = process.env.NODE_ENV === 'development'

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  server: {
    port: 8080,
    https: isDev
      ? {
          key: fs.readFileSync(path.resolve(__dirname, '../api/ssl/key.pem')),
          cert: fs.readFileSync(path.resolve(__dirname, '../api/ssl/cert.pem')),
        }
      : undefined,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
