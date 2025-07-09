import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Folder, 
  Star, 
  Clock, 
  TrendingUp,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useFolders } from '@/contexts/FoldersContext';
import { format } from 'date-fns';

export function NotesSummary() {
  const { notes } = useOptimizedNotes();
  const { folders } = useFolders();

  // Calculate real stats from data
  const favoriteNotes = notes.filter(note => note.isFavorite);
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  // Calculate today's word count (mock for now, would need word count data)
  const wordsToday = 850; // This would come from actual writing analytics
  const wordGoal = 1500;
  const progressPercentage = (wordsToday / wordGoal) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Notes Summary</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Search className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Filter className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Total Notes</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {notes.length}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Folder className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Folders</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {folders.length}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Favorites</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {favoriteNotes.length}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Recent</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {recentNotes.length}
            </span>
          </div>
        </div>

        {/* Writing Progress */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Daily Writing Goal</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">
                {wordsToday}/{wordGoal} words
              </span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <span className="text-xs text-muted-foreground">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>

        {/* Recent Notes */}
        <div className="space-y-2 pt-2 border-t">
          <span className="text-xs font-medium text-muted-foreground">Recent Notes</span>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div key={note.id} className="flex items-start justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {note.title}
                      </span>
                      {note.isFavorite && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {note.tags?.[0] || 'General'}
                      </Badge>
                      <span>•</span>
                      <span>{format(new Date(note.updatedAt), 'MMM d')}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center p-4">No notes yet</p>
            )}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            View All Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}