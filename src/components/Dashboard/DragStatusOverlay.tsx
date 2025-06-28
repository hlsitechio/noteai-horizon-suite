
import React from 'react';

interface DragStatusOverlayProps {
  isDragging: boolean;
  draggedBlockId: string | null;
}

const DragStatusOverlay: React.FC<DragStatusOverlayProps> = ({
  isDragging,
  draggedBlockId
}) => {
  if (!isDragging || !draggedBlockId) return null;

  return (
    <>
      {/* Enhanced drag status indicator with better positioning */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-xl font-semibold backdrop-blur-sm border border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Dragging: {draggedBlockId} - Drop on another block to swap
        </div>
      </div>

      {/* Drag Preview Overlay that follows cursor */}
      <div className="fixed pointer-events-none top-0 left-0 z-50 text-white text-sm px-4 py-2 bg-gray-900/90 rounded shadow-lg transition-all duration-150">
        Dragging {draggedBlockId}
      </div>
    </>
  );
};

export default DragStatusOverlay;
