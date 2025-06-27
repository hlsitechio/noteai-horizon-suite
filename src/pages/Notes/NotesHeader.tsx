
import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotes } from '../../contexts/NotesContext';
import { useNavigate } from 'react-router-dom';
import SyncStatusIndicator from '@/components/SyncStatusIndicator';

const NotesHeader: React.FC = () => {
  const { createNote, setCurrentNote, syncStatus } = useNotes();
  const navigate = useNavigate();

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: 'Untitled Note',
        content: '',
        category: 'general',
        tags: [],
        isFavorite: false,
        folder_id: null,
      });
      setCurrentNote(newNote);
      navigate('/app/editor');
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Your Notes
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Create, organize, and sync your notes
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <SyncStatusIndicator status={syncStatus} />
        <Button onClick={handleCreateNote} className="flex items-center gap-2" size="sm">
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>
    </div>
  );
};

export default NotesHeader;
