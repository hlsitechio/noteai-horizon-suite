
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
    <Card className="w-full h-full border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl flex flex-col">
      <CardHeader className={`${isMobile ? 'p-4 pb-3' : 'p-6 pb-4'} border-b border-border/10 flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center border border-accent/10">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-foreground`}>
            Quick Actions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex-1 flex flex-col`}>
        <div className={`grid grid-cols-2 gap-4 w-full`}>
          <Button 
            onClick={onCreateNote}
            className={`flex-col gap-3 bg-accent hover:bg-accent/90 text-accent-foreground border-0 shadow-premium hover:shadow-large transition-all duration-300 hover:-translate-y-1 hover:scale-105 w-full rounded-xl ${isMobile ? 'h-24 text-xs' : 'h-28 text-sm'}`}
          >
            <Plus className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
            New Document
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/app/notes')}
            className={`flex-col gap-3 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent/30 ${isMobile ? 'h-24 text-xs' : 'h-28 text-sm'}`}
          >
            <FileText className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
            Browse Library
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/app/chat')}
            className={`flex-col gap-3 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent/30 ${isMobile ? 'h-24 text-xs' : 'h-28 text-sm'}`}
          >
            <Brain className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
            AI Assistant
          </Button>
          <Button 
            variant="outline"
            onClick={handlePriorityItems}
            className={`flex-col gap-3 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent/30 ${isMobile ? 'h-24 text-xs' : 'h-28 text-sm'}`}
          >
            <Star className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
            Priority Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowActions;
