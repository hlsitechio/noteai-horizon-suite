import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Note } from '../../types/note';
import DesktopPopOutButton from '../FloatingNotes/DesktopPopOutButton';
import 'boxicons/css/boxicons.min.css';

interface RecentActivityProps {
  recentNotes: Note[];
  onCreateNote: () => void;
  onEditNote: (note: Note) => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  recentNotes,
  onCreateNote,
  onEditNote,
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const truncateContent = (content: string | null, maxLength: number = 150) => {
    if (!content) return 'No content available';
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Recent Activity
        </CardTitle>
        <i className="bx bx-external-link text-muted-foreground hover:text-foreground cursor-pointer text-sm"></i>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] overflow-y-auto">
        {recentNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <div className="text-4xl text-muted-foreground/30">
              <i className="bx bx-note"></i>
            </div>
            <p className="text-sm text-muted-foreground text-center">No recent notes found</p>
            <Button 
              onClick={onCreateNote}
              size="sm" 
              className="mt-2"
            >
              <i className="bx bx-plus mr-2"></i>
              Create Note
            </Button>
          </div>
        ) : (
          recentNotes.slice(0, 5).map((note) => (
            <div 
              key={note.id} 
              className="p-3 mb-3 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => onEditNote(note)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">
                    {note.title || 'Untitled Note'}
                  </h4>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {truncateContent(note.content)}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {note.category || 'General'}
                  </Badge>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1">
                      {note.tags.slice(0, 2).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{note.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <i className="bx bx-time text-xs"></i>
                  {formatDate(note.updatedAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;