import React from 'react';
import { useParams } from 'react-router-dom';
import { KanbanBoardList } from '@/components/Kanban/KanbanBoardList';

export default function KanbanBoards() {
  const { id: projectId } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto p-6">
      <KanbanBoardList projectId={projectId} />
    </div>
  );
}