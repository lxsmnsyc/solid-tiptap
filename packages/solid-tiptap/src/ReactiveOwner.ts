import type { Editor } from '@tiptap/core';

export const ReactiveOwnerProperty = Symbol(
  'Reactive owner property used by tiptap solid as a workaround'
);

// Solid js doesn't expose Owner type so use any instead
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTiptapSolidReactiveOwner = (editor: Editor): any | undefined =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (editor as any)[ReactiveOwnerProperty] ?? undefined;
