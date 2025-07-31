import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface KanbanBoardPlaceholderProps {
  board?: any;
  columns?: any[];
  tasks?: any[];
  onAddTask?: () => void;
  onTaskClick?: (task: any) => void;
  selectedTask?: any;
  setSelectedTask?: (task: any) => void;
}

const KanbanBoardPlaceholder: React.FC<KanbanBoardPlaceholderProps> = () => {
  return (
    <Card className="m-4">
      <CardContent className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Kanban Board</h3>
        <p className="text-muted-foreground">
          Kanban functionality is temporarily disabled while we optimize the system.
        </p>
      </CardContent>
    </Card>
  );
};

export default KanbanBoardPlaceholder;