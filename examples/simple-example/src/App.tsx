import {
  createTiptapEditor,
  createEditorTransaction,
} from 'solid-tiptap';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import {
  createEffect,
  createSignal,
  For,
  JSX,
  Show,
} from 'solid-js';
import {
  TailwindToggle,
  TailwindToolbar,
} from 'solid-headless';

function CodeIcon(props: JSX.IntrinsicElements['svg']): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      stroke="none"
      {...props}
    >
      <path
        d="m7.375 16.781 1.25-1.562L4.601 12l4.024-3.219-1.25-1.562-5 4a1 1 0 0 0 0 1.562l5 4zm9.25-9.562-1.25 1.562L19.399 12l-4.024 3.219 1.25 1.562 5-4a1 1 0 0 0 0-1.562l-5-4zm-1.649-4.003-4 18-1.953-.434 4-18z"
      />
    </svg>
  );
}

function OrderedListIcon(props: JSX.IntrinsicElements['svg']): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M2.003 2.5a.5.5 0 00-.723-.447l-1.003.5a.5.5 0 00.446.895l.28-.14V6H.5a.5.5 0 000 1h2.006a.5.5 0 100-1h-.503V2.5zM5 3.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 3.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 8.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zM.924 10.32l.003-.004a.851.851 0 01.144-.153A.66.66 0 011.5 10c.195 0 .306.068.374.146a.57.57 0 01.128.376c0 .453-.269.682-.8 1.078l-.035.025C.692 11.98 0 12.495 0 13.5a.5.5 0 00.5.5h2.003a.5.5 0 000-1H1.146c.132-.197.351-.372.654-.597l.047-.035c.47-.35 1.156-.858 1.156-1.845 0-.365-.118-.744-.377-1.038-.268-.303-.658-.484-1.126-.484-.48 0-.84.202-1.068.392a1.858 1.858 0 00-.348.384l-.007.011-.002.004-.001.002-.001.001a.5.5 0 00.851.525zM.5 10.055l-.427-.26.427.26z"
      />
    </svg>
  );
}

function BulletListIcon(props: JSX.IntrinsicElements['svg']): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      <path
        fill-rule="evenodd"
        d="M2 4a1 1 0 100-2 1 1 0 000 2zm3.75-1.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM3 8a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z"
      />
    </svg>
  );
}

function BlockquoteIcon(props: JSX.IntrinsicElements['svg']): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      <path
        d="M20.309 17.708C22.196 15.66 22.006 13.03 22 13V5a1 1 0 0 0-1-1h-6c-1.103 0-2 .897-2 2v7a1 1 0 0 0 1 1h3.078a2.89 2.89 0 0 1-.429 1.396c-.508.801-1.465 1.348-2.846 1.624l-.803.16V20h1c2.783 0 4.906-.771 6.309-2.292zm-11.007 0C11.19 15.66 10.999 13.03 10.993 13V5a1 1 0 0 0-1-1h-6c-1.103 0-2 .897-2 2v7a1 1 0 0 0 1 1h3.078a2.89 2.89 0 0 1-.429 1.396c-.508.801-1.465 1.348-2.846 1.624l-.803.16V20h1c2.783 0 4.906-.771 6.309-2.292z"
      />
    </svg>
  );
}
function SelectorIcon(props: JSX.IntrinsicElements['svg']): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
      />
    </svg>
  );
}

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

const CONTENT = `
<h2>
Hi there,
</h2>
<p>
this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
<li>
  That’s a bullet list with one …
</li>
<li>
  … or two list items.
</li>
</ul>
<p>
Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
Wow, that’s amazing. Good work, boy! 👏
<br />
— Mom
</blockquote>    
`;

function Separator() {
  return (
    <div className="flex items-center" aria-hidden="true">
      <div className="h-full border-l border-gray-300" />
    </div>
  );
}

interface ControlProps {
  class: string;
  editor: Editor;
  key: string;
  onChange: () => void;
  isActive?: (editor: Editor) => boolean;
  children: JSX.Element;
}

function Control(props: ControlProps): JSX.Element {
  const flag = createEditorTransaction(
    () => props.editor,
    (instance) => {
      if (instance) {
        if (props.isActive) {
          return props.isActive(instance);
        }
        return instance.isActive(props.key);
      }
      return false;
    },
  );

  return (
    <TailwindToggle
      class={`${props.class} w-6 h-6 flex items-center justify-center rounded focus:outline-none focus-visible:ring focus-visible:ring-purple-400 focus-visible:ring-opacity-75`}
      classList={{
        'text-color-600 bg-white bg-opacity-25': flag(),
      }}
      onChange={props.onChange}
    >
      {props.children}
    </TailwindToggle>
  );
}

interface ToolbarProps {
  editor: Editor;
}

interface DropDownOption {
  label: string;
  action: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}

const DROPDOWN_OPTIONS: DropDownOption[] = [
  {
    label: 'Paragraph',
    action: (editor) => {
      editor.chain().focus().setParagraph().run();
    },
    isActive: (editor) => editor.isActive('paragraph'),
  },
  {
    label: 'Heading 1',
    action: (editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    label: 'Heading 2',
    action: (editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    label: 'Bulleted List',
    action: (editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    label: 'Ordered List',
    action: (editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
    isActive: (editor) => editor.isActive('orderedList'),
  },
  {
    label: 'Block Quote',
    action: (editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
    isActive: (editor) => editor.isActive('blockquote'),
  },
];

function ToolbarContents(props: ToolbarProps): JSX.Element {
  return (
    <>
      <div className="flex space-x-1">
        <Control
          key="paragraph"
          class="font-bold"
          editor={props.editor}
          onChange={() => props.editor.chain().focus().setParagraph().run()}
        >
          P
        </Control>
        <Control
          key="heading-1"
          class="font-bold"
          editor={props.editor}
          onChange={() => props.editor.chain().focus().setHeading({ level: 1 }).run()}
          isActive={(editor) => editor.isActive('heading', { level: 1 })}
        >
          H1
        </Control>
        <Control
          key="heading-2"
          class="font-bold"
          editor={props.editor}
          onChange={() => props.editor.chain().focus().setHeading({ level: 2 }).run()}
          isActive={(editor) => editor.isActive('heading', { level: 2 })}
        >
          H2
        </Control>
      </div>
      <Separator />
      <div className="flex space-x-1">
        <Control
          key="bold"
          class="font-bold"
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleBold().run()}
        >
          B
        </Control>
        <Control
          key="italic"
          class="italic"
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleItalic().run()}
        >
          I
        </Control>
        <Control
          key="strike"
          class="line-through"
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleStrike().run()}
        >
          S
        </Control>
      </div>
      <Separator />
      <div class="flex space-x-1">
        <Control
          key="bulletList"
          class=""
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleBulletList().run()}
        >
          <BulletListIcon class="w-full h-full m-1" />
        </Control>
        <Control
          key="orderedList"
          class=""
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleOrderedList().run()}
        >
          <OrderedListIcon class="w-full h-full m-1" />
        </Control>
        <Control
          key="blockquote"
          class=""
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleBlockquote().run()}
        >
          <BlockquoteIcon class="w-full h-full m-1" />
        </Control>
        <Control
          key="codeBlock"
          class=""
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleCodeBlock().run()}
        >
          <CodeIcon class="w-full h-full m-1" />
        </Control>
      </div>
    </>
  );
}

export default function App(): JSX.Element {
  let menuRef!: HTMLDivElement;
  let containerRef!: HTMLDivElement;

  const editor = createTiptapEditor({
    element: () => containerRef,
    get extensions() {
      return [
        StarterKit,
        BubbleMenu.configure({
          element: menuRef,
        }),
      ];
    },
    editorProps: {
      attributes: {
        class: 'p-8 focus:outline-none prose max-w-full',
      },
    },
    content: CONTENT,
  });

  return (
    <div className="w-screen h-screen bg-gradient-to-bl from-sky-400 to-blue-500 flex items-center justify-center">
      <div className="flex-1 m-16">
        <TailwindToolbar ref={menuRef} class="dynamic-shadow flex space-x-1 p-2 bg-gradient-to-bl from-blue-500 to-indigo-600 text-white rounded-lg" horizontal>
          <Show when={editor()}>
            {(instance) => <ToolbarContents editor={instance} />}
          </Show>
        </TailwindToolbar>
        <div className="h-[80vh] bg-white overflow-y-scroll rounded-lg" ref={containerRef} />
      </div>
    </div>
  );
}
