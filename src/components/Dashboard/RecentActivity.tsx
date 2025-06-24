
import React from 'react';
import { Plus, BookOpen, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  updatedAt: Date;
}

interface RecentActivityProps {
  recentNotes: Note[];
  onCreateNote: () => void;
  onEditNote: (note: Note) => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  recentNotes, 
  onCreateNote, 
  onEditNote 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

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
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex-1 flex flex-col`}>
        {recentNotes.length === 0 ? (
          <div className={`text-center flex-1 flex flex-col justify-center ${isMobile ? 'py-6' : 'py-8'}`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mx-auto mb-4 border border-accent/10">
              <BookOpen className={`text-accent ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`} />
            </div>
            <h3 className={`font-bold text-foreground mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>No documents yet</h3>
            <p className={`text-muted-foreground mb-6 max-w-sm mx-auto ${isMobile ? 'text-sm' : ''}`}>
              Start building your knowledge base by creating your first document.
            </p>
            <Button onClick={onCreateNote} size={isMobile ? "sm" : "default"} className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-premium hover:shadow-large transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Create Document
            </Button>
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className={`group flex items-start gap-4 p-4 rounded-xl hover:bg-card/80 cursor-pointer transition-all duration-200 border border-border/10 hover:border-accent/20 hover:shadow-premium ${
                  isMobile ? '' : ''
                }`}
                onClick={() => onEditNote(note)}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center flex-shrink-0 border border-accent/10">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={`font-semibold text-foreground truncate group-hover:text-accent ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {note.title}
                    </h4>
                    {note.isFavorite && (
                      <Heart className="w-4 h-4 text-rose-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <p className={`text-muted-foreground line-clamp-2 mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {note.content || 'No content available...'}
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
            ))}
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-muted-foreground hover:text-accent hover:bg-accent/10 border border-border/10 hover:border-accent/20" 
              size={isMobile ? "sm" : "default"}
              onClick={() => navigate('/app/notes')}
            >
              View All Documents →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
