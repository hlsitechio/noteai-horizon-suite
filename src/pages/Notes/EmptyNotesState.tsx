
import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';

interface EmptyNotesStateProps {
  hasFilters: boolean;
}

const EmptyNotesState: React.FC<EmptyNotesStateProps> = ({ hasFilters }) => {
  const navigate = useNavigate();
  const { setCurrentNote } = useNotes();

  const handleCreateNote = () => {
    setCurrentNote(null);
    navigate('/app/editor');
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-8 text-center">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          {hasFilters ? 'No notes match your filters' : 'No notes yet'}
        </h3>
        <p className="text-gray-500 mb-4">
          {hasFilters
            ? 'Try adjusting your search or filters'
            : 'Create your first note to get started'
          }
        </p>
        <Button onClick={handleCreateNote} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Note
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyNotesState;
