import { useState, useEffect } from 'react';
import { KanbanBoard, CreateBoardData } from '@/types/kanban';
import { toast } from 'sonner';

// Placeholder implementation - Kanban features temporarily disabled
export function useKanbanBoards(projectId?: string) {
  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBoards = async () => {
    // Placeholder - feature temporarily disabled
    console.log('Kanban boards feature temporarily disabled');
    setIsLoading(false);
  };

  const createBoard = async (boardData: CreateBoardData): Promise<KanbanBoard | null> => {
    toast.error('Kanban feature temporarily disabled');
    return null;
  };

  const updateBoard = async (boardId: string, updates: Partial<KanbanBoard>): Promise<boolean> => {
    toast.error('Kanban feature temporarily disabled');
    return false;
  };

  const deleteBoard = async (boardId: string): Promise<boolean> => {
    toast.error('Kanban feature temporarily disabled');
    return false;
  };

  useEffect(() => {
    fetchBoards();
  }, [projectId]);

  return {
    boards,
    isLoading,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
  };
}