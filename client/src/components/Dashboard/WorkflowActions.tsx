
import React from 'react';
import { Plus, FileText, MessageSquare, Star, Brain, Sparkles, Clock, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';
import { Note } from '../../types/note';

interface WorkflowActionsProps {
  notes: Note[];
  onCreateNote: () => void;
  onEditNote: (note: Note) => void;
}

const WorkflowActions: React.FC<WorkflowActionsProps> = ({ 
  notes, 
  onCreateNote, 
  onEditNote 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handlePriorityItems = () => {
    const favoriteNotes = notes.filter(note => note.isFavorite);
    if (favoriteNotes.length > 0) {
      onEditNote(favoriteNotes[0]);
    } else {
      navigate('/app/explorer');
    }
  };

  // Calculate dynamic stats for quick access
  const recentlyModified = notes
    .filter(note => {
      const hourAgo = new Date();
      hourAgo.setHours(hourAgo.getHours() - 24);
      return note.updatedAt && new Date(note.updatedAt) > hourAgo;
    })
    .slice(0, 3);

  const topCategories = Object.entries(
    notes.reduce((acc, note) => {
      acc[note.category] = (acc[note.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <Card className="w-full h-full border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl flex flex-col min-h-0">
      <CardHeader className="p-4 pb-3 border-b border-border/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center border border-accent/10">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">
            Quick Actions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col min-h-0 space-y-4 overflow-y-auto">
        {/* Primary Actions - Optimized for 1080p height */}
        <div className="grid grid-cols-1 gap-3">
          <Button 
            onClick={onCreateNote}
            className="flex items-center gap-3 justify-start bg-accent hover:bg-accent/90 text-accent-foreground border-0 shadow-premium hover:shadow-large transition-all duration-300 hover:-translate-y-1 hover:scale-105 w-full rounded-xl h-14 text-base px-4 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>New Document</span>
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={() => navigate('/app/explorer')}
              className="flex-col gap-2 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent/30 h-20 text-sm"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Library</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/app/chat')}
              className="flex-col gap-2 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent/30 h-20 text-sm"
            >
              <Brain className="w-5 h-5" />
              <span className="font-medium">AI Chat</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity Section - Optimized spacing */}
        {recentlyModified.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold text-foreground">Recent</h4>
            </div>
            <div className="space-y-2">
              {recentlyModified.map((note) => (
                <button
                  key={note.id}
                  onClick={() => onEditNote(note)}
                  className="w-full text-left p-3 rounded-lg hover:bg-accent/10 transition-colors duration-200 border border-transparent hover:border-accent/20"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground truncate font-medium">
                      {note.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories Section - Optimized spacing */}
        {topCategories.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold text-foreground">Top Categories</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {topCategories.map(([category, count]) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="text-xs bg-accent/10 text-accent border-accent/20 cursor-pointer hover:bg-accent/20 transition-colors px-3 py-1"
                  onClick={() => navigate(`/app/explorer?category=${category}`)}
                >
                  {category} ({count})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Priority Items - Positioned at bottom */}
        <div className="mt-auto pt-4">
          <Button 
            variant="outline"
            onClick={handlePriorityItems}
            className="flex items-center gap-3 justify-start border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent/30 h-12 text-sm"
          >
            <Star className="w-4 h-4" />
            <span className="font-medium">Priority Items</span>
            {notes.filter(note => note.isFavorite).length > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {notes.filter(note => note.isFavorite).length}
              </Badge>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowActions;
