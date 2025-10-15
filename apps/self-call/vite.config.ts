import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared'),
    }
  },
  assetsInclude: ['**/*.html', '**/*.css'],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});