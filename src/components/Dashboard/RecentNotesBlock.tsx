
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Edit, Star } from 'lucide-react';
import { Note } from '../../types/note';
import { useIsMobile } from '../../hooks/use-mobile';

interface RecentNotesBlockProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
}

const RecentNotesBlock: React.FC<RecentNotesBlockProps> = ({
  notes,
  onEditNote,
}) => {
  const isMobile = useIsMobile();

  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <Card className="h-full border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-500" />
          Recent Notes
          {recentNotes.length > 0 && (
            <Badge variant="secondary" className="ml-auto">{recentNotes.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {recentNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Edit className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No recent notes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-lg bg-background/50 hover:bg-background/80 cursor-pointer transition-colors border border-border/50 hover:shadow-sm"
                onClick={() => onEditNote(note)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium line-clamp-2 flex-1 leading-tight">
                    {note.title || 'Untitled'}
                  </h4>
                  {note.isFavorite && (
                    <Star className="w-3 h-3 text-yellow-500 fill-current ml-2 flex-shrink-0" />
                  )}
                </div>
                
                {note.content && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                    {note.content.substring(0, 100)}...
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {note.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentNotesBlock;
