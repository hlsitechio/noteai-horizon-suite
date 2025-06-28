
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
  // Get navigation handlers
  const { handleCreateNote, handleEditNote } = useDashboardHandlers(setCurrentNote);

  // Get blocks configuration
  const { getOriginalBlocks } = useDashboardBlocksConfig({
    dashboardStats,
    notes,
    handleCreateNote,
    handleEditNote
  });

  return {
    getOriginalBlocks,
    handleCreateNote,
    handleEditNote
  };
};
