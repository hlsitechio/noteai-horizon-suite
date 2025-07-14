import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckSquare, 
  Plus, 
  AlertCircle,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
};

const formatDueDate = (dateString: string) => {
  const date = new Date(dateString);
  
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  
  return format(date, 'MMM d');
};

export function TaskList() {
  const { tasks, loading, toggleTaskCompletion } = useTasks();
  const navigate = useNavigate();
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasksList = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Task List</CardTitle>
            <Skeleton className="h-6 w-12" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Task List</CardTitle>
          <div className="flex items-center space-x-1">
            <Badge variant="secondary" className="text-xs">
              {completedTasks}/{totalTasks}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => navigate('/app/calendar?createTask=true')}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Progress</span>
            <span className="text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Task List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {/* Incomplete Tasks */}
          {incompleteTasks.length > 0 && (
            <div className="space-y-2">
              {incompleteTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/30">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {task.title}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`} />
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDueDate(task.due_date)}</span>
                      </div>
                      {isToday(new Date(task.due_date)) && !task.completed && (
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Tasks (collapsible) */}
          {completedTasksList.length > 0 && (
            <div className="pt-2 border-t space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Completed ({completedTasksList.length})
                </span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
              {completedTasksList.slice(0, 2).map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/30 opacity-60">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-sm font-medium line-through text-muted-foreground">
                      {task.title}
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs opacity-60">
                        {task.category}
                      </Badge>
                      <span>{formatDueDate(task.due_date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs text-muted-foreground"
            onClick={() => navigate('/app/calendar?createTask=true')}
          >
            <CheckSquare className="h-3 w-3 mr-1" />
            Add New Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}