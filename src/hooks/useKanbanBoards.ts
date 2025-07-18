import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KanbanBoard, CreateBoardData } from '@/types/kanban';
import { toast } from 'sonner';

export function useKanbanBoards(projectId?: string) {
  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoards = async () => {
    try {
      let query = supabase
        .from('kanban_boards')
        .select('*');
      
      // If projectId is provided, filter boards by project
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;
      setBoards(data || []);
    } catch (error) {
      console.error('Error fetching boards:', error);
      toast.error('Failed to load boards');
    } finally {
      setIsLoading(false);
    }
  };

  const createBoard = async (boardData: CreateBoardData): Promise<KanbanBoard | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('kanban_boards')
        .insert({
          ...boardData,
          user_id: user.id,
          project_id: projectId, // Associate with project if provided
        })
        .select()
        .single();

      if (error) throw error;

      // Create default columns
      const defaultColumns = [
        { title: 'To Do', position: 0, color: '#ef4444' },
        { title: 'In Progress', position: 1, color: '#f59e0b' },
        { title: 'Done', position: 2, color: '#10b981' },
      ];

      await supabase.from('kanban_columns').insert(
        defaultColumns.map(col => ({
          board_id: data.id,
          ...col,
        }))
      );

      setBoards(prev => [data, ...prev]);
      toast.success('Board created successfully');
      return data;
    } catch (error) {
      console.error('Error creating board:', error);
      toast.error('Failed to create board');
      return null;
    }
  };

  const updateBoard = async (boardId: string, updates: Partial<KanbanBoard>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('kanban_boards')
        .update(updates)
        .eq('id', boardId);

      if (error) throw error;

      setBoards(prev => prev.map(board => 
        board.id === boardId ? { ...board, ...updates } : board
      ));
      
      toast.success('Board updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating board:', error);
      toast.error('Failed to update board');
      return false;
    }
  };

  const deleteBoard = async (boardId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('kanban_boards')
        .delete()
        .eq('id', boardId);

      if (error) throw error;

      setBoards(prev => prev.filter(board => board.id !== boardId));
      toast.success('Board deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error('Failed to delete board');
      return false;
    }
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