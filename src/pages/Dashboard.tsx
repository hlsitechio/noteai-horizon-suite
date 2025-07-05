
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOptimizedNotes } from '../contexts/OptimizedNotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import KPIStats from '../components/Dashboard/KPIStats';
import SecureRecentActivity from '../components/Dashboard/SecureRecentActivity';
import AnalyticsOverview from '../components/Dashboard/AnalyticsOverview';
import ReminderManagement from '../components/Dashboard/ReminderManagement';
import FullscreenToggle from '../components/Dashboard/FullscreenToggle';
import AIUsageAnalytics from '../components/Dashboard/AIUsageAnalytics';
import SmartNoteRecommendations from '../components/Dashboard/SmartNoteRecommendations';

const Dashboard: React.FC = () => {
  const { notes, setCurrentNote } = useOptimizedNotes();
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
    <div className="w-full min-h-screen bg-background">
      {/* Fullscreen Toggle Button */}
      <FullscreenToggle />
      
      {/* Main Dashboard Container - Fully Responsive */}
      <div className="container mx-auto p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        
        {/* Welcome Header - Responsive height */}
        <div className="w-full">
          <WelcomeHeader />
        </div>

        {/* KPI Stats - Responsive */}
        <div className="w-full">
          <KPIStats 
            totalNotes={totalNotes}
            favoriteNotes={favoriteNotes}
            categoryCounts={categoryCounts}
            weeklyNotes={weeklyNotes}
            notes={notes}
          />
        </div>

        {/* Main Content Area - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Analytics Overview - Responsive columns */}
          <div className="lg:col-span-4 space-y-4">
            <AnalyticsOverview
              totalNotes={totalNotes}
              favoriteNotes={favoriteNotes}
              categoryCounts={categoryCounts}
              weeklyNotes={weeklyNotes}
              notes={notes}
            />
          </div>

          {/* AI Features Column - Responsive columns */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <AIUsageAnalytics />
            </div>
            <div>
              <SmartNoteRecommendations 
                notes={notes}
                onEditNote={handleEditNote}
              />
            </div>
          </div>

          {/* Activity & Reminders Column - Responsive columns */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <SecureRecentActivity 
                recentNotes={recentNotes}
                onCreateNote={handleCreateNote}
                onEditNote={handleEditNote}
              />
            </div>
            <div>
              <ReminderManagement 
                notes={notes}
                onEditNote={handleEditNote}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
