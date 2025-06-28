
import React, { useState, useCallback } from 'react';
import { useDashboardData } from './useDashboardData';
import { DashboardBlock } from './useDashboardLayout';
import { useDashboardBlocks } from './useDashboardBlocks';

export const useDashboard = () => {
  const dashboardData = useDashboardData();
  const [currentNote, setCurrentNote] = useState(null);
  
  // Create the stats object that matches the expected interface
  const dashboardStats = {
    totalNotes: dashboardData.stats.totalNotes,
    favoriteNotes: dashboardData.stats.favoriteNotes,
    recentNotes: dashboardData.notes.slice(0, 5).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ),
    categoryCounts: dashboardData.notes.reduce((acc, note) => {
      const category = note.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    weeklyNotes: dashboardData.stats.weeklyNotes,
    totalWords: dashboardData.stats.totalWords,
    avgWordsPerNote: dashboardData.stats.avgWords
  };

  // Get the blocks configuration
  const { getOriginalBlocks } = useDashboardBlocks(
    dashboardStats,
    dashboardData.notes,
    setCurrentNote
  );

  // Initialize blocks with the actual components - getOriginalBlocks is a function, not an array
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
