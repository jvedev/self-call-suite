import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: '../../docs',
    emptyOutDir: false,
    minify: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
        {
          src: 'public/service-worker.js',
          dest: '.',
        },
      ],
    }),
  ],
  server: {
    port: 5173,
  },
})

