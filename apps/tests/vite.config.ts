import { defineConfig } from 'vite';
import * as path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const outDir = process.env.BUILD_OUTDIR || '../../docs/apps/tests';

export default defineConfig({
  resolve: {
    alias: {
      '@shared/web-components': path.resolve(__dirname, '../../shared/web-components/index.ts'),
    },
  },
  build: {
    outDir,
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
