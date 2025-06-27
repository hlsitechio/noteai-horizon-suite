
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import KPIStats from '../components/Dashboard/KPIStats';
import RecentActivity from '../components/Dashboard/RecentActivity';
import WorkflowActions from '../components/Dashboard/WorkflowActions';
import FullscreenToggle from '../components/Dashboard/FullscreenToggle';

const Dashboard: React.FC = () => {
  const { notes, setCurrentNote } = useNotes();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Calculate stats
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(note => note.isFavorite).length;
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const categoryCounts = notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weeklyNotes = notes.filter(note => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(note.createdAt) > weekAgo;
  }).length;

  // Enhanced AI context integration
  useQuantumAIIntegration({
    page: '/app/dashboard',
    content: `Dashboard overview: ${totalNotes} total notes, ${favoriteNotes} favorites, ${weeklyNotes} notes this week`,
    metadata: {
      totalNotes,
      favoriteNotes,
      weeklyNotes,
      categoryCounts,
      recentNotesCount: recentNotes.length,
      hasRecentActivity: recentNotes.length > 0
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

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      {/* Fullscreen Toggle Button */}
      <FullscreenToggle />
      
      <div className="flex-1 flex flex-col w-full px-6 py-4 space-y-6">
        
        {/* Welcome Header */}
        <div className="flex-shrink-0 pt-2">
          <WelcomeHeader />
        </div>

        {/* Top Section - KPI Stats */}
        <div className="flex-shrink-0">
          <KPIStats 
            totalNotes={totalNotes}
            favoriteNotes={favoriteNotes}
            categoryCounts={categoryCounts}
            weeklyNotes={weeklyNotes}
          />
        </div>

        {/* Main Content Area - Full width grid */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Recent Activity - Takes more space */}
          <div className="col-span-8">
            <RecentActivity 
              recentNotes={recentNotes}
              onCreateNote={handleCreateNote}
              onEditNote={handleEditNote}
            />
          </div>

          {/* Quick Actions - Compact sidebar */}
          <div className="col-span-4">
            <WorkflowActions 
              notes={notes}
              onCreateNote={handleCreateNote}
              onEditNote={handleEditNote}
            />
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Dashboard;
