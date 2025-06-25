
import React from 'react';

interface FloatingWindowResizeHandleProps {
  isMinimized: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
}

const FloatingWindowResizeHandle: React.FC<FloatingWindowResizeHandleProps> = ({
  isMinimized,
  onResizeStart,
}) => {
  if (isMinimized) return null;

  return (
    <div
      className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize opacity-50 hover:opacity-100"
      onMouseDown={onResizeStart}
    >
      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 absolute bottom-1 right-1 rounded-sm"></div>
      <div className="w-1 h-1 bg-gray-400 dark:bg-gray-600 absolute bottom-0.5 right-0.5 rounded-sm"></div>
    </div>
  );
};

export default FloatingWindowResizeHandle;
