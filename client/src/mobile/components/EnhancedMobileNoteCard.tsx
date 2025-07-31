
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Tag, MessageSquare, Folder } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNotes } from '../../contexts/NotesContext';
import { useFolders } from '../../contexts/FoldersContext';
import { Note } from '../../types/note';

interface EnhancedMobileNoteCardProps {
  note: Note;
  showAvatar?: boolean;
  compact?: boolean;
}

const EnhancedMobileNoteCard: React.FC<EnhancedMobileNoteCardProps> = ({ 
  note, 
  showAvatar = true,
  compact = false 
}) => {
  const navigate = useNavigate();
  const { setCurrentNote } = useNotes();
  const { folders } = useFolders();

  const handleNoteClick = () => {
    setCurrentNote(note);
    navigate(`/mobile/editor?note=${note.id}`);
  };

  const formatDate = (date: string) => {
    const noteDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - noteDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return noteDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: noteDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getPreviewText = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/[#*_`]/g, '');
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-700',
      work: 'bg-blue-100 text-blue-700',
      personal: 'bg-green-100 text-green-700',
      ideas: 'bg-purple-100 text-purple-700',
      meeting: 'bg-orange-100 text-orange-700',
      learning: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || colors.general;
  };

  const getFolder = () => {
    return folders.find(f => f.id === note.folder_id);
  };

  const folder = getFolder();

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-l-4 ${
        note.isFavorite ? 'border-l-yellow-400' : 'border-l-primary/20'
      } ${compact ? 'mb-2' : 'mb-3'}`}
      onClick={handleNoteClick}
    >
      <CardContent className={`${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-start space-x-3">
          {/* Avatar/Icon */}
          {showAvatar && (
            <div className="flex-shrink-0 mt-1">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={`text-sm font-medium ${getCategoryColor(note.category)}`}>
                  {note.category === 'meeting' ? (
                    <MessageSquare className="h-4 w-4" />
                  ) : (
                    note.title.charAt(0).toUpperCase()
                  )}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold line-clamp-1 ${compact ? 'text-sm' : 'text-base'} text-foreground`}>
                  {note.title || 'Untitled'}
                </h3>
                
                {/* Metadata */}
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatDate(note.updatedAt || new Date().toISOString())}</span>
                  </div>
                  
                  {folder && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Folder className="w-3 h-3 mr-1" />
                      <span>{folder.name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status Icons */}
              <div className="flex items-center space-x-1 ml-2">
                {note.isFavorite && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
            </div>
            
            {/* Preview Text */}
            {note.content && !compact && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                {getPreviewText(note.content)}
              </p>
            )}
            
            {/* Tags and Category */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 py-1 ${getCategoryColor(note.category)}`}
                >
                  {note.category}
                </Badge>
                
                {note.tags.length > 0 && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Tag className="w-3 h-3 mr-1" />
                    <span>{note.tags.length}</span>
                  </div>
                )}
              </div>
              
              {/* Read indicator */}
              <div className="w-2 h-2 rounded-full bg-primary/20"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMobileNoteCard;
