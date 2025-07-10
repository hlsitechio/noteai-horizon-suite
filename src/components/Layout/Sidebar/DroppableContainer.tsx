import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableContainerProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function DroppableContainer({ id, children, className = '' }: DroppableContainerProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} transition-all duration-200 ${
        isOver 
          ? 'bg-primary/10 border-2 border-dashed border-primary/60 rounded-md' 
          : 'border-2 border-transparent'
      }`}
    >
      {children}
    </div>
  );
}