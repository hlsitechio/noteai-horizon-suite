import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import { useDashboardLayout, DashboardBlock } from '../hooks/useDashboardLayout';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import KPIStats from '../components/Dashboard/KPIStats';
import SecureRecentActivity from '../components/Dashboard/SecureRecentActivity';
import AnalyticsOverview from '../components/Dashboard/AnalyticsOverview';
import WorkflowActions from '../components/Dashboard/WorkflowActions';
import FullscreenToggle from '../components/Dashboard/FullscreenToggle';
import DraggableBlock from '../components/Dashboard/DraggableBlock';
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

  // Initialize dashboard blocks
  useEffect(() => {
    const initialBlocks: DashboardBlock[] = [
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
        gridClass: 'col-span-5'
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
        gridClass: 'col-span-3'
      }
    ];
    
    initializeBlocks(initialBlocks);
  }, [totalNotes, favoriteNotes, categoryCounts, weeklyNotes, notes, recentNotes]);

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
      totalWords: notes.reduce((acc, note) => {
        const wordCount = note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
        return acc + wordCount;
      }, 0)
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

        {/* KPI Stats - Optimized height for 1080p */}
        <div className="flex-shrink-0 w-full h-[90px]">
          <KPIStats 
            totalNotes={totalNotes}
            favoriteNotes={favoriteNotes}
            categoryCounts={categoryCounts}
            weeklyNotes={weeklyNotes}
            notes={notes}
          />
        </div>

        {/* Main Content Area - Enhanced with drag feedback */}
        <div className={`grid grid-cols-12 gap-4 flex-1 min-h-0 w-full h-[770px] relative transition-all duration-200 ${
          isDragging ? 'bg-blue-50/30' : ''
        }`}>
          {blocks.map((block) => {
            const BlockComponent = block.component;
            return (
              <DraggableBlock
                key={block.id}
                id={block.id}
                gridClass={block.gridClass}
                onSwap={handleBlockSwap}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <BlockComponent {...block.props} />
              </DraggableBlock>
            );
          })}
          
          {/* Drag status indicator */}
          {isDragging && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-medium">
              Dragging: {draggedBlockId} - Drop on another block to swap
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
