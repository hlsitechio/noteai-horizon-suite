
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotes } from '../../contexts/NotesContext';
import { Note } from '../../types/note';

interface MobileNoteCardProps {
  note: Note;
}

const MobileNoteCard: React.FC<MobileNoteCardProps> = ({ note }) => {
  const navigate = useNavigate();
  const { setCurrentNote } = useNotes();

  const handleNoteClick = () => {
    setCurrentNote(note);
    navigate(`/mobile/editor?note=${note.id}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPreviewText = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleNoteClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-base line-clamp-2 flex-1 mr-2">
            {note.title || 'Untitled'}
          </h3>
          {note.isFavorite && (
            <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
          )}
        </div>
        
        {note.content && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {getPreviewText(note.content)}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(note.updatedAt)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {note.category && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {note.category}
              </Badge>
            )}
            {note.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>{note.tags.length}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileNoteCard;
