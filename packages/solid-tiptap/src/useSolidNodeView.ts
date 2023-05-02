import { createContext, useContext } from 'solid-js';

export interface SolidNodeViewContextProps {
  onDragStart: (event: DragEvent) => void;
  nodeViewContentRef: (element: HTMLElement | null) => void;
}

export const SolidNodeViewContext = createContext<
  Partial<SolidNodeViewContextProps>
>({
  onDragStart: undefined,
});

export const useSolidNodeView = () => useContext(SolidNodeViewContext);
