
import { useState, useEffect } from 'react';
import { OptimizedDOMUtils } from '@/utils/optimizedDOMUtils';

interface FloatingWindowSize {
  width: number;
  height: number;
}

interface UseFloatingWindowResizeProps {
  size: FloatingWindowSize;
  isMinimized: boolean;
  onSizeChange: (size: FloatingWindowSize) => void;
}

export const useFloatingWindowResize = ({
  size,
  isMinimized,
  onSizeChange,
}: UseFloatingWindowResizeProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleResizeStart = (e: React.MouseEvent) => {
    if (isMinimized) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  const handleResize = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x));
      const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y));
      const newSize = { width: newWidth, height: newHeight };
      onSizeChange(newSize);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleResize(e);
    };

    const handleMouseUp = () => {
      handleResizeEnd();
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart]);

  // Prevent text selection during resize
  useEffect(() => {
    OptimizedDOMUtils.manageUserSelect(isResizing);

    return () => {
      OptimizedDOMUtils.manageUserSelect(false);
    };
  }, [isResizing]);

  return {
    isResizing,
    handleResizeStart,
  };
};
