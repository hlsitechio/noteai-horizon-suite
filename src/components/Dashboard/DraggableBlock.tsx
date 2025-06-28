
import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface DraggableBlockProps {
  id: string;
  children: React.ReactNode;
  gridClass: string;
  onSwap: (draggedId: string, targetId: string) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  id,
  children,
  gridClass,
  onSwap,
  onDragStart,
  onDragEnd
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const handleStart = () => {
    setIsDragging(true);
    onDragStart?.(id);
    
    // Add global drag class to body for styling with SSR guard
    if (typeof document !== 'undefined') {
      document.body.classList.add('dragging-active');
    }
  };

  const handleDrag = (_e: any, data: any) => {
    setDragPosition({ x: data.x, y: data.y });
    
    // Use requestAnimationFrame for better accuracy and reduced flicker
    requestAnimationFrame(() => {
      if (typeof document === 'undefined') return;
      
      const currentMouseX = data.lastX + data.x;
      const currentMouseY = data.lastY + data.y;
      const element = document.elementFromPoint(currentMouseX, currentMouseY);
      const targetBlock = element?.closest('[data-block-id]');
      
      // Remove previous drop target highlights
      document.querySelectorAll('[data-block-id]').forEach(block => {
        if (block !== nodeRef.current) {
          block.classList.remove('drop-target-active');
        }
      });
      
      // Highlight current drop target
      if (targetBlock && targetBlock.getAttribute('data-block-id') !== id) {
        targetBlock.classList.add('drop-target-active');
        setIsDropTarget(true);
      } else {
        setIsDropTarget(false);
      }
    });
  };

  const handleStop = (_e: any, data: any) => {
    setIsDragging(false);
    setDragPosition({ x: 0, y: 0 });
    setIsDropTarget(false);
    onDragEnd?.();

    // Remove global drag class with SSR guard
    if (typeof document !== 'undefined') {
      document.body.classList.remove('dragging-active');
      
      // Remove all drop target highlights
      document.querySelectorAll('[data-block-id]').forEach(block => {
        block.classList.remove('drop-target-active');
      });

      // Improved hit testing using bounding box logic
      const currentMouseX = data.lastX + data.x;
      const currentMouseY = data.lastY + data.y;
      const elements = document.querySelectorAll('[data-block-id]');

      for (const el of elements) {
        if (el === nodeRef.current) continue;

        const rect = el.getBoundingClientRect();
        if (
          currentMouseX >= rect.left &&
          currentMouseX <= rect.right &&
          currentMouseY >= rect.top &&
          currentMouseY <= rect.bottom
        ) {
          const targetId = el.getAttribute('data-block-id');
          if (targetId) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`Swapping ${id} with ${targetId}`);
            }
            onSwap(id, targetId);
            break;
          }
        }
      }
    }
  };

  const handleMouseEnter = () => {
    if (typeof document !== 'undefined' && document.body.classList.contains('dragging-active')) {
      setIsDropTarget(true);
    }
  };

  const handleMouseLeave = () => {
    if (typeof document !== 'undefined' && document.body.classList.contains('dragging-active')) {
      setIsDropTarget(false);
    }
  };

  return (
    <div 
      className={`${gridClass} h-full min-h-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isDropTarget && !isDragging ? 'ring-2 ring-blue-400/60 bg-blue-50/30 backdrop-blur-sm' : ''
      }`}
      data-block-id={id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Draggable
        nodeRef={nodeRef}
        position={dragPosition}
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
        handle=".drag-handle"
        bounds="parent"
        grid={[10, 10]}
      >
        <div 
          ref={nodeRef}
          className={`relative h-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isDragging ? 'z-50 scale-105 shadow-2xl rotate-1 opacity-90' : 'z-10'
          }`}
        >
          <div className={`absolute top-2 right-2 z-20 transition-all duration-200 ${
            isDragging ? 'scale-110' : ''
          }`}>
            <div 
              role="button"
              aria-grabbed={isDragging}
              aria-label="Drag to reorder"
              className="drag-handle cursor-move p-2 rounded-lg hover:bg-background/80 transition-colors bg-white/90 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  // Could implement keyboard drag here in the future
                }
              }}
            >
              <GripVertical className={`w-4 h-4 transition-colors ${
                isDragging ? 'text-blue-600' : 'text-muted-foreground hover:text-foreground'
              }`} />
            </div>
          </div>
          
          <div className={`h-full transition-all duration-300 ${
            isDragging ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}>
            {children}
          </div>
        </div>
      </Draggable>
      
      {/* Enhanced drop zone overlay with SSR guard and modern 2025 UX */}
      {!isDragging && typeof document !== 'undefined' && document.body.classList.contains('dragging-active') && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-br from-blue-100/30 to-blue-200/20 border-2 border-dashed border-blue-400 rounded-xl pointer-events-none backdrop-blur-sm">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md animate-bounce">
            Drop here to swap
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableBlock;
