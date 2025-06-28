
import { useState, useEffect } from 'react';
import { DashboardBlock } from './useDashboardLayout';

export const useDashboardDrag = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setIsDragging(true);
    setDraggedBlockId(id);
    console.log(`[DragAI] User dragging block: ${id}`);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedBlockId(null);
    console.log('[DragAI] Drag ended');
  };

  const handleBlocksReorder = (reorderedBlocks: DashboardBlock[]) => {
    console.log('Dashboard: Reordering blocks to new order:', reorderedBlocks.map(b => b.id));
  };

  // Enhanced drag telemetry for AI insights
  useEffect(() => {
    if (isDragging && draggedBlockId) {
      console.log(`[DragAI] Active drag session: ${draggedBlockId}`);
    }
  }, [isDragging, draggedBlockId]);

  return {
    isDragging,
    draggedBlockId,
    handleDragStart,
    handleDragEnd,
    handleBlocksReorder
  };
};
