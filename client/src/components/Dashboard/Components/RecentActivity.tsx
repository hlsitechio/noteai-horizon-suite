import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  FileText, 
  Edit3, 
  Trash2, 
  Share2, 
  Clock,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { format, formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function RecentActivity() {
  const { notes } = useOptimizedNotes();
  const navigate = useNavigate();

  // Generate recent activities from actual notes data
  const recentActivities = React.useMemo(() => {
    if (!notes.length) return [];

    return notes
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map((note) => ({
        id: note.id,
        type: 'edited',
        title: 'Updated note',
        description: note.title,
        time: formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true }),
        icon: Edit3,
        color: 'bg-blue-500'
      }));
  }, [notes]);

  // Add some created activities for new notes
  const createdActivities = React.useMemo(() => {
    if (!notes.length) return [];

    const recent = notes
      .filter(note => {
        const created = new Date(note.createdAt);
        const updated = new Date(note.updatedAt);
        return Math.abs(created.getTime() - updated.getTime()) < 60000; // Less than 1 minute difference
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2)
      .map((note) => ({
        id: `created-${note.id}`,
        type: 'created',
        title: 'Created new note',
        description: note.title,
        time: formatDistanceToNow(new Date(note.createdAt), { addSuffix: true }),
        icon: Plus,
        color: 'bg-green-500'
      }));

    return recent;
  }, [notes]);

  const allActivities = [...createdActivities, ...recentActivities]
    .sort((a, b) => {
      // Extract the actual date from the time string for proper sorting
      return b.id.localeCompare(a.id);
    })
    .slice(0, 5);
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {allActivities.length} items
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {allActivities.length > 0 ? (
            allActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full ${activity.color}`}>
                    <IconComponent className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-muted-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground">Start creating notes to see activity here</p>
            </div>
          )}
        </div>
        
        <div className="pt-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs text-muted-foreground"
            onClick={() => navigate('/app/activity')}
          >
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}