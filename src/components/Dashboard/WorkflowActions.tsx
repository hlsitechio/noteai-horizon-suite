
import React from 'react';
import { Plus, FileText, MessageSquare, Star, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      navigate('/app/notes');
    }
  };

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
      <CardContent className="p-4 flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-2 gap-2 h-full">
          <Button 
            onClick={onCreateNote}
            className="flex-col gap-2 bg-accent hover:bg-accent/90 text-accent-foreground border-0 shadow-premium hover:shadow-large transition-all duration-300 hover:-translate-y-1 hover:scale-105 w-full rounded-xl h-full text-xs min-h-0"
          >
            <Plus className="w-5 h-5" />
            New Document
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/app/notes')}
            className="flex-col gap-2 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent/30 h-full text-xs min-h-0"
          >
            <FileText className="w-5 h-5" />
            Browse Library
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/app/chat')}
            className="flex-col gap-2 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent/30 h-full text-xs min-h-0"
          >
            <Brain className="w-5 h-5" />
            AI Assistant
          </Button>
          <Button 
            variant="outline"
            onClick={handlePriorityItems}
            className="flex-col gap-2 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent/30 h-full text-xs min-h-0"
          >
            <Star className="w-5 h-5" />
            Priority Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowActions;
