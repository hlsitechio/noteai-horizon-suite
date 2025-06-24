
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
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

  const handleCreateNote = () => {
    setCurrentNote(null);
    navigate('/app/editor');
  };

  const handleEditNote = (note: any) => {
    setCurrentNote(note);
    navigate('/app/editor');
  };

  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'w-full' : 'w-full'}`}>
      <div className={`${isMobile ? 'px-4 py-6' : 'px-8 py-8'} space-y-8 w-full max-w-7xl mx-auto`}>
        {/* Professional Header */}
        <DashboardHeader onCreateNote={handleCreateNote} />

        {/* Intelligence Metrics */}
        <KPIStats 
          totalNotes={totalNotes}
          favoriteNotes={favoriteNotes}
          categoryCounts={categoryCounts}
          weeklyNotes={weeklyNotes}
        />

        {/* Content Management Section */}
        <div className={`w-full grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {/* Recent Activity */}
          <RecentActivity 
            recentNotes={recentNotes}
            onCreateNote={handleCreateNote}
            onEditNote={handleEditNote}
          />

          {/* Quick Actions */}
          <WorkflowActions 
            notes={notes}
            onCreateNote={handleCreateNote}
            onEditNote={handleEditNote}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
