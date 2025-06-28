
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${gridClass} h-full min-h-0 transition-all duration-200 ease-out relative group ${
        isDragging ? 'z-50 scale-105 shadow-2xl rotate-1 opacity-90 ring-2 ring-blue-500 ring-opacity-50' : 'z-10'
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
        aria-label="Drag to reorder"
        tabIndex={0}
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

      {/* Drop Zone Indicator */}
      {isDragging && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-br from-blue-100/30 to-blue-200/20 border-2 border-dashed border-blue-400 rounded-xl pointer-events-none backdrop-blur-sm">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md animate-bounce">
            Drop here to swap
          </div>
        </div>
      )}
    </div>
  );
};

export default SortableItem;
