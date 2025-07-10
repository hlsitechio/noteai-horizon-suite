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
      className={`${className} ${isOver ? 'bg-accent/20 border-2 border-dashed border-accent' : ''} transition-all duration-200`}
    >
      {children}
    </div>
  );
}