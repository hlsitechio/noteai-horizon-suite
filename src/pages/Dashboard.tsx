
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import KPIStats from '../components/Dashboard/KPIStats';
import SecureRecentActivity from '../components/Dashboard/SecureRecentActivity';
import AnalyticsOverview from '../components/Dashboard/AnalyticsOverview';
import WorkflowActions from '../components/Dashboard/WorkflowActions';
import FullscreenToggle from '../components/Dashboard/FullscreenToggle';

// Mock notes data
const mockNotes = [
  {
    id: '1',
    title: 'Welcome to Online Note AI',
    content: 'This is a demo note to show how the dashboard works.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'general',
    tags: ['welcome', 'demo'],
    isFavorite: false,
  },
  {
    id: '2',
    title: 'Getting Started',
    content: 'Here are some tips to get you started with the application.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    category: 'tutorial',
    tags: ['tutorial', 'getting-started'],
    isFavorite: true,
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Calculate stats from mock data
  const totalNotes = mockNotes.length;
  const favoriteNotes = mockNotes.filter(note => note.isFavorite).length;
  const recentNotes = mockNotes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const categoryCounts = mockNotes.reduce((acc, note) => {
    const category = note.category || 'general';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weeklyNotes = mockNotes.filter(note => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(note.createdAt) > weekAgo;
  }).length;


  const handleCreateNote = () => {
    console.log('Create note clicked - functionality not implemented in demo');
  };

  const handleEditNote = (note: any) => {
    console.log('Edit note clicked:', note.title);
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
            notes={mockNotes}
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
              notes={mockNotes}
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

          {/* Quick Actions - 3/12 columns */}
          <div className="col-span-3 h-full min-h-0">
            <WorkflowActions 
              notes={mockNotes}
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
