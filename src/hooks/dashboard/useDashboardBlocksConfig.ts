
import { useMemo } from 'react';
import { DashboardBlock } from '../useDashboardLayout';
import { Note } from '../../types/note';
import KPINotesBlock from '../../components/Dashboard/KPIBlocks/KPINotesBlock';
import KPIFavoritesBlock from '../../components/Dashboard/KPIBlocks/KPIFavoritesBlock';
import KPIAvgWordsBlock from '../../components/Dashboard/KPIBlocks/KPIAvgWordsBlock';
import KPICategoriesBlock from '../../components/Dashboard/KPIBlocks/KPICategoriesBlock';
import KPITotalWordsBlock from '../../components/Dashboard/KPIBlocks/KPITotalWordsBlock';
import KPIWeeklyBlock from '../../components/Dashboard/KPIBlocks/KPIWeeklyBlock';
import AnalyticsOverview from '../../components/Dashboard/AnalyticsOverview';
import SecureRecentActivity from '../../components/Dashboard/SecureRecentActivity';
import CategoriesOverview from '../../components/Dashboard/CategoriesOverview';
import RecentNotesBlock from '../../components/Dashboard/RecentNotesBlock';
import QuickActionsBlock from '../../components/Dashboard/QuickActionsBlock';

interface DashboardStats {
  totalNotes: number;
  favoriteNotes: number;
  recentNotes: Note[];
  categoryCounts: Record<string, number>;
  weeklyNotes: number;
  totalWords: number;
  avgWordsPerNote: number;
}

interface BlocksConfigOptions {
  dashboardStats: DashboardStats;
  notes: Note[];
  handleCreateNote: () => void;
  handleEditNote: (note: Note) => void;
}

export const useDashboardBlocksConfig = ({
  dashboardStats,
  notes,
  handleCreateNote,
  handleEditNote
}: BlocksConfigOptions) => {
  // Function to get original blocks configuration
  const getOriginalBlocks = useMemo((): DashboardBlock[] => {
    return [
      // KPI Stats as individual draggable blocks - Row 1
      {
        id: 'kpi-notes',
        component: KPINotesBlock,
        props: {
          totalNotes: dashboardStats.totalNotes,
          weeklyNotes: dashboardStats.weeklyNotes
        },
        gridClass: 'col-span-2'
      },
      {
        id: 'kpi-favorites',
        component: KPIFavoritesBlock,
        props: {
          favoriteNotes: dashboardStats.favoriteNotes,
          totalNotes: dashboardStats.totalNotes
        },
        gridClass: 'col-span-2'
      },
      {
        id: 'kpi-avg-words',
        component: KPIAvgWordsBlock,
        props: {
          avgWordsPerNote: dashboardStats.avgWordsPerNote,
          totalWords: dashboardStats.totalWords
        },
        gridClass: 'col-span-2'
      },
      {
        id: 'kpi-categories',
        component: KPICategoriesBlock,
        props: {
          categoryCounts: dashboardStats.categoryCounts
        },
        gridClass: 'col-span-2'
      },
      {
        id: 'kpi-total-words',
        component: KPITotalWordsBlock,
        props: {
          totalWords: dashboardStats.totalWords
        },
        gridClass: 'col-span-2'
      },
      {
        id: 'kpi-weekly',
        component: KPIWeeklyBlock,
        props: {
          weeklyNotes: dashboardStats.weeklyNotes
        },
        gridClass: 'col-span-2'
      },
      // Main dashboard components - Row 2
      {
        id: 'analytics',
        component: AnalyticsOverview,
        props: {
          totalNotes: dashboardStats.totalNotes,
          favoriteNotes: dashboardStats.favoriteNotes,
          categoryCounts: dashboardStats.categoryCounts,
          weeklyNotes: dashboardStats.weeklyNotes,
          notes
        },
        gridClass: 'col-span-3'
      },
      {
        id: 'recent-activity',
        component: SecureRecentActivity,
        props: {
          recentNotes: dashboardStats.recentNotes,
          onCreateNote: handleCreateNote,
          onEditNote: handleEditNote
        },
        gridClass: 'col-span-3'
      },
      {
        id: 'categories-overview',
        component: CategoriesOverview,
        props: {
          categoryCounts: dashboardStats.categoryCounts,
          totalNotes: dashboardStats.totalNotes
        },
        gridClass: 'col-span-3'
      },
      {
        id: 'quick-actions',
        component: QuickActionsBlock,
        props: {
          onCreateNote: handleCreateNote
        },
        gridClass: 'col-span-3'
      },
      {
        id: 'recent-notes',
        component: RecentNotesBlock,
        props: {
          notes,
          onEditNote: handleEditNote
        },
        gridClass: 'col-span-6'
      }
    ];
  }, [dashboardStats, notes, handleCreateNote, handleEditNote]);

  return {
    getOriginalBlocks
  };
};
