import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@shared/types': path.resolve(__dirname, 'shared/types/src'),
      '@shared/web-components': path.resolve(__dirname, 'shared/web-components/src')
    }
  }
});

// No changes needed for ?raw imports unless you have custom plugins interfering.
// If you have custom plugins, ensure they do not block .html or .css files with ?raw.
