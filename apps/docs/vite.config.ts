import { defineConfig, defaultClientConditions } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Consume @jseramn/omai (TS + CSS) from source for instant HMR; no prebuild needed.
    // @jseramn/omai-tokens/themes.css is generated: run `npm run build:tokens` first (root `npm run dev` does).
    conditions: ['source', ...defaultClientConditions],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
  },
});
