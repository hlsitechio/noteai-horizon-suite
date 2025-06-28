
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
    
    // Add global drag class to body for styling
    document.body.classList.add('dragging-active');
  };

  const handleDrag = (_e: any, data: any) => {
    setDragPosition({ x: data.x, y: data.y });
    
    // Check for drop targets during drag
    const element = document.elementFromPoint(data.lastX + data.x, data.lastY + data.y);
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
  };

  const handleStop = (_e: any, data: any) => {
    setIsDragging(false);
    setDragPosition({ x: 0, y: 0 });
    setIsDropTarget(false);
    onDragEnd?.();

    // Remove global drag class
    document.body.classList.remove('dragging-active');
    
    // Remove all drop target highlights
    document.querySelectorAll('[data-block-id]').forEach(block => {
      block.classList.remove('drop-target-active');
    });

    // Check if we're over another draggable block for swapping
    const currentMouseX = data.lastX + data.x;
    const currentMouseY = data.lastY + data.y;
    const element = document.elementFromPoint(currentMouseX, currentMouseY);
    const targetBlock = element?.closest('[data-block-id]');
    
    if (targetBlock && targetBlock.getAttribute('data-block-id') !== id) {
      const targetId = targetBlock.getAttribute('data-block-id');
      if (targetId) {
        console.log(`Swapping ${id} with ${targetId}`);
        onSwap(id, targetId);
      }
    }
  };

  const handleMouseEnter = () => {
    if (document.body.classList.contains('dragging-active')) {
      setIsDropTarget(true);
    }
  };

  const handleMouseLeave = () => {
    if (document.body.classList.contains('dragging-active')) {
      setIsDropTarget(false);
    }
  };

  return (
    <div 
      className={`${gridClass} h-full min-h-0 transition-all duration-200 ${
        isDropTarget && !isDragging ? 'ring-2 ring-blue-400 ring-opacity-60 bg-blue-50/30' : ''
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
      >
        <div 
          ref={nodeRef}
          className={`relative h-full transition-all duration-200 ${
            isDragging ? 'z-50 scale-105 shadow-2xl rotate-1 opacity-90' : 'z-10'
          }`}
        >
          <div className={`absolute top-2 right-2 z-20 transition-all duration-200 ${
            isDragging ? 'scale-110' : ''
          }`}>
            <div className="drag-handle cursor-move p-2 rounded-lg hover:bg-background/80 transition-colors bg-white/90 shadow-sm border border-gray-200">
              <GripVertical className={`w-4 h-4 transition-colors ${
                isDragging ? 'text-blue-600' : 'text-muted-foreground hover:text-foreground'
              }`} />
            </div>
          </div>
          
          <div className={`h-full transition-all duration-200 ${
            isDragging ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}>
            {children}
          </div>
        </div>
      </Draggable>
      
      {/* Drop zone overlay when dragging */}
      {!isDragging && document.body.classList.contains('dragging-active') && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-blue-100/20 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Drop here to swap
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableBlock;
