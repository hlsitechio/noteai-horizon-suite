import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { KanbanColumn as Column, KanbanTask } from '@/types/kanban';
import { KanbanTaskCard } from './KanbanTaskCard';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface KanbanColumnProps {
  column: Column;
  tasks: KanbanTask[];
  onAddTask: () => void;
  onTaskClick: (task: KanbanTask) => void;
}

export function KanbanColumn({ column, tasks, onAddTask, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef: dropRef } = useDroppable({
    id: column.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: sortRef,
    transform,
    transition,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={(node) => {
        dropRef(node);
        sortRef(node);
      }}
      style={style}
      className="flex flex-col w-80 min-w-80 bg-muted/50 rounded-lg p-4 h-full"
      {...attributes}
    >
      <div className="flex items-center justify-between mb-4" {...listeners}>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color || '#64748b' }}
          />
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Column</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete Column</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.map(task => (
          <KanbanTaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-4 w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={onAddTask}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a task
      </Button>
    </div>
  );
}