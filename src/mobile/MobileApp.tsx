
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import EnhancedMobileLayout from './layout/EnhancedMobileLayout';
import MobileDashboard from './pages/MobileDashboard';
import EnhancedMobileNotes from './pages/EnhancedMobileNotes';
import MobileEditor from './pages/MobileEditor';
import MobileChat from './pages/MobileChat';
import MobileProjects from './pages/MobileProjects';
import MobileAnalytics from './pages/MobileAnalytics';
import EnhancedMobileSettings from './pages/EnhancedMobileSettings';
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
    <div className="mobile-app h-full w-full overflow-hidden bg-background relative isolate">
      <Routes>
        <Route path="/" element={<EnhancedMobileLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MobileDashboard />} />
          <Route path="notes" element={<EnhancedMobileNotes />} />
          <Route path="editor" element={<MobileEditor />} />
          <Route path="chat" element={<MobileChat />} />
          <Route path="projects" element={<MobileProjects />} />
          <Route path="analytics" element={<MobileAnalytics />} />
          <Route path="settings" element={<EnhancedMobileSettings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default MobileApp;
