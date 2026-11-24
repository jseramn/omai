import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const external = /^(react|react-dom|lucide-react|clsx|tailwind-merge|@jseramn\/omai-tokens)(\/.*)?$/;

/**
 * Library build: ESM, one output file per source module (tree-shakeable),
 * every chunk prefixed with "use client" (RSC-safe). Types come from `tsc -p tsconfig.build.json`,
 * CSS from `scripts/build-css.mjs`.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rolldownOptions: {
      external: (id) => external.test(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        banner: '"use client";',
      },
    },
  },
});
