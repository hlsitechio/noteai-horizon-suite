
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
  const { isReady } = useDragDropReady();

  // Always render fallback first, then transition to draggable
  if (!isReady) {
    return <>{fallbackChildren}</>;
  }

  // Add error boundary protection
  try {
    return (
      <Draggable draggableId={draggableId} index={index}>
        {children}
      </Draggable>
    );
  } catch (error) {
    console.warn('Draggable context error, falling back to static content:', error);
    return <>{fallbackChildren}</>;
  }
}
