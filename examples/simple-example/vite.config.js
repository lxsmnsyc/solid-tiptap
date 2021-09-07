import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@tiptap/core',
      '@tiptap/starter-kit',
      '@tiptap/extension-bubble-menu',
    ],
  },
  plugins: [solidPlugin()],
});
