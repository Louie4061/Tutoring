import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false, // Only relevant if your backend uses HTTPS with a self-signed cert
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});