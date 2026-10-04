# Changesets

Add a changeset for every change that affects a published package.

```bash
pnpm cs:add
```

The release workflow opens a "Version Packages" pull request from the pending changesets. Merging it publishes the new versions to npm.
