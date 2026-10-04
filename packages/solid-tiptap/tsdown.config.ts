import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  // Solid 2 ships ESM only, so this package does too.
  format: ['esm'],
  platform: 'neutral',
  target: 'es2022',
  dts: true,
  sourcemap: true,
  clean: true,
  exports: true,
  publint: true,
});
