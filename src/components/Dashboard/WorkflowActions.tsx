
import React from 'react';
import { Plus, FileText, MessageSquare, Star, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="w-full border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl">
      <CardHeader className="p-6 pb-4 border-b border-border/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center border border-accent/10">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-foreground`}>
            Quick Actions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className={`grid grid-cols-2 gap-4 w-full`}>
          <Button 
            onClick={onCreateNote}
            className={`flex-col gap-3 bg-accent hover:bg-accent/90 text-accent-foreground border-0 shadow-premium hover:shadow-large transition-all duration-300 hover:-translate-y-1 hover:scale-105 w-full rounded-xl ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
          >
            <Plus className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            New Document
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/app/notes')}
            className={`flex-col gap-3 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
          >
            <FileText className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            Browse Library
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/app/chat')}
            className={`flex-col gap-3 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
          >
            <Brain className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            AI Assistant
          </Button>
          <Button 
            variant="outline"
            onClick={handlePriorityItems}
            className={`flex-col gap-3 border border-border/20 bg-card/50 hover:bg-card/80 text-foreground hover:text-foreground w-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
          >
            <Star className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            Priority Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowActions;
