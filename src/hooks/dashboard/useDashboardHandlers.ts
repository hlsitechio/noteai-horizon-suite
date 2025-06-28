
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Note } from '../../types/note';

export const useDashboardHandlers = (setCurrentNote: (note: Note | null) => void) => {
  const navigate = useNavigate();

  const handleCreateNote = useCallback(() => {
    console.log('Dashboard: Creating new note');
    setCurrentNote(null);
    navigate('/app/editor');
  }, [navigate, setCurrentNote]);

  const handleEditNote = useCallback((note: Note) => {
    console.log('Dashboard: Editing note:', note.id);
    setCurrentNote(note);
    navigate('/app/editor');
  }, [navigate, setCurrentNote]);

  return {
    handleCreateNote,
    handleEditNote
  };
};
