
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
import AnalyticsOverview from '../components/Dashboard/AnalyticsOverview';
import SecureRecentActivity from '../components/Dashboard/SecureRecentActivity';
import WorkflowActions from '../components/Dashboard/WorkflowActions';

export const useDashboard = () => {
  const { notes, setCurrentNote } = useNotes();
  const navigate = useNavigate();
  const { blocks, initializeBlocks, swapBlocks } = useDashboardLayout();
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

  const handleBlockSwap = (draggedId: string, targetId: string) => {
    console.log('Dashboard: Swapping blocks', draggedId, 'with', targetId);
    swapBlocks(draggedId, targetId);
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

  // Initialize dashboard blocks with stable dependencies
  useEffect(() => {
    const initialBlocks: DashboardBlock[] = [
      // KPI Stats as individual draggable blocks
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
      // Main dashboard components
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
        gridClass: 'col-span-4'
      },
      {
        id: 'recent-activity',
        component: SecureRecentActivity,
        props: {
          recentNotes: dashboardStats.recentNotes,
          onCreateNote: handleCreateNote,
          onEditNote: handleEditNote
        },
        gridClass: 'col-span-4'
      },
      {
        id: 'workflow-actions',
        component: WorkflowActions,
        props: {
          notes,
          onCreateNote: handleCreateNote,
          onEditNote: handleEditNote
        },
        gridClass: 'col-span-4'
      }
    ];
    
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
    handleBlockSwap,
    handleDragStart,
    handleDragEnd
  };
};
