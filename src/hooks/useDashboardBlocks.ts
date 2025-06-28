
import React, { useMemo } from 'react';
import { Note } from '../types/note';
import { useDashboardHandlers } from './dashboard/useDashboardHandlers';
import { useDashboardBlocksConfig } from './dashboard/useDashboardBlocksConfig';

interface DashboardStats {
  totalNotes: number;
  favoriteNotes: number;
  recentNotes: Note[];
  categoryCounts: Record<string, number>;
  weeklyNotes: number;
  totalWords: number;
  avgWordsPerNote: number;
}

export const useDashboardBlocks = (
  dashboardStats: DashboardStats,
  notes: Note[],
  setCurrentNote: (note: Note | null) => void
) => {
  // Get navigation handlers with proper memoization
  const { handleCreateNote, handleEditNote } = useDashboardHandlers(setCurrentNote);

  // Get blocks configuration with memoized handlers
  const { getOriginalBlocks } = useDashboardBlocksConfig({
    dashboardStats,
    notes,
    handleCreateNote,
    handleEditNote
  });

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    getOriginalBlocks,
    handleCreateNote,
    handleEditNote
  }), [getOriginalBlocks, handleCreateNote, handleEditNote]);
};
