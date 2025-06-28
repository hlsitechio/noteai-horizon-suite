import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import { useDashboardLayout, DashboardBlock } from './useDashboardLayout';
import { Note } from '../types/note';
import KPINotesBlock from '../components/Dashboard/KPIBlocks/KPINotesBlock';
import KPIFavoritesBlock from '../components/Dashboard/KPIBlocks/KPIFavoritesBlock';
import KPIAvgWordsBlock from '../components/Dashboard/KPIBlocks/KPIAvgWordsBlock';
import KPICategoriesBlock from '../components/Dashboard/KPIBlocks/KPICategoriesBlock';
import KPITotalWordsBlock from '../components/Dashboard/KPIBlocks/KPITotalWordsBlock';
import KPIWeeklyBlock from '../components/Dashboard/KPIBlocks/KPIWeeklyBlock';
import AnalyticsOverview from '../components/Dashboard/AnalyticsOverview';
import SecureRecentActivity from '../components/Dashboard/SecureRecentActivity';
import CategoriesOverview from '../components/Dashboard/CategoriesOverview';
import RecentNotesBlock from '../components/Dashboard/RecentNotesBlock';
import QuickActionsBlock from '../components/Dashboard/QuickActionsBlock';

export const useDashboard = () => {
  const { notes, setCurrentNote } = useNotes();
  const navigate = useNavigate();
  const { blocks, initializeBlocks, reorderBlocks } = useDashboardLayout();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  // Memoize derived stats to prevent redundant calculations
  const dashboardStats = useMemo(() => {
    const totalNotes = notes.length;
    const favoriteNotes = notes.filter(note => note.isFavorite).length;
    const recentNotes = [...notes]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
    
    const categoryCounts = notes.reduce((acc, note) => {
      const category = note.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const weeklyNotes = notes.filter(note => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(note.createdAt) > weekAgo;
    }).length;
    
    const totalWords = notes.reduce((acc, note) => {
      const wordCount = note.content?.split(/\s+/).filter(Boolean).length || 0;
      return acc + wordCount;
    }, 0);
    
    const avgWordsPerNote = totalNotes ? Math.round(totalWords / totalNotes) : 0;

    return {
      totalNotes,
      favoriteNotes,
      recentNotes,
      categoryCounts,
      weeklyNotes,
      totalWords,
      avgWordsPerNote
    };
  }, [notes]);

  // Stable handler functions to prevent unnecessary re-renders
  const handleCreateNote = () => {
    setCurrentNote(null);
    navigate('/app/editor');
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    navigate('/app/editor');
  };

  const handleBlocksReorder = (reorderedBlocks: DashboardBlock[]) => {
    console.log('Dashboard: Reordering blocks to new order:', reorderedBlocks.map(b => b.id));
    reorderBlocks(reorderedBlocks);
  };

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

  // Function to reset layout to original state
  const handleResetLayout = () => {
    console.log('Resetting dashboard layout to original state');
    const originalBlocks = getOriginalBlocks();
    initializeBlocks(originalBlocks);
  };

  // Function to get original blocks configuration
  const getOriginalBlocks = (): DashboardBlock[] => {
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
  };

  // Initialize dashboard blocks with stable dependencies
  useEffect(() => {
    const initialBlocks = getOriginalBlocks();
    initializeBlocks(initialBlocks);
  }, [dashboardStats, initializeBlocks]);

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

  // Enhanced drag telemetry for AI insights
  useEffect(() => {
    if (isDragging && draggedBlockId) {
      console.log(`[DragAI] Active drag session: ${draggedBlockId}`);
    }
  }, [isDragging, draggedBlockId]);

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
