
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';

const NotesHeader: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentNote } = useNotes();

  const handleNewNote = () => {
    setCurrentNote(null);
    navigate('/app/editor');
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
        <p className="text-gray-600">Organize and search through your notes</p>
      </div>
      <Button onClick={handleNewNote}>
        <Plus className="w-4 h-4 mr-2" />
        New Note
      </Button>
    </div>
  );
};

export default NotesHeader;
