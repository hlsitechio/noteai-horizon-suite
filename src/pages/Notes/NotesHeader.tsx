import React from 'react';
import { Plus, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOptimizedNotes } from '../../contexts/OptimizedNotesContext';
import { useNavigate } from 'react-router-dom';
import SyncStatusIndicator from '@/components/SyncStatusIndicator';

const NotesHeader: React.FC = () => {
  const { createNote, setCurrentNote, syncStatus, notes, filteredNotes } = useOptimizedNotes();
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Your Notes
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, organize, and sync your notes
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Badge variant="secondary" className="text-sm">
            {filteredNotes.length} notes found
          </Badge>
        </div>
        <SyncStatusIndicator status={syncStatus} />
        <Button onClick={handleCreateNote} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>
    </div>
  );
};

export default NotesHeader;