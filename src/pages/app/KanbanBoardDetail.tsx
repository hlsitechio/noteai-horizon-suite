import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { KanbanBoard } from '@/components/Kanban/KanbanBoard';

export default function KanbanBoardDetail() {
  const { boardId } = useParams<{ boardId: string }>();

  if (!boardId) {
    return <Navigate to="/app/kanban" replace />;
  }

  return <KanbanBoard boardId={boardId} />;
}