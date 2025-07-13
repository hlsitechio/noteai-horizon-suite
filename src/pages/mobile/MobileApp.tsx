
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import EnhancedMobileLayout from '@/mobile/layout/EnhancedMobileLayout';
import MobileDashboard from '@/mobile/pages/MobileDashboard';
import MobileNotes from '@/mobile/pages/MobileNotes';
import MobileEditor from '@/mobile/pages/MobileEditor';
import MobileChat from '@/mobile/pages/MobileChat';
import MobileProjects from '@/mobile/pages/MobileProjects';
import MobileAnalytics from '@/mobile/pages/MobileAnalytics';
import EnhancedMobileSettings from '@/mobile/pages/EnhancedMobileSettings';
import { useNotes } from '@/contexts/NotesContext';

const MobileApp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('note');
  const { notes, setCurrentNote } = useNotes();

  // Removed debug logs to prevent PostHog rate limiting

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
          <Route path="notes" element={<MobileNotes />} />
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
