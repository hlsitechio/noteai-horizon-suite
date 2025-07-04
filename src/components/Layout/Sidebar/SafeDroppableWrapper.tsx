
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useDragDropReady } from '../UnifiedDragDropProvider';

interface SafeDroppableWrapperProps {
  droppableId: string;
  children: (provided: any, snapshot: any) => React.ReactElement;
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
