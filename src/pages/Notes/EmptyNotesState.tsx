
import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useOptimizedNotes } from '../../contexts/OptimizedNotesContext';

interface EmptyNotesStateProps {
  hasFilters: boolean;
}

const EmptyNotesState: React.FC<EmptyNotesStateProps> = ({ hasFilters }) => {
  const navigate = useNavigate();
  const { setCurrentNote, createNote, setFilters } = useOptimizedNotes();

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: 'My First Note',
        content: '<p>Start writing your thoughts here...</p>',
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

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      isFavorite: false
    });
  };

  if (hasFilters) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No notes match your filters
          </h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search criteria or clear the filters to see all notes.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="text-center py-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <BookOpen className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Welcome to Your Notes
        </h3>
        <p className="text-muted-foreground mb-8">
          Start organizing your thoughts, ideas, and important information in one place.
        </p>

        <Button onClick={handleCreateNote} className="w-full" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Note
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyNotesState;
