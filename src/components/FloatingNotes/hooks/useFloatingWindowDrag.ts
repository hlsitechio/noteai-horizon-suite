
import { useState, useEffect } from 'react';

interface FloatingWindowPosition {
  x: number;
  y: number;
}

interface FloatingWindowSize {
  width: number;
  height: number;
}

interface UseFloatingWindowDragProps {
  position: FloatingWindowPosition;
  size: FloatingWindowSize;
  isMinimized: boolean;
  onPositionChange: (position: FloatingWindowPosition) => void;
}

export const useFloatingWindowDrag = ({
  position,
  size,
  isMinimized,
  onPositionChange,
}: UseFloatingWindowDragProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDrag = (e: MouseEvent) => {
    if (isDragging) {
      const currentHeight = isMinimized ? 50 : size.height;
      const currentWidth = isMinimized ? 300 : size.width;
      
      const newPosition = {
        x: Math.max(0, Math.min(window.innerWidth - currentWidth, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - currentHeight, e.clientY - dragOffset.y)),
      };
      onPositionChange(newPosition);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDrag(e);
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Prevent text selection during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return {
    isDragging,
    handleDragStart,
  };
};
