import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  base: './', // Use relative paths for all assets
  resolve: {
    alias: {
      '@shared/web-components': path.resolve(__dirname, '../../shared/web-components/index.ts'),
    },
  },
  build: {
    outDir: 'dist', // Output to local dist directory
    emptyOutDir: true,
  },
});
