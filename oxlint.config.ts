import config from '@lxsmnsyc/oxlint-config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [config],
  ignorePatterns: ['**/dist/**', '**/node_modules/**'],
  overrides: [
    {
      // `let ref!: HTMLDivElement` with `ref={ref}` is how Solid hands out an
      // element. The compiler assigns the variable, which the rule cannot see.
      files: ['**/*.tsx'],
      rules: {
        'no-unassigned-vars': 'off',
      },
    },
  ],
});
