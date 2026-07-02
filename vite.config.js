import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for React project. This plugin enables fast
// refresh during development and compiles JSX automatically. The
// server configuration exposes the dev server on all interfaces so
// you can view the app from the host machine as well. The preview
// command uses the same port by default.

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    port: 5173
  }
});