
import { useMemo } from 'react';
import { DashboardBlock } from '../useDashboardLayout';
import { Note } from '../../types/note';
import KPINotesBlock from '../../components/Dashboard/KPIBlocks/KPINotesBlock';
import KPIFavoritesBlock from '../../components/Dashboard/KPIBlocks/KPIFavoritesBlock';
import KPIAvgWordsBlock from '../../components/Dashboard/KPIBlocks/KPIAvgWordsBlock';
import KPICategoriesBlock from '../../components/Dashboard/KPIBlocks/KPICategoriesBlock';
import AnalyticsOverview from '../../components/Dashboard/AnalyticsOverview';
import SecureRecentActivity from '../../components/Dashboard/SecureRecentActivity';
import WorkflowActions from '../../components/Dashboard/WorkflowActions';

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
  // Zone-aware blocks configuration with your finalized setup
  const getOriginalBlocks = useMemo((): DashboardBlock[] => {
    console.log('Creating zone-aware dashboard blocks configuration');
    return [
      // ✅ KPI Zone
      {
        id: 'kpi-notes',
        component: KPINotesBlock,
        props: {
          totalNotes: dashboardStats.totalNotes,
          weeklyNotes: dashboardStats.weeklyNotes
        },
        gridClass: 'col-span-3'
      },
      {
        id: 'kpi-favorites',
        component: KPIFavoritesBlock,
        props: {
          favoriteNotes: dashboardStats.favoriteNotes,
          totalNotes: dashboardStats.totalNotes
        },
        gridClass: 'col-span-3'
      },
      {
        id: 'kpi-avg-words',
        component: KPIAvgWordsBlock,
        props: {
          avgWordsPerNote: dashboardStats.avgWordsPerNote,
          totalWords: dashboardStats.totalWords
        },
        gridClass: 'col-span-3'
      },
      {
        id: 'kpi-categories',
        component: KPICategoriesBlock,
        props: {
          categoryCounts: dashboardStats.categoryCounts
        },
        gridClass: 'col-span-3'
      },

      // 📊 Charts / Analytics Zone
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
        gridClass: 'col-span-6'
      },

      // ⚡ Quick Actions Zone
      {
        id: 'workflow-actions',
        component: WorkflowActions,
        props: {
          notes,
          onCreateNote: handleCreateNote,
          onEditNote: handleEditNote
        },
        gridClass: 'col-span-6'
      },

      // 🕒 Recent Activity Zone
      {
        id: 'recent-activity',
        component: SecureRecentActivity,
        props: {
          recentNotes: dashboardStats.recentNotes,
          onCreateNote: handleCreateNote,
          onEditNote: handleEditNote
        },
        gridClass: 'col-span-6'
      },

      // 🧾 Recent Notes Zone
      {
        id: 'recent-notes',
        component: SecureRecentActivity,
        props: {
          recentNotes: dashboardStats.recentNotes,
          onCreateNote: handleCreateNote,
          onEditNote: handleEditNote
        },
        gridClass: 'col-span-6'
      }
    ];
  }, [
    dashboardStats.totalNotes,
    dashboardStats.favoriteNotes,
    dashboardStats.avgWordsPerNote,
    dashboardStats.totalWords,
    dashboardStats.categoryCounts,
    dashboardStats.weeklyNotes,
    dashboardStats.recentNotes,
    notes,
    handleCreateNote,
    handleEditNote
  ]);

  return {
    getOriginalBlocks
  };
};
