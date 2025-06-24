
import React from 'react';
import { Plus, BookOpen, BarChart3, Heart } from 'lucide-react';
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
      navigate('/notes');
    }
  };

  return (
    <Card className="w-full border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="p-6 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-900 dark:text-slate-100`}>
          Workflow Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className={`grid grid-cols-2 gap-4 w-full`}>
          <Button 
            onClick={onCreateNote}
            className={`flex-col gap-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 border-0 shadow-md hover:shadow-lg transition-all duration-200 w-full ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
          >
            <Plus className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            New Document
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/notes')}
            className={`flex-col gap-3 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 w-full ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
          >
            <BookOpen className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            Browse Library
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/chat')}
            className={`flex-col gap-3 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 w-full ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
          >
            <BarChart3 className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            AI Assistant
          </Button>
          <Button 
            variant="outline"
            onClick={handlePriorityItems}
            className={`flex-col gap-3 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 w-full ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
          >
            <Heart className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            Priority Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowActions;
