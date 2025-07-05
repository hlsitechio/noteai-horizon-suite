import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOptimizedNotes } from '../contexts/OptimizedNotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import { SidebarTrigger } from '@/components/ui/sidebar';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import KPIStats from '../components/Dashboard/KPIStats';
import SecureRecentActivity from '../components/Dashboard/SecureRecentActivity';
import ReminderManagement from '../components/Dashboard/ReminderManagement';
import FullscreenToggle from '../components/Dashboard/FullscreenToggle';
import SmartNoteRecommendations from '../components/Dashboard/SmartNoteRecommendations';
import 'boxicons/css/boxicons.min.css';

const OptimizedDashboard: React.FC = () => {
  const { notes, setCurrentNote } = useOptimizedNotes();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Memoized calculations - only recalculate when notes change
  const dashboardStats = useMemo(() => {
    const totalNotes = notes.length;
    const favoriteNotes = notes.filter(note => note.isFavorite).length;
    
    const categoryCounts = notes.reduce((acc, note) => {
      const category = note.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyNotes = notes.filter(note => 
      new Date(note.createdAt) > weekAgo
    ).length;

    const totalWords = notes.reduce((acc, note) => {
      const wordCount = note.content ? 
        note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
      return acc + wordCount;
    }, 0);

    return {
      totalNotes,
      favoriteNotes,
      categoryCounts,
      weeklyNotes,
      totalWords,
    };
  }, [notes]);

  // Memoized recent notes - only recalculate when notes change
  const recentNotes = useMemo(() => {
    return notes
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [notes]);

  // Memoized AI context - only update when stats change, not on every render
  const aiContextContent = useMemo(() => {
    const { totalNotes, favoriteNotes, weeklyNotes, categoryCounts } = dashboardStats;
    return `Dashboard overview: ${totalNotes} total notes, ${favoriteNotes} favorites, ${weeklyNotes} notes this week. Categories: ${Object.keys(categoryCounts).join(', ')}`;
  }, [dashboardStats]);

  // Enhanced AI context integration with stable dependencies
  useQuantumAIIntegration({
    page: '/app/dashboard',
    content: aiContextContent,
    metadata: {
      ...dashboardStats,
      recentNotesCount: recentNotes.length,
      hasRecentActivity: recentNotes.length > 0,
    }
  });

  // Memoized event handlers
  const handleCreateNote = useCallback(() => {
    setCurrentNote(null);
    navigate('/app/editor');
  }, [setCurrentNote, navigate]);

  const handleEditNote = useCallback((note: any) => {
    setCurrentNote(note);
    navigate('/app/editor');
  }, [setCurrentNote, navigate]);

  return (
    <div className="w-full min-h-screen bg-background overflow-y-auto">
      {/* Clean Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-8 w-8 p-0" />
            <div className="text-sm text-muted-foreground font-medium">Dashboard</div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen Toggle Button */}
      <FullscreenToggle />
      
      {/* Clean Dashboard Container */}
      <div className="container mx-auto p-4 lg:p-6 space-y-6 max-w-7xl">
        
        {/* Welcome Section */}
        <div className="w-full">
          <WelcomeHeader />
        </div>

        {/* KPI Overview */}
        <div className="w-full">
          <KPIStats 
            totalNotes={dashboardStats.totalNotes}
            favoriteNotes={dashboardStats.favoriteNotes}
            categoryCounts={dashboardStats.categoryCounts}
            weeklyNotes={dashboardStats.weeklyNotes}
            notes={notes}
          />
        </div>

        {/* Simplified Content - More Minimalist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Smart Features Column */}
          <div className="space-y-6">
            <SmartNoteRecommendations 
              notes={notes}
              onEditNote={handleEditNote}
            />
          </div>

          {/* Activity & Management Column */}
          <div className="space-y-6">
            <SecureRecentActivity 
              recentNotes={recentNotes}
              onCreateNote={handleCreateNote}
              onEditNote={handleEditNote}
            />
            <ReminderManagement 
              notes={notes}
              onEditNote={handleEditNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OptimizedDashboard);