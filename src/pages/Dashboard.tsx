
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import KPIStats from '../components/Dashboard/KPIStats';
import SecureRecentActivity from '../components/Dashboard/SecureRecentActivity';
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
    <div className="w-full h-full flex flex-col bg-background">
      {/* Fullscreen Toggle Button */}
      <FullscreenToggle />
      
      {/* Optimized Container - Remove overflow hidden and use minimal gaps */}
      <div className="flex-1 flex flex-col p-1 gap-1 w-full min-h-0">
        
        {/* Compact Welcome Header - Fixed height */}
        <div className="flex-shrink-0 w-full h-40">
          <WelcomeHeader />
        </div>

        {/* Compact KPI Stats - Fixed height */}
        <div className="flex-shrink-0 w-full h-20">
          <KPIStats 
            totalNotes={totalNotes}
            favoriteNotes={favoriteNotes}
            categoryCounts={categoryCounts}
            weeklyNotes={weeklyNotes}
          />
        </div>

        {/* Main Content Area - Rebalanced 7:5 ratio with minimal gap */}
        <div className="grid grid-cols-12 gap-1 flex-1 min-h-0 w-full">
          {/* Recent Activity - 7/12 columns for better content space */}
          <div className="col-span-7 h-full min-h-0">
            <SecureRecentActivity 
              recentNotes={recentNotes}
              onCreateNote={handleCreateNote}
              onEditNote={handleEditNote}
            />
          </div>

          {/* Quick Actions - 5/12 columns for better balance */}
          <div className="col-span-5 h-full min-h-0">
            <WorkflowActions 
              notes={notes}
              onCreateNote={handleCreateNote}
              onEditNote={handleEditNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
