
import { useState, useCallback } from 'react';
import { useDashboardData } from './useDashboardData';
import { DashboardBlock } from './useDashboardLayout';
import { useDashboardBlocks } from './useDashboardBlocks';

export const useDashboard = () => {
  const dashboardData = useDashboardData();
  const [currentNote, setCurrentNote] = useState(null);
  
  // Get the blocks configuration
  const { getOriginalBlocks } = useDashboardBlocks(
    dashboardData.stats,
    dashboardData.notes,
    setCurrentNote
  );

  // Initialize blocks with the actual components
  const [blocks, setBlocks] = useState<DashboardBlock[]>(() => getOriginalBlocks());
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  // Update blocks when dashboard data changes
  React.useEffect(() => {
    const newBlocks = getOriginalBlocks();
    setBlocks(newBlocks);
  }, [dashboardData.stats, dashboardData.notes, getOriginalBlocks]);

  const handleBlocksReorder = useCallback((reorderedBlocks: DashboardBlock[]) => {
    console.log('useDashboard: Reordering blocks to:', reorderedBlocks.map(b => b.id));
    setBlocks(reorderedBlocks);
  }, []);

  const handleDragStart = useCallback((blockId: string) => {
    setIsDragging(true);
    setDraggedBlockId(blockId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedBlockId(null);
  }, []);

  const handleResetLayout = useCallback(() => {
    const originalBlocks = getOriginalBlocks();
    setBlocks(originalBlocks);
  }, [getOriginalBlocks]);

  return {
    ...dashboardData,
    blocks,
    isDragging,
    draggedBlockId,
    handleBlocksReorder,
    handleDragStart,
    handleDragEnd,
    handleResetLayout,
  };
};
