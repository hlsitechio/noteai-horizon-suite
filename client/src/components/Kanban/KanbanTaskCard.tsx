import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanTask } from '@/types/kanban';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Paperclip, CheckSquare, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface KanbanTaskCardProps {
  task: KanbanTask;
  onClick: () => void;
}

export function KanbanTaskCard({ task, onClick }: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertCircle className="h-3 w-3" />;
    }
    return null;
  };

  const checklist = Array.isArray(task.checklist) ? task.checklist : [];
  const completedChecklist = checklist.filter((item: any) => item.completed).length;
  const totalChecklist = checklist.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-background border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="space-y-3">
        <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {Array.isArray(task.labels) && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                {label}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityColor(task.priority)} className="text-xs px-1 py-0">
              {getPriorityIcon(task.priority)}
              {task.priority}
            </Badge>

            {task.due_date && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), 'MMM d')}
              </div>
            )}
          </div>

          {task.assigned_to && (
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">
                {task.assigned_to.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {Array.isArray(task.attachments) && task.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                {task.attachments.length}
              </div>
            )}

            {totalChecklist > 0 && (
              <div className="flex items-center gap-1">
                <CheckSquare className="h-3 w-3" />
                {completedChecklist}/{totalChecklist}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}