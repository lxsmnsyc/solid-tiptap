# solid-tiptap

> SolidJS bindings for [tiptap](https://www.tiptap.dev/)

[![NPM](https://img.shields.io/npm/v/solid-tiptap.svg)](https://www.npmjs.com/package/solid-tiptap) [![JavaScript Style Guide](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/github/LXSMNSYC/solid-tiptap/tree/main/examples/solid-tiptap-demo)

## Install

```bash
yarn add @tiptap/core solid-tiptap
```

## Usage

```jsx
import { createTiptapEditor } from 'solid-tiptap';
import StarterKit from '@tiptap/starter-kit';

function App() {
  let ref!: HTMLDivElement;

  const editor = createTiptapEditor({
    get element() {
      return ref;
    },
    get extensions() {
      return [
        StarterKit,
      ];
    },
    content: `<p>Example Text</p>`,
  });

  return <div id="editor" ref={ref} />;
}
```

### Transactions

`createEditorTransaction` provides a way to reactively subscribe to editor changes.

```ts
const isBold = createEditorTransaction(
  () => props.editor, // Editor instance from createTiptapEditor
  (editor) => editor.isActive('bold'), 
);

createEffect(() => {
  if (isBold()) {
    // do something
  }
});
```

There are out-of-the-box utilities that wraps `createEditorTransaction` based on the [Editor API](https://www.tiptap.dev/api/editor):

- `useEditorCharacterCount`: reactively subscribe to `getCharacterCount`.

```js
const count = useEditorCharacterCount(() => props.editor);

createEffect(() => {
  console.log('Character Count:', count());
});
```

- `useEditorHTML`: reactively subscribe to `getEditorHTML`.

```js
const html = useEditorHTML(() => props.editor);

createEffect(() => {
  updateHTML(html());
});
```

- `useEditorIsActive`: reactively subscribe to `isActive`.

```js
const isHeading = useEditorIsActive(() => props.editor, () => 'heading', {
  level: 1,
});

createEffect(() => {
  if (isHeading()) {
    // do something
  }
});
```

- `useEditorIsEditable`: reactively subscribe to `isEditable`.

```js
const isEditable = useEditorIsEditable(() => props.editor);

createEffect(() => {
  if (isEditable()) {
    // do something
  }
});
```

- `useEditorIsEmpty`: reactively subscribe to `isEmpty`.

```js
const isEmpty = useEditorIsEmpty(() => props.editor);

createEffect(() => {
  if (isEmpty()) {
    // do something
  }
});
```

- `useEditorIsFocused`: reactively subscribe to `isFocused`.

```js
const isFocused = useEditorIsFocused(() => props.editor);

createEffect(() => {
  if (isFocused()) {
    // do something
  }
});
```

- `useEditorJSON`: reactively subscribe to `getJSON`.

```js
const json = useEditorJSON(() => props.editor);

createEffect(() => {
  const data = json();

  if (data) {
    uploadJSON(data);
  }
});
```

## Tips

Since `createTiptapEditor` may return `undefined` (the instanciation is scheduled), and you're planning to pass it to another component (e.g. creating `BubbleMenu` or Toolbar), it is recommended to use ternary evaluation (e.g. `<Show>`) to check if the editor is `undefined` or not.

```js
const editor = createTiptapEditor({ ... });

<Show when={editor()}>
  {(instance) => <EditorMenu editor={instance} />}
</Show>
```

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
