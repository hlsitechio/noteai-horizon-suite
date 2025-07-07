
import React from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { useDragDropReady } from '../UnifiedDragDropProvider';

interface SafeDroppableWrapperProps {
  droppableId: string;
  children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactElement<HTMLElement>;
  fallbackChildren: React.ReactNode;
}

export function SafeDroppableWrapper({ 
  droppableId, 
  children, 
  fallbackChildren 
}: SafeDroppableWrapperProps) {
  const { isReady, contextRef } = useDragDropReady();

  // Only render droppable if context is confirmed ready
  if (!isReady || !contextRef.current) {
    return <>{fallbackChildren}</>;
  }

  return (
    <Droppable droppableId={droppableId}>
      {children}
    </Droppable>
  );
}
