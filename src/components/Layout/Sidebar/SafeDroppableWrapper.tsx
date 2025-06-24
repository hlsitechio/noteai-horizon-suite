
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

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
  try {
    return (
      <Droppable droppableId={droppableId}>
        {children}
      </Droppable>
    );
  } catch (error) {
    console.log('Droppable context not ready, rendering fallback:', error);
    return <>{fallbackChildren}</>;
  }
}
