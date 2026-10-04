# solid-tiptap

> SolidJS bindings for [Tiptap](https://tiptap.dev/)

[![NPM](https://img.shields.io/npm/v/solid-tiptap.svg)](https://www.npmjs.com/package/solid-tiptap) [![Open in StackBlitz](https://img.shields.io/badge/Open%20in-StackBlitz-blue?style=flat-square&logo=stackblitz)](https://stackblitz.com/github/lxsmnsyc/solid-tiptap/tree/main/examples/simple-example)

![solid-tiptap example](https://github.com/lxsmnsyc/solid-tiptap/blob/main/images/solid-tiptap.png?raw=true)

## Install

```bash
npm i solid-tiptap@next @tiptap/core @tiptap/pm
```

```bash
yarn add solid-tiptap@next @tiptap/core @tiptap/pm
```

```bash
pnpm add solid-tiptap@next @tiptap/core @tiptap/pm
```

You also need the Tiptap extensions you plan to use, such as `@tiptap/starter-kit`.

## Requirements

- `solid-js` 2.0 or later.
- `@tiptap/core` and `@tiptap/pm` 3.x.
- Node.js 22.12 or later, if you import the package in Node.js.

Use `solid-tiptap@0.8` for Solid 1.x, and `solid-tiptap@0.7` for Solid 1.x with Tiptap 2.

## Usage

```tsx
import StarterKit from '@tiptap/starter-kit';
import { createTiptapEditor } from 'solid-tiptap';

function App() {
  let ref!: HTMLDivElement;

  const editor = createTiptapEditor(() => ({
    element: ref,
    extensions: [StarterKit],
    content: `<p>Example Text</p>`,
  }));

  return <div id="editor" ref={ref} />;
}
```

`createTiptapEditor` returns an accessor for the editor.

- The editor is created after the component mounts, once `element` is set. The accessor returns `undefined` until then.
- The options function is tracked. When a signal it reads changes, the old editor is destroyed and a new one is created.
- The editor is destroyed when the owning component unmounts.

Because the options are tracked, read signals that should not recreate the editor with `untrack`.

```tsx
import { untrack } from 'solid-js';

const editor = createTiptapEditor(() => ({
  element: ref,
  extensions: [StarterKit],
  // Changing `initialContent` later does not recreate the editor.
  content: untrack(initialContent),
}));
```

Use the editor's own commands to update it after it is created.

```ts
editor()?.commands.setContent('<p>New content</p>');
editor()?.setEditable(false);
```

### Passing the editor to other components

Render the components that need the editor inside `<Show>`, so they only run once the editor exists.

```tsx
const editor = createTiptapEditor(() => ({ ... }));

<Show when={editor()} keyed>
  {(instance) => <Toolbar editor={instance} />}
</Show>
```

`keyed` passes the editor itself to the children. Without it, Solid passes an accessor, so you would write `editor={instance()}`.

### Signal refs

`element` also accepts `undefined` and `null`. The editor waits until the element is set, so a signal ref works without a non-null assertion.

```tsx
const [element, setElement] = createSignal<HTMLDivElement>();

const editor = createTiptapEditor(() => ({
  element: element(),
  extensions: [StarterKit],
}));

return <div ref={setElement} />;
```

### Bubble and floating menus

Tiptap's `BubbleMenu` and `FloatingMenu` extensions take an `element` option. Pass a mounted element the same way you pass the editor element.

```tsx
import BubbleMenu from '@tiptap/extension-bubble-menu';

function App() {
  let container!: HTMLDivElement;
  let menu!: HTMLDivElement;

  const editor = createTiptapEditor(() => ({
    element: container,
    extensions: [StarterKit, BubbleMenu.configure({ element: menu })],
  }));

  return (
    <>
      <div ref={menu}>
        <Show when={editor()} keyed>
          {(instance) => <Toolbar editor={instance} />}
        </Show>
      </div>
      <div ref={container} />
    </>
  );
}
```

### Reading editor state

Tiptap does not notify Solid when the editor changes. `createEditorTransaction` reads a value again after every editor transaction, so you can use it in JSX and effects.

```ts
import { createEditorTransaction } from 'solid-tiptap';

const isBold = createEditorTransaction(
  () => props.editor,
  (editor) => editor.isActive('bold'),
);

createEffect(isBold, (bold) => {
  if (bold) {
    // ...
  }
});
```

Like any Solid 2 signal, the new value is visible after Solid applies queued updates. Call `flush()` from `solid-js` if you need it right away, for example in a test.

```ts
editor.commands.setContent('<p>Bye</p>');
flush();
html(); // '<p>Bye</p>'
```

The read function receives whatever the first accessor returns. If that can be `undefined`, handle it in the read function.

```ts
const length = createEditorTransaction(
  editor,
  (instance) => instance?.state.doc.textContent.length ?? 0,
);
```

### Helpers

Each helper wraps `createEditorTransaction` for one part of the [Editor API](https://tiptap.dev/docs/editor/api/editor). Each takes an editor accessor, which may return `undefined`. Each returns an accessor that returns `undefined` while there is no editor.

| Helper                | Reads                  | Returns       |
| --------------------- | ---------------------- | ------------- |
| `useEditorHTML`       | `editor.getHTML()`     | `string`      |
| `useEditorJSON`       | `editor.getJSON()`     | `JSONContent` |
| `useEditorIsActive`   | `editor.isActive(...)` | `boolean`     |
| `useEditorIsEmpty`    | `editor.isEmpty`       | `boolean`     |
| `useEditorIsEditable` | `editor.isEditable`    | `boolean`     |
| `useEditorIsFocused`  | `editor.isFocused`     | `boolean`     |

```ts
const html = useEditorHTML(editor);

createEffect(html, (value) => {
  saveHTML(value);
});
```

```ts
const json = useEditorJSON(editor);

createEffect(json, (data) => {
  if (data) {
    uploadJSON(data);
  }
});
```

`useEditorIsActive` takes a name accessor with optional attributes, a name accessor alone, or attributes alone.

```ts
// A node or mark by name.
const isBold = useEditorIsActive(editor, () => 'bold');

// A node or mark by name and attributes.
const isHeading = useEditorIsActive(editor, () => 'heading', { level: 1 });

// Any node or mark with these attributes.
const isCentered = useEditorIsActive(editor, { textAlign: 'center' });
```

## API

### `createTiptapEditor(options)`

Creates a Tiptap editor. Also exported as `createEditor`, `useEditor` and `useTiptapEditor`.

- `options` is a function that returns Tiptap's [editor options](https://tiptap.dev/docs/editor/api/editor#settings). No editor is created while `element` is `undefined` or `null`.
- Returns `() => Editor | undefined`.

### `createEditorTransaction(editor, read)`

- `editor` is a function that returns an `Editor` or `undefined`.
- `read` is called with the result of `editor()`. Its result is returned by the accessor.
- Returns an accessor that runs `read` again after every editor transaction.

### Types

- `UseEditorOptions` is the options type for `createTiptapEditor`. Its `element` is `HTMLElement | null | undefined`.
- `BaseEditorOptions` is Tiptap's `EditorOptions` without `element`, with every field optional.

## Sponsors

![Sponsors](https://github.com/lxsmnsyc/sponsors/blob/main/sponsors.svg?raw=true)

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
