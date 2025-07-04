
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import KPIStats from '../components/Dashboard/KPIStats';
import SecureRecentActivity from '../components/Dashboard/SecureRecentActivity';
import AnalyticsOverview from '../components/Dashboard/AnalyticsOverview';
import ReminderManagement from '../components/Dashboard/ReminderManagement';
import FullscreenToggle from '../components/Dashboard/FullscreenToggle';

const Dashboard: React.FC = () => {
  const { notes, setCurrentNote } = useNotes();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

        {/* Main Content Area - Calculated height to fill remaining space */}
        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 w-full h-[770px]">
          {/* Analytics Overview - 5/12 columns */}
          <div className="col-span-5 h-full min-h-0">
            <AnalyticsOverview
              totalNotes={totalNotes}
              favoriteNotes={favoriteNotes}
              categoryCounts={categoryCounts}
              weeklyNotes={weeklyNotes}
              notes={notes}
            />
          </div>

          {/* Recent Activity - 4/12 columns */}
          <div className="col-span-4 h-full min-h-0">
            <SecureRecentActivity 
              recentNotes={recentNotes}
              onCreateNote={handleCreateNote}
              onEditNote={handleEditNote}
            />
          </div>

          {/* Reminder Management - 3/12 columns */}
          <div className="col-span-3 h-full min-h-0">
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

export default Dashboard;
