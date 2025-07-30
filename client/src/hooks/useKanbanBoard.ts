import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KanbanBoard, KanbanColumn, KanbanTask, CreateColumnData, CreateTaskData, UpdateTaskData } from '@/types/kanban';
import { toast } from 'sonner';

export function useKanbanBoard(boardId: string) {
  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoardData = async () => {
    try {
      setIsLoading(true);

      // Fetch board
      const { data: boardData, error: boardError } = await supabase
        .from('kanban_boards')
        .select('*')
        .eq('id', boardId)
        .single();

      if (boardError) throw boardError;
      setBoard(boardData);

      // Fetch columns
      const { data: columnsData, error: columnsError } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position');

      if (columnsError) throw columnsError;
      setColumns(columnsData || []);

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('kanban_tasks')
        .select('*')
        .eq('board_id', boardId)
        .order('position');

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);
    } catch (error) {
      console.error('Error fetching board data:', error);
      toast.error('Failed to load board data');
    } finally {
      setIsLoading(false);
    }
  };

  const createColumn = async (columnData: CreateColumnData): Promise<KanbanColumn | null> => {
    try {
      const { data, error } = await supabase
        .from('kanban_columns')
        .insert({
          ...columnData,
          board_id: boardId,
        })
        .select()
        .single();

      if (error) throw error;

      setColumns(prev => [...prev, data].sort((a, b) => a.position - b.position));
      toast.success('Column created successfully');
      return data;
    } catch (error) {
      console.error('Error creating column:', error);
      toast.error('Failed to create column');
      return null;
    }
  };

  const updateColumn = async (columnId: string, updates: Partial<KanbanColumn>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('kanban_columns')
        .update(updates)
        .eq('id', columnId);

      if (error) throw error;

      setColumns(prev => prev.map(col => 
        col.id === columnId ? { ...col, ...updates } : col
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating column:', error);
      toast.error('Failed to update column');
      return false;
    }
  };

  const deleteColumn = async (columnId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('kanban_columns')
        .delete()
        .eq('id', columnId);

      if (error) throw error;

      setColumns(prev => prev.filter(col => col.id !== columnId));
      setTasks(prev => prev.filter(task => task.column_id !== columnId));
      toast.success('Column deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error('Failed to delete column');
      return false;
    }
  };

  const createTask = async (columnId: string, taskData: CreateTaskData): Promise<KanbanTask | null> => {
    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .insert({
          ...taskData,
          column_id: columnId,
          board_id: boardId,
          labels: taskData.labels || [],
          attachments: [],
          checklist: [],
        })
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [...prev, data]);
      toast.success('Task created successfully');
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      return null;
    }
  };

  const updateTask = async (taskId: string, updates: UpdateTaskData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('kanban_tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return false;
    }
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('kanban_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  };

  const moveTask = async (taskId: string, newColumnId: string, newPosition: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('kanban_tasks')
        .update({
          column_id: newColumnId,
          position: newPosition,
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, column_id: newColumnId, position: newPosition }
          : task
      ));
      
      return true;
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Failed to move task');
      return false;
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchBoardData();
    }
  }, [boardId]);

  return {
    board,
    columns,
    tasks,
    isLoading,
    fetchBoardData,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}