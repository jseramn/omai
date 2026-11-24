import { defineConfig } from 'vitest/config';
import { defaultClientConditions } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolve workspace packages (@jseramn/omai-tokens) to their TypeScript source.
    conditions: ['source', ...defaultClientConditions],
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
  },
});
