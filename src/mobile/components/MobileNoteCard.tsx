
import React from 'react';
import { Calendar, Heart, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';
import { Note } from '../../types/note';

interface MobileNoteCardProps {
  note: Note;
}

const MobileNoteCard: React.FC<MobileNoteCardProps> = ({ note }) => {
  const { setCurrentNote } = useNotes();
  const navigate = useNavigate();

  const handleEditNote = () => {
    setCurrentNote(note);
    navigate('/mobile/editor');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card 
      className="cursor-pointer active:scale-[0.98] transition-transform"
      onClick={handleEditNote}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base line-clamp-1 flex-1 pr-2">
            {note.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {note.isFavorite && (
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            )}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {note.content || 'No content yet...'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDate(note.updatedAt)}
            <Badge variant="secondary" className="text-xs">
              {note.category}
            </Badge>
          </div>
          
          {note.tags.length > 0 && (
            <div className="flex gap-1">
              {note.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {note.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{note.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileNoteCard;
