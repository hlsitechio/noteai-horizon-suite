
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Star, 
  BarChart3,
  Zap,
  Clock
} from 'lucide-react';
import { Note } from '../../types/note';

interface WorkflowActionsProps {
  notes: Note[];
  onCreateNote: () => void;
  onEditNote: (note: Note) => void;
}

const WorkflowActions: React.FC<WorkflowActionsProps> = ({
  notes,
  onCreateNote,
  onEditNote,
}) => {
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const favoriteNotes = notes.filter(note => note.isFavorite).slice(0, 2);
  
  const quickActions = [
    {
      icon: Plus,
      label: 'New Note',
      action: onCreateNote,
      color: 'bg-blue-500 hover:bg-blue-600',
      primary: true
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      action: () => window.location.href = '/app/analytics',
      color: 'bg-purple-500 hover:bg-purple-600',
      primary: false
    }
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                onClick={action.action}
                className={`w-full justify-start gap-3 h-12 ${action.color} text-white border-0 shadow-sm`}
                size="lg"
              >
                <Icon className="w-5 h-5" />
                {action.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Notes */}
      <Card className="flex-1 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            Recent
            {recentNotes.length > 0 && (
              <Badge variant="secondary" className="ml-auto">{recentNotes.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 flex-1">
          {recentNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Edit className="w-8 h-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notes yet</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCreateNote}
                className="mt-2 text-blue-500 hover:text-blue-600"
              >
                Create your first note
              </Button>
            </div>
          ) : (
            recentNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-lg bg-background/50 hover:bg-background/80 cursor-pointer transition-colors border border-border/50"
                onClick={() => onEditNote(note)}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium truncate flex-1">
                    {note.title || 'Untitled'}
                  </h4>
                  {note.isFavorite && (
                    <Star className="w-3 h-3 text-yellow-500 fill-current ml-2" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {note.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowActions;
