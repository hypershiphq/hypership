import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    outDir: 'dist',
    rollupOptions: {
      external: [
        /node:.*/,
        'child_process',
        'stream',
        'readline',
        'events',
        'process',
        'path',
        'fs',
        'os',
        ...Object.keys(require('./package.json').dependencies || {}),
        ...Object.keys(require('./package.json').devDependencies || {}),
      ],
      output: {
        banner: '#!/usr/bin/env node',
        format: 'es',
        inlineDynamicImports: true,
      },
    },
    target: 'node20',
    sourcemap: true,
  },
})
