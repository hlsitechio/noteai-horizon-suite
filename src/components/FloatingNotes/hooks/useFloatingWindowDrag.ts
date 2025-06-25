
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
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Drag start initiated', { clientX: e.clientX, clientY: e.clientY, position });
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDrag = (e: MouseEvent) => {
    if (isDragging) {
      console.log('Dragging', { clientX: e.clientX, clientY: e.clientY, dragOffset });
      
      const currentHeight = isMinimized ? 50 : size.height;
      const currentWidth = isMinimized ? 300 : size.width;
      
      // Get viewport dimensions - handle both web and desktop environments
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1920;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1080;
      
      const newPosition = {
        x: Math.max(0, Math.min(viewportWidth - currentWidth, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(viewportHeight - currentHeight, e.clientY - dragOffset.y)),
      };
      
      console.log('New position calculated', newPosition);
      onPositionChange(newPosition);
    }
  };

  const handleDragEnd = (e?: MouseEvent) => {
    console.log('Drag end');
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleDrag(e);
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      handleDragEnd(e);
    };

    // Add event listeners to both document and window for better compatibility
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      window.addEventListener('mousemove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp, { passive: false });
      
      // Additional listeners for desktop environment
      document.addEventListener('dragover', (e) => e.preventDefault());
      document.addEventListener('drop', (e) => e.preventDefault());
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('dragover', (e) => e.preventDefault());
      document.removeEventListener('drop', (e) => e.preventDefault());
    };
  }, [isDragging, dragOffset]);

  // Prevent text selection and other interactions during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.cursor = 'move';
      
      // Prevent default drag behavior in desktop environments
      document.addEventListener('dragstart', (e) => e.preventDefault());
      document.addEventListener('selectstart', (e) => e.preventDefault());
    } else {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.cursor = '';
      
      document.removeEventListener('dragstart', (e) => e.preventDefault());
      document.removeEventListener('selectstart', (e) => e.preventDefault());
    }

    return () => {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  return {
    isDragging,
    handleDragStart,
  };
};
