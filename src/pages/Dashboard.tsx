
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useIsMobile } from '../hooks/use-mobile';
import KPIStats from '../components/Dashboard/KPIStats';
import RecentActivity from '../components/Dashboard/RecentActivity';
import WorkflowActions from '../components/Dashboard/WorkflowActions';
import QuantumAI3DToolbar from '../components/QuantumAI/QuantumAI3DToolbar';

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
    <div className={`h-full bg-background overflow-hidden ${isMobile ? 'w-full' : 'w-full'}`}>
      <div className={`${isMobile ? 'px-4 py-4' : 'px-8 py-6'} h-full flex flex-col w-full max-w-[1800px] mx-auto`}>
        
        {/* Intelligence Metrics - More compact */}
        <div className="flex-shrink-0 mb-8">
          <KPIStats 
            totalNotes={totalNotes}
            favoriteNotes={favoriteNotes}
            categoryCounts={categoryCounts}
            weeklyNotes={weeklyNotes}
          />
        </div>

        {/* Main Content Grid - Optimized for better space usage */}
        <div className={`flex-1 min-h-0 w-full grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} mb-8`}>
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

        {/* AI Copilot Toolbar - Better positioned */}
        <div className="flex-shrink-0 w-full flex justify-center items-center">
          <QuantumAI3DToolbar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
