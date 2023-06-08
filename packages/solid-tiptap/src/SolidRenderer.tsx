import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Dynamic, insert } from 'solid-js/web';

import { getTiptapSolidReactiveOwner } from './ReactiveOwner';

import type { Editor } from '@tiptap/core';
import type { Component } from 'solid-js';

export interface SolidRendererOptions {
  editor: Editor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
  as?: string;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SolidRenderer<P extends Record<string, any>> {
  id: string;
  editor: Editor;
  element: Element;
  dispose!: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setProps: any;

  constructor(
    component: Component<P>,
    { editor, props, as = 'div', className = '' }: SolidRendererOptions
  ) {
    this.id = Math.floor(Math.random() * 0xffffffff).toString();
    this.editor = editor;
    this.element = document.createElement(as);
    this.element.classList.add('solid-renderer');
    createRoot((dispose) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [reactiveProps, setProps] = createStore<Record<string, any>>(
        props ?? {}
      );
      this.setProps = setProps;
      if (className) {
        this.element.classList.add(...className.split(' '));
      }
      insert(
        this.element,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Dynamic component={component} {...(reactiveProps as any)} />
      );
      // eslint-disable-next-line solid/reactivity
      this.dispose = dispose;
    }, getTiptapSolidReactiveOwner(this.editor));
  }

  updateProps(props: P): void {
    this.setProps({
      ...props,
    });
  }

  destroy() {
    this.dispose();
    this.element.remove();
  }
}
