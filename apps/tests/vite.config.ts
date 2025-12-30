import { defineConfig } from 'vite';
import * as path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  resolve: {
    alias: {
      '@shared/web-components': path.resolve(__dirname, '../../shared/web-components/index.ts'),
    },
  },
  build: {
    outDir: 'dist', // Set to Vite's default output directory
    emptyOutDir: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: 'service-worker.js', dest: '.' },
        { src: 'icon-192.png', dest: '.' },
        { src: 'icon-512.png', dest: '.' }
      ]
    })
  ]
});
