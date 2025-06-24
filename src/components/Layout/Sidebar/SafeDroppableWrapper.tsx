
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
  const { isReady } = useDragDropReady();

  // Always render fallback first, then transition to droppable
  if (!isReady) {
    return <>{fallbackChildren}</>;
  }

  // Add error boundary protection
  try {
    return (
      <Droppable droppableId={droppableId}>
        {children}
      </Droppable>
    );
  } catch (error) {
    console.warn('Droppable context error, falling back to static content:', error);
    return <>{fallbackChildren}</>;
  }
}
