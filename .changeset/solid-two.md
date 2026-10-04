---
'solid-tiptap': major
---

Support Solid 2.0. Solid 1.x is no longer supported. Use `solid-tiptap@0.x` with Solid 1.x.

- `solid-js` 2.0 and Node.js 22.12 or later are required.
- The package ships ESM only, like Solid 2.
- `createTiptapEditor` now creates the editor once `element` is set. `element` accepts `undefined` and `null`, so a signal ref works without a non-null assertion.
- A plain `let` ref still works. The options are read after the component mounts.
- `UseEditorOptions` no longer takes a type parameter.
