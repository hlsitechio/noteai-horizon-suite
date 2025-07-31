
import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, RotateCw, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResizableImageProps {
  src: string;
  initialWidth?: number;
  initialHeight?: number;
  onRemove?: () => void;
  onSizeChange?: (width: number, height: number) => void;
}

const ResizableImage: React.FC<ResizableImageProps> = ({
  src,
  initialWidth = 300,
  initialHeight = 200,
  onRemove,
  onSizeChange
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ width: 0, height: 0, mouseX: 0, mouseY: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (imageRef.current && !imageRef.current.contains(event.target as Node)) {
        setIsSelected(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();

    if (action === 'drag') {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    } else if (action === 'resize') {
      setIsResizing(true);
      resizeStartRef.current = {
        width: dimensions.width,
        height: dimensions.height,
        mouseX: e.clientX,
        mouseY: e.clientY
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.mouseX;
        const newWidth = Math.max(50, resizeStartRef.current.width + deltaX);
        const aspectRatio = resizeStartRef.current.height / resizeStartRef.current.width;
        const newHeight = newWidth * aspectRatio;
        
        setDimensions({ width: newWidth, height: newHeight });
        onSizeChange?.(newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, onSizeChange]);

  const handleRotate = (direction: 'left' | 'right') => {
    const newRotation = direction === 'left' ? rotation - 90 : rotation + 90;
    setRotation(newRotation % 360);
  };

  return (
    <div
      ref={imageRef}
      className={`relative inline-block select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onClick={() => setIsSelected(true)}
    >
      <img
        src={src}
        alt="Uploaded content"
        width={dimensions.width}
        height={dimensions.height}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isResizing ? 'none' : 'transform 0.2s ease',
          display: 'block'
        }}
        className="rounded-lg shadow-md"
        draggable={false}
      />

      {isSelected && (
        <>
          {/* Control Toolbar */}
          <div className="absolute -top-12 left-0 flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border p-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onMouseDown={(e) => handleMouseDown(e, 'drag')}
              title="Drag"
            >
              <Move className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleRotate('left')}
              title="Rotate Left"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleRotate('right')}
              title="Rotate Right"
            >
              <RotateCw className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={onRemove}
              title="Remove"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Resize Handle */}
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize hover:bg-blue-600 shadow-md"
            onMouseDown={(e) => handleMouseDown(e, 'resize')}
            title="Resize"
          />

          {/* Corner indicators */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-500 rounded-tl" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-500 rounded-tr" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-500 rounded-bl" />
        </>
      )}
    </div>
  );
};

export default ResizableImage;
