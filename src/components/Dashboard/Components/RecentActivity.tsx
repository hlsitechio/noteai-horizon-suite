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
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const activities = [
  {
    id: '1',
    type: 'created',
    title: 'Created new note',
    description: 'Project Planning Document',
    time: '2 minutes ago',
    icon: FileText,
    color: 'bg-green-500'
  },
  {
    id: '2',
    type: 'edited',
    title: 'Edited document',
    description: 'Meeting Notes - Q4 Review',
    time: '15 minutes ago',
    icon: Edit3,
    color: 'bg-blue-500'
  },
  {
    id: '3',
    type: 'shared',
    title: 'Shared with team',
    description: 'Weekly Report Template',
    time: '1 hour ago',
    icon: Share2,
    color: 'bg-purple-500'
  },
  {
    id: '4',
    type: 'deleted',
    title: 'Moved to trash',
    description: 'Draft Ideas Collection',
    time: '3 hours ago',
    icon: Trash2,
    color: 'bg-red-500'
  },
  {
    id: '5',
    type: 'created',
    title: 'Created new folder',
    description: 'Client Projects 2024',
    time: '1 day ago',
    icon: FileText,
    color: 'bg-green-500'
  }
];

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {activities.length} items
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activities.map((activity) => {
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
          })}
        </div>
        
        <div className="pt-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}