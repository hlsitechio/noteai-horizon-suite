import React from 'react';
import { KanbanTask } from '@/types/kanban';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailDialogProps {
  task: KanbanTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  if (!task) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-left">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {task.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Priority
              </h4>
              <Badge variant={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>

            {task.due_date && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(task.due_date), 'PPP')}
                </p>
              </div>
            )}

            {task.assigned_to && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assigned To
                </h4>
                <p className="text-sm text-muted-foreground">
                  {task.assigned_to}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Status</h4>
              <Badge variant="outline">{task.status.replace('_', ' ')}</Badge>
            </div>
          </div>

          {Array.isArray(task.labels) && task.labels.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Labels</h4>
              <div className="flex flex-wrap gap-2">
                {(task.labels as string[]).map((label: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(task.checklist) && task.checklist.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Checklist</h4>
              <div className="space-y-2">
                {task.checklist.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      className="rounded"
                    />
                    <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-4 border-t">
            <p>Created: {format(new Date(task.created_at), 'PPp')}</p>
            <p>Updated: {format(new Date(task.updated_at), 'PPp')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}