
import React, { useRef, useState, useCallback } from 'react';
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
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });

  // Track mouse position during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setCurrentMousePos({ x: e.clientX, y: e.clientY });
    
    // Update drop target highlighting
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const targetBlock = element?.closest('[data-block-id]');
    
    // Remove all previous highlights
    document.querySelectorAll('[data-block-id]').forEach(block => {
      if (block !== nodeRef.current) {
        block.classList.remove('drop-target-active');
      }
    });
    
    // Add highlight to current target
    if (targetBlock && targetBlock.getAttribute('data-block-id') !== id) {
      targetBlock.classList.add('drop-target-active');
    }
  }, [id]);

  const handleStart = () => {
    console.log(`Starting drag for block: ${id}`);
    setIsDragging(true);
    onDragStart?.(id);
    
    // Add global drag class and mouse tracking
    if (typeof document !== 'undefined') {
      document.body.classList.add('dragging-active');
      document.addEventListener('mousemove', handleMouseMove);
    }
  };

  const handleDrag = (_e: any, data: any) => {
    setDragPosition({ x: data.x, y: data.y });
  };

  const handleStop = (_e: any, data: any) => {
    console.log(`Stopping drag for block: ${id} at position:`, currentMousePos);
    setIsDragging(false);
    setDragPosition({ x: 0, y: 0 });
    setIsDropTarget(false);
    onDragEnd?.();

    // Clean up event listeners and classes
    if (typeof document !== 'undefined') {
      document.body.classList.remove('dragging-active');
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Remove all drop target highlights
      document.querySelectorAll('[data-block-id]').forEach(block => {
        block.classList.remove('drop-target-active');
      });

      // Find the target element using the tracked mouse position
      const targetElement = document.elementFromPoint(currentMousePos.x, currentMousePos.y);
      const targetBlock = targetElement?.closest('[data-block-id]');
      
      if (targetBlock && targetBlock !== nodeRef.current) {
        const targetId = targetBlock.getAttribute('data-block-id');
        if (targetId && targetId !== id) {
          console.log(`Swapping ${id} with ${targetId}`);
          onSwap(id, targetId);
        }
      } else {
        console.log('No valid drop target found');
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
      
      {/* Enhanced drop zone overlay */}
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
