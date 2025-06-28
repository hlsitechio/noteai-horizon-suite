
import { useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import { useDashboardLayout } from './useDashboardLayout';
import { useDashboardStats } from './useDashboardStats';
import { useDashboardBlocks } from './useDashboardBlocks';
import { useDashboardDrag } from './useDashboardDrag';

export const useDashboard = () => {
  const { notes, setCurrentNote } = useNotes();
  const { blocks, initializeBlocks, reorderBlocks } = useDashboardLayout();
  
  // Use the separated hooks
  const dashboardStats = useDashboardStats(notes);
  const { getOriginalBlocks } = useDashboardBlocks(dashboardStats, notes, setCurrentNote);
  const {
    isDragging,
    draggedBlockId,
    handleDragStart,
    handleDragEnd,
    handleBlocksReorder: handleDragReorder
  } = useDashboardDrag();

  const handleBlocksReorder = (reorderedBlocks: any[]) => {
    handleDragReorder(reorderedBlocks);
    reorderBlocks(reorderedBlocks);
  };

  // Function to reset layout to original state
  const handleResetLayout = () => {
    console.log('Resetting dashboard layout to original state');
    const originalBlocks = getOriginalBlocks;
    initializeBlocks(originalBlocks);
  };

  // Initialize dashboard blocks with stable dependencies
  useEffect(() => {
    const initialBlocks = getOriginalBlocks;
    initializeBlocks(initialBlocks);
  }, [getOriginalBlocks, initializeBlocks]);

  // Enhanced AI context integration with real user data
  useQuantumAIIntegration({
    page: '/app/dashboard',
    content: `Dashboard overview: ${dashboardStats.totalNotes} total notes, ${dashboardStats.favoriteNotes} favorites, ${dashboardStats.weeklyNotes} notes this week. Categories: ${Object.keys(dashboardStats.categoryCounts).join(', ')}`,
    metadata: {
      totalNotes: dashboardStats.totalNotes,
      favoriteNotes: dashboardStats.favoriteNotes,
      weeklyNotes: dashboardStats.weeklyNotes,
      categoryCounts: dashboardStats.categoryCounts,
      recentNotesCount: dashboardStats.recentNotes.length,
      hasRecentActivity: dashboardStats.recentNotes.length > 0,
      totalWords: dashboardStats.totalWords
    }
  });

  return {
    blocks,
    isDragging,
    draggedBlockId,
    handleBlocksReorder,
    handleDragStart,
    handleDragEnd,
    handleResetLayout
  };
};
