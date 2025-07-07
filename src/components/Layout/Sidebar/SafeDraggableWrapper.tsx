
import React from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot, DraggableRubric } from 'react-beautiful-dnd';
import { useDragDropReady } from '../UnifiedDragDropProvider';

interface SafeDraggableWrapperProps {
  draggableId: string;
  index: number;
  children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => React.ReactElement<HTMLElement>;
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
