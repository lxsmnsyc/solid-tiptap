import { Dynamic } from 'solid-js/web';

import { useSolidNodeView } from './useSolidNodeView';

import type { Component, ValidComponent } from 'solid-js';

export interface NodeViewContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  as?: ValidComponent;
}

export const NodeViewContent: Component<NodeViewContentProps> = (props) => {
  const state = useSolidNodeView();

  return (
    <Dynamic
      component={props.as || 'div'}
      {...props}
      ref={state.nodeViewContentRef}
      data-node-view-content=''
      style={{
        ...props.style,
        'white-space': 'pre-wrap',
      }}
    />
  );
};
