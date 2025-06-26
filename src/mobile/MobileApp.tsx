
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import MobileLayout from './layout/MobileLayout';
import MobileNotes from './pages/MobileNotes';
import MobileEditor from './pages/MobileEditor';
import MobileSettings from './pages/MobileSettings';
import { useNotes } from '../contexts/NotesContext';

const MobileApp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('note');
  const { notes, setCurrentNote } = useNotes();

  console.log('MobileApp rendering', { noteId, notesCount: notes.length });

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
    <div className="mobile-app h-screen overflow-hidden bg-background">
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Navigate to="notes" replace />} />
          <Route path="notes" element={<MobileNotes />} />
          <Route path="editor" element={<MobileEditor />} />
          <Route path="settings" element={<MobileSettings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default MobileApp;
