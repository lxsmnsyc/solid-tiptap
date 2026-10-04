import type { EditorOptions, JSONContent } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import { createEffect, createSignal, onCleanup } from 'solid-js';

export type EditorRef = Editor | ((editor: Editor) => void);

export type BaseEditorOptions = Omit<Partial<EditorOptions>, 'element'>;

export interface UseEditorOptions<T extends HTMLElement> extends BaseEditorOptions {
  element: T;
}

/**
 * Reads a value from the editor and reads it again after every transaction.
 * `read` also receives `undefined` while `instance` returns no editor.
 */
export function createEditorTransaction<T, V extends Editor | undefined>(
  instance: () => V,
  read: (value: V) => T,
): () => T {
  const [depend, update] = createSignal(undefined, { equals: false });

  function forceUpdate(): void {
    update();
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
    depend();
    return read(instance());
  };
}

/**
 * Creates a Tiptap editor from the given options.
 * The editor is destroyed and created again when a signal read by `props` changes.
 * It is also destroyed when the owner is disposed.
 */
export default function useEditor<T extends HTMLElement>(
  props: () => UseEditorOptions<T>,
): () => Editor | undefined {
  const [signal, setSignal] = createSignal<Editor>();

  createEffect(() => {
    const instance = new Editor({
      ...props(),
    });

    onCleanup(() => {
      instance.destroy();
    });

    setSignal(instance);
  });

  return signal;
}

/** Returns the editor content as HTML. */
export function useEditorHTML(editor: () => Editor | undefined): () => string | undefined {
  return createEditorTransaction(editor, (instance) => instance?.getHTML());
}

/** Returns the editor content as Tiptap JSON. */
export function useEditorJSON(editor: () => Editor | undefined): () => JSONContent | undefined {
  return createEditorTransaction(editor, (instance) => instance?.getJSON());
}

/**
 * Returns whether the node or mark at the selection is active.
 * Pass a node or mark name with optional attributes, or only the attributes.
 */
export function useEditorIsActive(
  editor: () => Editor | undefined,
  ...args:
    | [name: () => string, options?: Record<string, unknown>]
    | [options: Record<string, unknown>]
): () => boolean | undefined {
  return createEditorTransaction(editor, (instance) => {
    if (args.length === 2) {
      return instance?.isActive(args[0](), args[1]);
    }
    const [first] = args;
    if (typeof first === 'function') {
      return instance?.isActive(first());
    }
    return instance?.isActive(first);
  });
}

/** Returns whether the editor has no content. */
export function useEditorIsEmpty(editor: () => Editor | undefined): () => boolean | undefined {
  return createEditorTransaction(editor, (instance) => instance?.isEmpty);
}

/** Returns whether the editor accepts input. */
export function useEditorIsEditable(editor: () => Editor | undefined): () => boolean | undefined {
  return createEditorTransaction(editor, (instance) => instance?.isEditable);
}

/** Returns whether the editor has focus. */
export function useEditorIsFocused(editor: () => Editor | undefined): () => boolean | undefined {
  return createEditorTransaction(editor, (instance) => instance?.isFocused);
}
