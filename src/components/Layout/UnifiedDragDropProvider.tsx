
import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useUnifiedDragDrop } from '../../hooks/useUnifiedDragDrop';

interface UnifiedDragDropProviderProps {
  children: React.ReactNode;
}

export function UnifiedDragDropProvider({ children }: UnifiedDragDropProviderProps) {
  const { handleDragEnd } = useUnifiedDragDrop();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {children}
    </DragDropContext>
  );
}
