
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

  console.log(`SortableItem ${id}: Rendering - isDragging:`, isDragging, 'transform:', transform);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 150ms ease',
    zIndex: isDragging ? 1000 : 1,
  };

  // Debug event handlers
  const handleDragHandleClick = (e: React.MouseEvent) => {
    console.log(`🔥 SortableItem ${id}: Drag handle CLICKED - starting drag!`);
    e.stopPropagation();
  };

  const handleDragHandleMouseDown = (e: React.MouseEvent) => {
    console.log(`🔥 SortableItem ${id}: Drag handle MOUSE DOWN - drag initiating!`);
  };

  const handleDragHandlePointerDown = (e: React.PointerEvent) => {
    console.log(`🔥 SortableItem ${id}: Drag handle POINTER DOWN event - starting drag sequence!`);
  };

  const handleDragHandleTouchStart = (e: React.TouchEvent) => {
    console.log(`🔥 SortableItem ${id}: Drag handle TOUCH START event!`);
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
      {/* Improved drag handle with better event handling */}
      <div 
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-[60] p-2 rounded-md bg-white/95 shadow-md border border-gray-200 cursor-grab active:cursor-grabbing hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-none select-none"
        role="button"
        aria-grabbed={isDragging}
        aria-label={`Drag to reorder ${id}`}
        tabIndex={0}
        onClick={handleDragHandleClick}
        onMouseDown={handleDragHandleMouseDown}
        onPointerDown={handleDragHandlePointerDown}
        onTouchStart={handleDragHandleTouchStart}
        style={{ 
          opacity: 1,
          pointerEvents: 'auto',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        <GripVertical className="w-4 h-4 text-gray-600 pointer-events-none" />
      </div>
      
      {/* Content with drag interaction disabled */}
      <div 
        className={`h-full transition-all duration-200 ${
          isDragging ? 'ring-2 ring-blue-500 ring-opacity-30 rounded-lg' : ''
        }`}
        style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
      >
        {children}
      </div>
    </div>
  );
};

export default SortableItem;
