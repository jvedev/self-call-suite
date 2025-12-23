import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@shared/web-components': path.resolve(__dirname, '../../shared/web-components/index.ts'),
    },
  },
});
