import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { KanbanBoard } from '@/components/Kanban/KanbanBoard';

export default function KanbanBoardDetail() {
  const { boardId, id: projectId } = useParams<{ boardId: string; id: string }>();

  if (!boardId) {
    return <Navigate to={projectId ? `/app/projects/${projectId}/kanban` : "/app/kanban"} replace />;
  }

  return <KanbanBoard boardId={boardId} />;
}