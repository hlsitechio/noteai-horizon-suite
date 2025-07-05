
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import EnhancedMobileLayout from './layout/EnhancedMobileLayout';
import MobileDashboard from './pages/MobileDashboard';
import EnhancedMobileNotes from './pages/EnhancedMobileNotes';
// MobileEditor removed - now using unified Editor
import MobileChat from './pages/MobileChat';
import MobileProjects from './pages/MobileProjects';
import MobileAnalytics from './pages/MobileAnalytics';
import EnhancedMobileSettings from './pages/EnhancedMobileSettings';
import MobileSettings from './pages/MobileSettings';
import { useNotes } from '../contexts/NotesContext';

const MobileApp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('note');
  const { notes, setCurrentNote } = useNotes();

  console.log('Enhanced MobileApp rendering', { noteId, notesCount: notes.length });

  // Handle note routing - if a note ID is provided, set it as current and navigate to editor
  React.useEffect(() => {
    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setCurrentNote(note);
      }
    }
  }, [noteId, notes, setCurrentNote]);

  return (
    <div className="h-full w-full overflow-hidden">
      <Routes>
        <Route path="/" element={<EnhancedMobileLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MobileDashboard />} />
          <Route path="notes" element={<EnhancedMobileNotes />} />
          <Route path="editor" element={<Navigate to="/app/editor" replace />} />
          <Route path="chat" element={<MobileChat />} />
          <Route path="projects" element={<MobileProjects />} />
          <Route path="analytics" element={<MobileAnalytics />} />
          <Route path="settings" element={<EnhancedMobileSettings />} />
          {/* Fallback settings route for compatibility */}
          <Route path="settings-simple" element={<MobileSettings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default MobileApp;
