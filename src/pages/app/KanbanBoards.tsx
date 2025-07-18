import React from 'react';
import { KanbanBoardList } from '@/components/Kanban/KanbanBoardList';

export default function KanbanBoards() {
  return (
    <div className="container mx-auto p-6">
      <KanbanBoardList />
    </div>
  );
}