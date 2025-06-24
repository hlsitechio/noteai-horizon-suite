
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
    <Card className="w-full border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="p-6 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <CardTitle className={`flex items-center gap-3 ${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-900 dark:text-slate-100`}>
          <Clock className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {recentNotes.length === 0 ? (
          <div className={`text-center ${isMobile ? 'py-8' : 'py-12'}`}>
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <BookOpen className={`text-slate-400 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No documents yet</h3>
            <p className={`text-slate-500 mb-6 max-w-sm mx-auto ${isMobile ? 'text-sm' : ''}`}>
              Start building your knowledge base by creating your first document.
            </p>
            <Button onClick={onCreateNote} size={isMobile ? "sm" : "default"} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900">
              <Plus className="w-4 h-4 mr-2" />
              Create Document
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className={`group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 ${
                  isMobile ? '' : ''
                }`}
                onClick={() => onEditNote(note)}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={`font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-slate-700 dark:group-hover:text-slate-300 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {note.title}
                    </h4>
                    {note.isFavorite && (
                      <Heart className="w-4 h-4 text-rose-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <p className={`text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {note.content || 'No content available...'}
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0">
                      {note.category}
                    </Badge>
                    <span className="text-slate-400 text-xs font-medium">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" 
              size={isMobile ? "sm" : "default"}
              onClick={() => navigate('/notes')}
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
