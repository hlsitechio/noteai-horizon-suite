
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOptimizedNotes } from '../contexts/OptimizedNotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import BannerControls from '../components/Dashboard/WelcomeHeader/BannerControls';
import { useWelcomeHeader } from '../components/Dashboard/WelcomeHeader/hooks/useWelcomeHeader';
import KPIStats from '../components/Dashboard/KPIStats';
import SecureRecentActivity from '../components/Dashboard/SecureRecentActivity';
import ReminderManagement from '../components/Dashboard/ReminderManagement';
import FullscreenToggle from '../components/Dashboard/FullscreenToggle';
import SmartNoteRecommendations from '../components/Dashboard/SmartNoteRecommendations';

const Dashboard: React.FC = () => {
  const { notes, setCurrentNote } = useOptimizedNotes();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Get banner control functions
  const {
    bannerData,
    handleBannerUpdate,
    handleBannerDelete,
    handleAIBannerGenerated
  } = useWelcomeHeader();

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
      {/* Clean Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-8 w-8 p-0" />
            <div className="text-sm text-muted-foreground font-medium">Dashboard</div>
          </div>
          
          {/* Banner Controls */}
          <BannerControls
            showControls={true}
            currentBannerUrl={bannerData?.url}
            onBannerUpdate={handleBannerUpdate}
            onBannerDelete={handleBannerDelete}
            onAIBannerGenerated={handleAIBannerGenerated}
          />
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
            totalNotes={totalNotes}
            favoriteNotes={favoriteNotes}
            categoryCounts={categoryCounts}
            weeklyNotes={weeklyNotes}
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

export default Dashboard;
