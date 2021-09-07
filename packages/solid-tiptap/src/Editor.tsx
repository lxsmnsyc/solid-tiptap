import {
  createEffect,
  createSignal,
  on,
  onCleanup,
} from 'solid-js';
import {
  Editor,
  EditorOptions,
} from '@tiptap/core';

export type EditorRef = Editor | ((editor: Editor) => void);

export type BaseEditorOptions = Omit<Partial<EditorOptions>, 'element'>;

export interface UseEditorOptions<T extends HTMLElement> extends BaseEditorOptions {
  element: () => T;
}

const WATCHED_PROPERTIES: (keyof BaseEditorOptions)[] = [
  'autofocus',
  'content',
  'editable',
  'editorProps',
  'enableInputRules',
  'enablePasteRules',
  'extensions',
  'injectCSS',
  'parseOptions',
];

function createOptionPatch(
  instance: Editor,
  field: keyof BaseEditorOptions,
  props: BaseEditorOptions,
): void {
  createEffect(on(() => props[field], (value) => {
    instance.setOptions({
      [field]: value,
    });
  }));
}

export function createEditorTransaction<T, V extends Editor | undefined>(
  instance: () => V,
  read: (value: V) => T,
): () => T {
  const [signal, setSignal] = createSignal([]);

  function forceUpdate() {
    setSignal([]);
  }

  createEffect(() => {
    const editor = instance();
    if (editor) {
      editor.on('transaction', forceUpdate);
      onCleanup(() => {
        editor.off('transaction', forceUpdate);
      });
    }
  });

  return () => {
    signal();
    return read(instance());
  };
}

export default function useEditor<T extends HTMLElement>(
  props: UseEditorOptions<T>,
): () => Editor | undefined {
  const [signal, setSignal] = createSignal<Editor>();

  createEffect(() => {
    const instance = new Editor({
      ...props,
      element: props.element(),
    });

    for (let i = 0, len = WATCHED_PROPERTIES.length; i < len; i += 1) {
      createOptionPatch(instance, WATCHED_PROPERTIES[i], props);
    }

    onCleanup(() => {
      instance.destroy();
    });

    setSignal(instance);
  });

  return signal;
}
