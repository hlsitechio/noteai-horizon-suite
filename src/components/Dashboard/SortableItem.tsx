
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
  id: string;
  gridClass: string;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, gridClass, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  console.log(`SortableItem ${id}: isDragging:`, isDragging, 'transform:', transform);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 150ms ease',
    zIndex: isDragging ? 1000 : 1,
  };

  const handleDragHandleClick = (e: React.MouseEvent) => {
    console.log(`SortableItem ${id}: Drag handle clicked`);
    e.stopPropagation();
  };

  const handleDragHandleMouseDown = (e: React.MouseEvent) => {
    console.log(`SortableItem ${id}: Drag handle mouse down`);
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${gridClass} h-full min-h-0 transition-all duration-200 ease-out relative group ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      data-block-id={id}
    >
      {/* Drag Handle - Always visible on hover */}
      <div 
        {...attributes}
        {...listeners}
        className={`absolute top-2 right-2 z-20 transition-all duration-200 cursor-grab active:cursor-grabbing ${
          isDragging ? 'scale-110 opacity-100' : 'opacity-0 group-hover:opacity-100'
        } p-2 rounded-lg hover:bg-background/80 bg-white/90 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        role="button"
        aria-grabbed={isDragging}
        aria-label={`Drag to reorder ${id}`}
        tabIndex={0}
        onClick={handleDragHandleClick}
        onMouseDown={handleDragHandleMouseDown}
      >
        <GripVertical className={`w-3 h-3 transition-colors duration-200 ${
          isDragging ? 'text-blue-600' : 'text-muted-foreground hover:text-foreground'
        }`} />
      </div>
      
      {/* Content */}
      <div className={`h-full transition-all duration-200 ${
        isDragging ? 'ring-2 ring-blue-500 ring-opacity-30 rounded-lg' : ''
      }`}>
        {children}
      </div>
    </div>
  );
};

export default SortableItem;
