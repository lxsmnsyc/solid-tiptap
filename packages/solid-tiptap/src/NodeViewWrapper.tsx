import { Dynamic } from 'solid-js/web';

import { useSolidNodeView } from './useSolidNodeView';

import type { Component, ValidComponent } from 'solid-js';

export interface NodeViewWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
  as?: ValidComponent;
}

export const NodeViewWrapper: Component<NodeViewWrapperProps> = (props) => {
  const { onDragStart } = useSolidNodeView();

  return (
    <Dynamic
      component={props.as || 'div'}
      {...props}
      data-node-view-wrapper=''
      onDragStart={onDragStart}
      style={{
        ...props.style,
        'white-space': 'normal',
      }}
    />
  );
};
