
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
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const handleStart = () => {
    setIsDragging(true);
    onDragStart?.(id);
  };

  const handleDrag = (_e: any, data: any) => {
    setDragPosition({ x: data.x, y: data.y });
  };

  const handleStop = (_e: any, data: any) => {
    setIsDragging(false);
    setDragPosition({ x: 0, y: 0 });
    onDragEnd?.();

    // Check if we're over another draggable block
    const element = document.elementFromPoint(data.lastX + data.x, data.lastY + data.y);
    const targetBlock = element?.closest('[data-block-id]');
    
    if (targetBlock && targetBlock.getAttribute('data-block-id') !== id) {
      const targetId = targetBlock.getAttribute('data-block-id');
      if (targetId) {
        onSwap(id, targetId);
      }
    }
  };

  return (
    <div 
      className={`${gridClass} h-full min-h-0`} 
      data-block-id={id}
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
            isDragging ? 'z-50 scale-105 shadow-2xl' : 'z-10'
          }`}
        >
          <div className="absolute top-2 right-2 z-20">
            <div className="drag-handle cursor-move p-1 rounded hover:bg-background/80 transition-colors">
              <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </div>
          </div>
          {children}
        </div>
      </Draggable>
    </div>
  );
};

export default DraggableBlock;
