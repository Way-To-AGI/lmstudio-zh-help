import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'index.js'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'fs-extra',
        'path',
        'glob',
        'replace-in-file',
        'inquirer',
        'chalk',
        'os',
        'url'
      ],
      output: {
        banner: '#!/usr/bin/env node',
        inlineDynamicImports: true
      }
    },
    minify: false,
    target: 'node14',
    outDir: 'dist',
    emptyOutDir: true
  }
}); 