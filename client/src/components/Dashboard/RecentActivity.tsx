
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
  const formatDate = (dateString: string) => {
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

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <Button onClick={onCreateNote} size="sm" className="gap-2">
          <i className="bx bx-plus text-sm"></i>
          New Note
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="bx bx-edit text-2xl"></i>
            </div>
            <p className="text-lg mb-2">No notes yet</p>
            <p className="text-sm mb-4">Create your first note to get started</p>
            <Button onClick={onCreateNote} className="gap-2">
              <i className="bx bx-plus text-sm"></i>
              Create Note
            </Button>
          </div>
        ) : (
          recentNotes.map((note) => (
            <div
              key={note.id}
              className="border-2 border-accent rounded-lg p-4 hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 
                  className="font-medium text-foreground cursor-pointer hover:text-accent transition-colors"
                  onClick={() => onEditNote(note)}
                >
                  {note.title || 'Untitled Note'}
                </h3>
                <div className="flex items-center gap-2">
                  <DesktopPopOutButton note={note} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditNote(note)}
                    className="h-8 w-8 p-0 hover:bg-accent/10 hover:text-accent"
                  >
                    <i className="bx bx-edit text-sm"></i>
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {truncateContent(note.content)}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {note.category}
                  </Badge>
                  {note.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <i className="bx bx-tag text-xs text-muted-foreground"></i>
                      <span className="text-xs text-muted-foreground">
                        {note.tags.slice(0, 2).join(', ')}
                        {note.tags.length > 2 && ` +${note.tags.length - 2}`}
                      </span>
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
