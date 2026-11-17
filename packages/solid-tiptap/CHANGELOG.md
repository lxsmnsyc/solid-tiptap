# solid-tiptap

## 0.9.0

### Minor Changes

- 885a4e2: Build the package with tsdown. The package now ships one ESM and one CJS build, without separate development builds.

  - `useEditorJSON` now returns Tiptap's `JSONContent` type. It no longer takes a type parameter for the result.
  - The helpers no longer take an editor type parameter. They accept any accessor that returns an `Editor` or `undefined`.
  - `useEditorIsActive(editor, () => 'name')` now checks the name. Before, it passed the accessor to `isActive`.
  - `BaseEditorOptions` is now exported.
