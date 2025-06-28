
import React from 'react';
import { Heart, Calendar, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';
import { Note, CategoryOption } from '../../types/note';
import NoteShareButton from '../../components/Sharing/NoteShareButton';

const categories: CategoryOption[] = [
  { value: 'all', label: 'All Categories', color: 'gray' },
  { value: 'general', label: 'General', color: 'gray' },
  { value: 'meeting', label: 'Meeting', color: 'blue' },
  { value: 'learning', label: 'Learning', color: 'green' },
  { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
  { value: 'project', label: 'Project', color: 'orange' },
];

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { setCurrentNote, deleteNote } = useNotes();
  const navigate = useNavigate();

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    navigate('/app/editor');
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow group"
      onClick={() => handleEditNote(note)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
            {note.title}
          </CardTitle>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {note.isFavorite && (
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            )}
            <NoteShareButton note={note} />
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 text-red-500 hover:bg-red-50"
              onClick={(e) => handleDeleteNote(note.id, e)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-3 h-3" />
          {formatDate(note.updatedAt)}
          <Badge variant="secondary" className="text-xs">
            {categories.find(c => c.value === note.category)?.label || note.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {note.content || 'No content yet...'}
        </p>
        {note.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{note.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteCard;
