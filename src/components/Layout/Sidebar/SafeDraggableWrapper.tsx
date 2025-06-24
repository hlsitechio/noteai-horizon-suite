
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useDragDropReady } from '../UnifiedDragDropProvider';

interface SafeDraggableWrapperProps {
  draggableId: string;
  index: number;
  children: (provided: any, snapshot: any, rubric: any) => React.ReactElement;
  fallbackChildren: React.ReactNode;
}

export function SafeDraggableWrapper({ 
  draggableId, 
  index, 
  children, 
  fallbackChildren 
}: SafeDraggableWrapperProps) {
  const { isReady, contextRef } = useDragDropReady();

  // Only render draggable if context is confirmed ready
  if (!isReady || !contextRef.current) {
    return <>{fallbackChildren}</>;
  }

  return (
    <Draggable draggableId={draggableId} index={index}>
      {children}
    </Draggable>
  );
}
