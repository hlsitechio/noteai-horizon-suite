
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import { useDashboardLayout, DashboardBlock } from '../hooks/useDashboardLayout';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import AnalyticsOverview from '../components/Dashboard/AnalyticsOverview';
import SecureRecentActivity from '../components/Dashboard/SecureRecentActivity';
import WorkflowActions from '../components/Dashboard/WorkflowActions';
import FullscreenToggle from '../components/Dashboard/FullscreenToggle';
import DraggableBlock from '../components/Dashboard/DraggableBlock';
import KPINotesBlock from '../components/Dashboard/KPIBlocks/KPINotesBlock';
import KPIFavoritesBlock from '../components/Dashboard/KPIBlocks/KPIFavoritesBlock';
import KPIAvgWordsBlock from '../components/Dashboard/KPIBlocks/KPIAvgWordsBlock';
import KPICategoriesBlock from '../components/Dashboard/KPIBlocks/KPICategoriesBlock';
import '../components/Dashboard/DragDropStyles.css';

const Dashboard: React.FC = () => {
  const { notes, setCurrentNote } = useNotes();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { blocks, initializeBlocks, swapBlocks } = useDashboardLayout();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  // Calculate stats from real user data
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(note => note.isFavorite).length;
  const recentNotes = notes
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
    const wordCount = note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
    return acc + wordCount;
  }, 0);

  const avgWordsPerNote = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;

  // Initialize dashboard blocks
  useEffect(() => {
    const initialBlocks: DashboardBlock[] = [
      // KPI Stats as individual draggable blocks
      {
        id: 'kpi-notes',
        component: KPINotesBlock,
        props: {
          totalNotes,
          weeklyNotes
        },
        gridClass: 'col-span-2'
      },
      {
        id: 'kpi-favorites',
        component: KPIFavoritesBlock,
        props: {
          favoriteNotes,
          totalNotes
        },
        gridClass: 'col-span-2'
      },
      {
        id: 'kpi-avg-words',
        component: KPIAvgWordsBlock,
        props: {
          avgWordsPerNote,
          totalWords
        },
        gridClass: 'col-span-2'
      },
      {
        id: 'kpi-categories',
        component: KPICategoriesBlock,
        props: {
          categoryCounts
        },
        gridClass: 'col-span-2'
      },
      // Main dashboard components
      {
        id: 'analytics',
        component: AnalyticsOverview,
        props: {
          totalNotes,
          favoriteNotes,
          categoryCounts,
          weeklyNotes,
          notes
        },
        gridClass: 'col-span-4'
      },
      {
        id: 'recent-activity',
        component: SecureRecentActivity,
        props: {
          recentNotes,
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
  }, [totalNotes, favoriteNotes, categoryCounts, weeklyNotes, notes, recentNotes, avgWordsPerNote, totalWords]);

  // Enhanced AI context integration with real user data
  useQuantumAIIntegration({
    page: '/app/dashboard',
    content: `Dashboard overview: ${totalNotes} total notes, ${favoriteNotes} favorites, ${weeklyNotes} notes this week. Categories: ${Object.keys(categoryCounts).join(', ')}`,
    metadata: {
      totalNotes,
      favoriteNotes,
      weeklyNotes,
      categoryCounts,
      recentNotesCount: recentNotes.length,
      hasRecentActivity: recentNotes.length > 0,
      totalWords
    }
  });

  const handleCreateNote = () => {
    setCurrentNote(null);
    navigate('/app/editor');
  };

  const handleEditNote = (note: any) => {
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
    console.log('Drag started for block:', id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedBlockId(null);
    console.log('Drag ended');
  };

  return (
    <div className="w-full h-screen max-h-screen flex flex-col bg-background overflow-hidden">
      {/* Fullscreen Toggle Button */}
      <FullscreenToggle />
      
      {/* Main Dashboard Container - Exact 1920x1080 fit */}
      <div className="flex-1 flex flex-col p-4 gap-4 w-full max-w-[1920px] max-h-[1080px] mx-auto">
        
        {/* Welcome Header - Fixed height for 1080p */}
        <div className="flex-shrink-0 w-full h-[180px]">
          <WelcomeHeader />
        </div>

        {/* Main Content Area - All draggable components */}
        <div className={`dashboard-grid grid grid-cols-12 gap-4 flex-1 min-h-0 w-full h-[850px] relative transition-all duration-300 auto-rows-fr ${
          isDragging ? 'dragging-active bg-gradient-to-br from-blue-50/20 to-purple-50/20' : ''
        }`}>
          {blocks.map((block) => {
            const BlockComponent = block.component;
            return (
              <DraggableBlock
                key={block.id}
                id={block.id}
                gridClass={`${block.gridClass} ${block.id.startsWith('kpi-') ? 'min-h-[120px]' : 'min-h-[300px]'}`}
                onSwap={handleBlockSwap}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <BlockComponent {...block.props} />
              </DraggableBlock>
            );
          })}
          
          {/* Enhanced drag status indicator with better positioning */}
          {isDragging && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-xl font-semibold backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Dragging: {draggedBlockId} - Drop on another block to swap
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
