import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTaskCard } from './KanbanTaskCard';
import { CreateColumnDialog } from './CreateColumnDialog';
import { CreateTaskDialog } from './CreateTaskDialog';
import { TaskDetailDialog } from './TaskDetailDialog';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { KanbanTask } from '@/types/kanban';
import { useNavigate } from 'react-router-dom';

interface KanbanBoardProps {
  boardId: string;
}

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const navigate = useNavigate();
  const { board, columns, tasks, isLoading, createColumn, moveTask } = useKanbanBoard(boardId);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Board not found</p>
      </div>
    );
  }

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setShowCreateTask(true);
  };

  const handleTaskClick = (task: KanbanTask) => {
    setSelectedTask(task);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on a column
    const targetColumn = columns.find(col => col.id === overId);
    if (targetColumn) {
      const columnTasks = tasks.filter(task => task.column_id === targetColumn.id);
      const newPosition = columnTasks.length;
      moveTask(taskId, targetColumn.id, newPosition);
    }
  };

  const getTasksByColumn = (columnId: string) => {
    return tasks
      .filter(task => task.column_id === columnId)
      .sort((a, b) => a.position - b.position);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-2xl font-bold">{board.title}</h1>
        </div>
        <Button onClick={() => setShowCreateColumn(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Column
        </Button>
      </div>

      {board.description && (
        <div className="p-4 border-b">
          <p className="text-muted-foreground">{board.description}</p>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <div className="flex gap-4 p-4 h-full overflow-x-auto">
            <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
              {columns.map(column => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={getTasksByColumn(column.id)}
                  onAddTask={() => handleAddTask(column.id)}
                  onTaskClick={handleTaskClick}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>

      <CreateColumnDialog
        open={showCreateColumn}
        onOpenChange={setShowCreateColumn}
        onSubmit={async (data) => {
          const success = await createColumn({
            ...data,
            position: columns.length,
          });
          if (success) {
            setShowCreateColumn(false);
          }
        }}
      />

      <CreateTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        columnId={selectedColumnId}
        position={getTasksByColumn(selectedColumnId).length}
        onClose={() => setShowCreateTask(false)}
      />

      <TaskDetailDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </div>
  );
}