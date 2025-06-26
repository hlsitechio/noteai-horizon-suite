
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import KPIStats from '../components/Dashboard/KPIStats';
import RecentActivity from '../components/Dashboard/RecentActivity';
import WorkflowActions from '../components/Dashboard/WorkflowActions';

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

        {/* Additional Content Sections for Scrolling */}
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12">
            <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/10 p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Additional Dashboard Content</h3>
              <p className="text-muted-foreground mb-4">
                This section demonstrates scrollable content. You can now scroll through your dashboard to see more information and analytics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                    <h4 className="font-semibold text-foreground mb-2">Feature {item}</h4>
                    <p className="text-sm text-muted-foreground">
                      This is additional content that makes the dashboard scrollable. You can add more sections here as needed.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* More sections to demonstrate scrolling */}
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-6">
            <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/10 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Analytics Overview</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                    <span className="text-foreground">Metric {item}</span>
                    <span className="text-accent font-semibold">{Math.floor(Math.random() * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-6">
            <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/10 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Recent Updates</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-start gap-3 p-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-foreground">Update {item}</p>
                      <p className="text-xs text-muted-foreground">Recent system improvement</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Dashboard;
