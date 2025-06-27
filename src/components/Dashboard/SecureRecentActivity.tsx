
import React from 'react';
import { Plus, BookOpen, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';
import { Note } from '../../types/note';
import { secureLog } from '../../utils/securityUtils';

interface SecureRecentActivityProps {
  recentNotes: Note[];
  onCreateNote: () => void;
  onEditNote: (note: Note) => void;
}

const SecureRecentActivity: React.FC<SecureRecentActivityProps> = ({ 
  recentNotes, 
  onCreateNote, 
  onEditNote 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  // Function to extract and clean content preview
  const getContentPreview = (content: string, title: string): string => {
    if (!content || content.trim() === '') {
      // If title is generic, show helpful message
      if (title.toLowerCase().includes('untitled') || title.toLowerCase().includes('new note')) {
        return 'Click to add content to this note';
      }
      return 'Empty note - click to start writing';
    }
    
    try {
      // Try to parse as JSON (Slate.js format)
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        const extractedText = parsed
          .map((node: any) => {
            if (node.children && Array.isArray(node.children)) {
              return node.children
                .map((child: any) => child.text || '')
                .join('')
                .trim();
            }
            return '';
          })
          .filter(text => text.length > 0)
          .join(' ');
        
        if (!extractedText) {
          return 'Empty note - click to start writing';
        }
        
        return extractedText.length > 120 
          ? extractedText.substring(0, 120) + '...'
          : extractedText;
      }
    } catch (error) {
      // If it's not JSON, treat as plain text
      const plainText = content.trim();
      if (!plainText) {
        return 'Empty note - click to start writing';
      }
      return plainText.length > 120 
        ? plainText.substring(0, 120) + '...'
        : plainText;
    }
    
    return 'Empty note - click to start writing';
  };

  // Get a meaningful title
  const getDisplayTitle = (note: Note): string => {
    if (!note.title || note.title.trim() === '') {
      return 'Untitled Note';
    }
    
    // If it's a generic title and we have content, try to use first line of content
    if ((note.title.toLowerCase().includes('untitled') || note.title.toLowerCase().includes('new note')) && note.content) {
      try {
        const parsed = JSON.parse(note.content);
        if (Array.isArray(parsed) && parsed[0]?.children?.[0]?.text) {
          const firstLine = parsed[0].children[0].text.trim();
          if (firstLine && firstLine.length > 0) {
            return firstLine.length > 40 ? firstLine.substring(0, 40) + '...' : firstLine;
          }
        }
      } catch (error) {
        // Use plain text first line
        const firstLine = note.content.split('\n')[0].trim();
        if (firstLine && firstLine.length > 0) {
          return firstLine.length > 40 ? firstLine.substring(0, 40) + '...' : firstLine;
        }
      }
    }
    
    return note.title;
  };

  const handleNoteClick = (note: Note) => {
    secureLog.info('Note clicked', { noteId: note.id, titleLength: note.title.length });
    onEditNote(note);
  };

  const handleCreateNote = () => {
    secureLog.info('Create note clicked');
    onCreateNote();
  };

  const handleViewAllNotes = () => {
    secureLog.info('View all notes clicked');
    navigate('/app/notes');
  };

  // Filter out notes that are truly empty or have no useful content
  const meaningfulNotes = recentNotes.filter(note => {
    const preview = getContentPreview(note.content, note.title);
    const title = getDisplayTitle(note);
    
    // Show note if it has meaningful title or content
    return title !== 'Untitled Note' || !preview.includes('Empty note') || note.isFavorite;
  });

  return (
    <Card className="w-full h-full border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl flex flex-col">
      <CardHeader className={`${isMobile ? 'p-4 pb-3' : 'p-6 pb-4'} border-b border-border/10 flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center border border-accent/10">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-foreground`}>
            Recent Activity
          </CardTitle>
          {meaningfulNotes.length > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {meaningfulNotes.length} active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex-1 flex flex-col`}>
        {meaningfulNotes.length === 0 ? (
          <div className={`text-center flex-1 flex flex-col justify-center ${isMobile ? 'py-6' : 'py-8'}`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mx-auto mb-4 border border-accent/10">
              <BookOpen className={`text-accent ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`} />
            </div>
            <h3 className={`font-bold text-foreground mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
              Ready to start writing?
            </h3>
            <p className={`text-muted-foreground mb-6 max-w-sm mx-auto ${isMobile ? 'text-sm' : ''}`}>
              Create your first meaningful note and it will appear here.
            </p>
            <Button onClick={handleCreateNote} size={isMobile ? "sm" : "default"} className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-premium hover:shadow-large transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Create First Note
            </Button>
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {meaningfulNotes.slice(0, 5).map((note) => {
              const displayTitle = getDisplayTitle(note);
              const contentPreview = getContentPreview(note.content, note.title);
              const isEmpty = contentPreview.includes('Empty note') || contentPreview.includes('Click to add content');
              
              return (
                <div
                  key={note.id}
                  className={`group flex items-start gap-4 p-4 rounded-xl hover:bg-card/80 cursor-pointer transition-all duration-200 border border-border/10 hover:border-accent/20 hover:shadow-premium ${
                    isEmpty ? 'opacity-75' : ''
                  }`}
                  onClick={() => handleNoteClick(note)}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 border ${
                    isEmpty 
                      ? 'from-muted/20 to-muted/10 border-muted/20' 
                      : 'from-accent/10 to-accent/5 border-accent/10'
                  }`}>
                    <BookOpen className={`w-5 h-5 ${isEmpty ? 'text-muted-foreground' : 'text-accent'}`} />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-semibold truncate group-hover:text-accent ${
                        isEmpty ? 'text-muted-foreground' : 'text-foreground'
                      } ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {displayTitle}
                      </h4>
                      {note.isFavorite && (
                        <Heart className="w-4 h-4 text-rose-500 fill-current flex-shrink-0" />
                      )}
                      {isEmpty && (
                        <Badge variant="outline" className="text-2xs">Draft</Badge>
                      )}
                    </div>
                    <p className={`line-clamp-2 mb-3 ${
                      isEmpty 
                        ? 'text-muted-foreground/70 italic' 
                        : 'text-muted-foreground'
                    } ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {contentPreview}
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
                        {note.category}
                      </Badge>
                      <span className="text-muted-foreground text-xs font-medium">
                        {formatDate(note.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {recentNotes.length > meaningfulNotes.length && (
              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground">
                  {recentNotes.length - meaningfulNotes.length} empty notes hidden
                </p>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-muted-foreground hover:text-accent hover:bg-accent/10 border border-border/10 hover:border-accent/20" 
              size={isMobile ? "sm" : "default"}
              onClick={handleViewAllNotes}
            >
              View All Documents →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecureRecentActivity;
