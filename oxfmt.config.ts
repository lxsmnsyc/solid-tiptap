import { defineConfig } from 'oxfmt';

export default defineConfig({
  singleQuote: true,
  // Changesets end up in the changelog as written.
  ignorePatterns: ['**/dist/**', '.changeset/*.md'],
});
