
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
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${gridClass} h-full min-h-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] relative ${
        isDragging ? 'z-50 scale-105 shadow-2xl rotate-1 opacity-90 ring-2 ring-blue-500 ring-opacity-50' : 'z-10'
      }`}
      data-block-id={id}
    >
      {/* Drag Handle */}
      <div className={`absolute top-2 right-2 z-20 transition-all duration-200 ${
        isDragging ? 'scale-110' : ''
      }`}>
        <div 
          {...attributes}
          {...listeners}
          role="button"
          aria-grabbed={isDragging}
          aria-label="Drag to reorder"
          className="drag-handle cursor-move p-2 rounded-lg hover:bg-background/80 transition-colors bg-white/90 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Keyboard drag support is handled by dnd-kit
            }
          }}
        >
          <GripVertical className={`w-4 h-4 transition-colors ${
            isDragging ? 'text-blue-600' : 'text-muted-foreground hover:text-foreground'
          }`} />
        </div>
      </div>
      
      {/* Content */}
      <div className={`h-full transition-all duration-300 ${
        isDragging ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
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
