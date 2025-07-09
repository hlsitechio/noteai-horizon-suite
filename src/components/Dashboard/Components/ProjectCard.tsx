import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

interface ProjectCardProps {
  variant?: 'active' | 'completed' | 'overdue';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ variant = 'active' }) => {
  const projectData = {
    active: {
      name: 'Dashboard Redesign',
      status: 'In Progress',
      progress: 65,
      priority: 'High',
      dueDate: 'Dec 15, 2024',
      team: ['AB', 'CD', 'EF'],
      tasks: { completed: 13, total: 20 },
      statusColor: 'bg-blue-500',
      priorityColor: 'destructive'
    },
    completed: {
      name: 'User Authentication',
      status: 'Completed',
      progress: 100,
      priority: 'Medium',
      dueDate: 'Nov 30, 2024',
      team: ['GH', 'IJ'],
      tasks: { completed: 15, total: 15 },
      statusColor: 'bg-emerald-500',
      priorityColor: 'secondary'
    },
    overdue: {
      name: 'API Integration',
      status: 'Overdue',
      progress: 85,
      priority: 'High',
      dueDate: 'Dec 1, 2024',
      team: ['KL', 'MN', 'OP', 'QR'],
      tasks: { completed: 17, total: 22 },
      statusColor: 'bg-red-500',
      priorityColor: 'destructive'
    }
  };

  const data = projectData[variant];
  
  const getStatusIcon = () => {
    switch (variant) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{data.name}</CardTitle>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm text-muted-foreground">{data.status}</span>
              <Badge variant={data.priorityColor as any} className="text-xs">
                {data.priority}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{data.progress}%</span>
          </div>
          <Progress value={data.progress} className="h-2" />
        </div>

        {/* Tasks */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <span>{data.tasks.completed}/{data.tasks.total} tasks</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{data.dueDate}</span>
          </div>
        </div>

        {/* Team */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Team ({data.team.length})</span>
          </div>
          <div className="flex items-center space-x-1">
            {data.team.slice(0, 3).map((member, index) => (
              <Avatar key={index} className="h-6 w-6">
                <AvatarFallback className="text-xs">{member}</AvatarFallback>
              </Avatar>
            ))}
            {data.team.length > 3 && (
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs text-muted-foreground">
                +{data.team.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};