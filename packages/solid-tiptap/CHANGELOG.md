# solid-tiptap

## 1.0.0-next.0

### Major Changes

- 77831bb: Support Solid 2.0. Solid 1.x is no longer supported. Use `solid-tiptap@0.x` with Solid 1.x.

  - `solid-js` 2.0 and Node.js 22.12 or later are required.
  - The package ships ESM only, like Solid 2.
  - `createTiptapEditor` now creates the editor once `element` is set. `element` accepts `undefined` and `null`, so a signal ref works without a non-null assertion.
  - A plain `let` ref still works. The options are read after the component mounts.
  - `UseEditorOptions` no longer takes a type parameter.

### Minor Changes

- 885a4e2: Build the package with tsdown. The package now ships one ESM and one CJS build, without separate development builds.

  - `useEditorJSON` now returns Tiptap's `JSONContent` type. It no longer takes a type parameter for the result.
  - The helpers no longer take an editor type parameter. They accept any accessor that returns an `Editor` or `undefined`.
  - `useEditorIsActive(editor, () => 'name')` now checks the name. Before, it passed the accessor to `isActive`.
  - `BaseEditorOptions` is now exported.
