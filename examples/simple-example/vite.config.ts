import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  plugins: [solid(), tailwindcss()],
});
