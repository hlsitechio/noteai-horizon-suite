
import React from 'react';
import { FileText, Clock, Tag, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotes } from '../../contexts/NotesContext';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Note } from '../../types/note';
import { formatDistanceToNow } from 'date-fns';

interface NotesGridProps {
  notes: Note[];
  hasFilters: boolean;
}

const NotesGrid: React.FC<NotesGridProps> = ({ notes, hasFilters }) => {
  const { setCurrentNote, toggleFavorite, deleteNote } = useNotes();
  const { confirmDelete, ConfirmDialog } = useConfirmDialog();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedNoteId = searchParams.get('note');

  const handleNoteClick = (note: Note) => {
    setCurrentNote(note);
    navigate(`/app/notes?note=${note.id}`);
  };

  const handleEditNote = (note: Note, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentNote(note);
    navigate('/app/editor');
  };

  const handleToggleFavorite = async (noteId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await toggleFavorite(noteId);
  };

  const handleDeleteNote = async (noteId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const note = notes.find(n => n.id === noteId);
    const confirmed = await confirmDelete(note?.title || 'this note');
    if (confirmed) {
      await deleteNote(noteId);
    }
  };

  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {hasFilters ? 'No notes match your filters' : 'No notes yet'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {hasFilters 
            ? 'Try adjusting your search or filter criteria.'
            : 'Get started by creating your first note.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <Card 
          key={note.id} 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group ${
            selectedNoteId === note.id ? 'ring-2 ring-primary bg-accent/50' : ''
          }`}
          onClick={() => handleNoteClick(note)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                  {note.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(note.updatedAt)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                  note.isFavorite ? 'opacity-100 text-yellow-500' : ''
                }`}
                onClick={(e) => handleToggleFavorite(note.id, e)}
              >
                <Star className={`h-4 w-4 ${note.isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {note.content && (
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                {truncateContent(note.content.replace(/<[^>]*>/g, ''))}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {note.category}
                </Badge>
                {note.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {note.tags.length}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleEditNote(note, e)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  title="Delete note"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <ConfirmDialog />
    </div>
  );
};

export default NotesGrid;
