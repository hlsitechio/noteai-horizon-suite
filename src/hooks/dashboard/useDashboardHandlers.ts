
import { useNavigate } from 'react-router-dom';
import { Note } from '../../types/note';

export const useDashboardHandlers = (setCurrentNote: (note: Note | null) => void) => {
  const navigate = useNavigate();

  // Stable handler functions to prevent unnecessary re-renders
  const handleCreateNote = () => {
    setCurrentNote(null);
    navigate('/app/editor');
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    navigate('/app/editor');
  };

  return {
    handleCreateNote,
    handleEditNote
  };
};
