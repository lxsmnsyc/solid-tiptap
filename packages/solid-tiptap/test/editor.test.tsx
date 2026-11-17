import type { JSX } from '@solidjs/web';
import { render } from '@solidjs/web';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { createRoot, createSignal, flush } from 'solid-js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createEditorTransaction,
  createTiptapEditor,
  useEditorHTML,
  useEditorIsActive,
  useEditorIsEditable,
  useEditorIsEmpty,
  useEditorJSON,
} from '../src';

const cleanups: (() => void)[] = [];

afterEach(() => {
  for (const cleanup of cleanups.splice(0)) {
    cleanup();
  }
});

// Mounts `component` and returns the root element.
function mount(component: () => JSX.Element): HTMLElement {
  const root = document.createElement('div');
  document.body.append(root);
  const dispose = render(component, root);
  cleanups.push(() => {
    dispose();
    root.remove();
  });
  return root;
}

// Lets queued effects run, including those scheduled by `onSettled`.
async function settle(): Promise<void> {
  flush();
  await Promise.resolve();
  flush();
}

function editorOf(accessor: () => Editor | undefined): Editor {
  const editor = accessor();
  if (!editor) {
    throw new Error('the editor was not created');
  }
  return editor;
}

describe('createTiptapEditor', () => {
  it('creates the editor in an element from a `let` ref', async () => {
    let editor!: () => Editor | undefined;
    const root = mount(() => {
      let ref!: HTMLDivElement;
      editor = createTiptapEditor(() => ({
        element: ref,
        extensions: [StarterKit],
        content: '<p>Hello</p>',
      }));
      return <div ref={ref} />;
    });

    await settle();

    expect(editorOf(editor).getHTML()).toBe('<p>Hello</p>');
    expect(root.querySelector('[contenteditable]')).not.toBeNull();
  });

  it('creates the editor in an element from a signal ref', async () => {
    let editor!: () => Editor | undefined;
    const root = mount(() => {
      const [element, setElement] = createSignal<HTMLDivElement>();
      editor = createTiptapEditor(() => ({
        element: element(),
        extensions: [StarterKit],
      }));
      return (
        <div
          ref={(value) => {
            setElement(value);
          }}
        />
      );
    });

    await settle();

    expect(editor()).toBeDefined();
    expect(root.querySelector('[contenteditable]')).not.toBeNull();
  });

  it('waits until the element is set', async () => {
    const [element, setElement] = createSignal<HTMLDivElement>();
    let editor!: () => Editor | undefined;
    mount(() => {
      editor = createTiptapEditor(() => ({
        element: element(),
        extensions: [StarterKit],
      }));
      return null;
    });

    await settle();
    expect(editor()).toBeUndefined();

    setElement(document.createElement('div'));
    await settle();
    expect(editor()).toBeDefined();
  });

  it('recreates the editor when a tracked option changes', async () => {
    const [content, setContent] = createSignal('<p>First</p>');
    let editor!: () => Editor | undefined;
    mount(() => {
      let ref!: HTMLDivElement;
      editor = createTiptapEditor(() => ({
        element: ref,
        extensions: [StarterKit],
        content: content(),
      }));
      return <div ref={ref} />;
    });

    await settle();
    const first = editorOf(editor);

    setContent('<p>Second</p>');
    await settle();
    const second = editorOf(editor);

    expect(second).not.toBe(first);
    expect(first.isDestroyed).toBe(true);
    expect(second.getHTML()).toBe('<p>Second</p>');
  });

  it('destroys the editor on dispose', async () => {
    let editor!: () => Editor | undefined;
    mount(() => {
      let ref!: HTMLDivElement;
      editor = createTiptapEditor(() => ({
        element: ref,
        extensions: [StarterKit],
      }));
      return <div ref={ref} />;
    });

    await settle();
    const instance = editorOf(editor);

    for (const cleanup of cleanups.splice(0)) {
      cleanup();
    }
    flush();

    expect(instance.isDestroyed).toBe(true);
  });
});

describe('editor state', () => {
  // Mounts an editor and reads its state through the given helper.
  async function setup<T>(
    read: (editor: () => Editor | undefined) => () => T,
  ): Promise<{ editor: Editor; value: () => T }> {
    let editor!: () => Editor | undefined;
    let value!: () => T;
    mount(() => {
      let ref!: HTMLDivElement;
      editor = createTiptapEditor(() => ({
        element: ref,
        extensions: [StarterKit],
        content: '<p>Hello</p>',
      }));
      value = read(editor);
      return <div ref={ref} />;
    });
    await settle();
    return { editor: editorOf(editor), value };
  }

  it('reads again after every transaction', async () => {
    const { editor, value } = await setup((accessor) =>
      createEditorTransaction(accessor, (instance) => instance?.state.doc.textContent.length ?? 0),
    );

    expect(value()).toBe(5);
    editor.commands.insertContent(' world');
    await settle();
    expect(value()).toBe(11);
  });

  it('returns undefined before the editor exists', () => {
    const [editor] = createSignal<Editor>();
    expect(useEditorHTML(editor)()).toBeUndefined();
  });

  it('tracks the HTML', async () => {
    const { editor, value } = await setup(useEditorHTML);
    expect(value()).toBe('<p>Hello</p>');

    editor.commands.setContent('<p>Bye</p>');
    await settle();
    expect(value()).toBe('<p>Bye</p>');
  });

  it('tracks the JSON', async () => {
    const { editor, value } = await setup(useEditorJSON);
    editor.commands.clearContent();
    await settle();
    expect(value()).toEqual({ type: 'doc', content: [{ type: 'paragraph' }] });
  });

  it('tracks whether the editor is empty', async () => {
    const { editor, value } = await setup(useEditorIsEmpty);
    expect(value()).toBe(false);

    editor.commands.clearContent();
    await settle();
    expect(value()).toBe(true);
  });

  it('tracks whether the editor is editable', async () => {
    const { editor, value } = await setup(useEditorIsEditable);
    expect(value()).toBe(true);

    editor.setEditable(false);
    await settle();
    expect(value()).toBe(false);
  });

  it('checks a node or mark by name', async () => {
    const { editor, value } = await setup((accessor) => useEditorIsActive(accessor, () => 'bold'));
    expect(value()).toBe(false);

    editor.chain().selectAll().setBold().run();
    await settle();
    expect(value()).toBe(true);
  });

  it('checks a node by name and attributes', async () => {
    const { editor, value } = await setup((accessor) =>
      useEditorIsActive(accessor, () => 'heading', { level: 2 }),
    );
    expect(value()).toBe(false);

    editor.commands.setHeading({ level: 2 });
    await settle();
    expect(value()).toBe(true);
  });

  it('checks attributes alone', async () => {
    const { editor, value } = await setup((accessor) => useEditorIsActive(accessor, { level: 3 }));
    expect(value()).toBe(false);

    editor.commands.setHeading({ level: 3 });
    await settle();
    expect(value()).toBe(true);
  });

  it('stops listening to the editor when disposed', async () => {
    const editor = new Editor({ extensions: [StarterKit] });
    const off = vi.spyOn(editor, 'off');

    const dispose = createRoot((disposeRoot) => {
      createEditorTransaction(
        () => editor,
        (instance) => instance.isEmpty,
      );
      return disposeRoot;
    });
    await settle();

    dispose();
    flush();
    expect(off).toHaveBeenCalledWith('transaction', expect.any(Function));
    editor.destroy();
  });
});
