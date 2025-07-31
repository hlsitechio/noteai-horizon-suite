// Enhanced Kanban Board hook with proper types
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  column_id: string;
  position: number;
  labels?: string[];
  created_at: string;
  updated_at: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  position: number;
  board_id: string;
}

interface KanbanBoard {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useKanbanBoard = (boardId?: string) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createTask = async (taskData: Partial<KanbanTask>) => {
    if (!user || !boardId) return null;
    
    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .insert({
          ...taskData,
          user_id: user.id,
          board_id: boardId,
        });
      
      if (!error && data) {
        setTasks(prev => [...prev, data as KanbanTask]);
      }
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<KanbanTask>) => {
    try {
      const updateQuery = await supabase
        .from('kanban_tasks')
        .update(updates);
      
      const { data, error } = await updateQuery.eq('id', taskId);
      
      if (!error && data) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        ));
      }
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const deleteQuery = await supabase
        .from('kanban_tasks')
        .delete();
      
      const { error } = await deleteQuery.eq('id', taskId);
      
      if (!error) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
      return !error;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  const moveTask = async (taskId: string, newColumnId: string, newPosition: number) => {
    return await updateTask(taskId, { 
      column_id: newColumnId, 
      position: newPosition 
    });
  };

  const createColumn = async (columnData: Partial<KanbanColumn>) => {
    if (!user || !boardId) return null;
    
    try {
      const { data, error } = await supabase
        .from('kanban_columns')
        .insert({
          ...columnData,
          board_id: boardId,
        });
      
      if (!error && data) {
        setColumns(prev => [...prev, data as KanbanColumn]);
      }
      return data;
    } catch (error) {
      console.error('Error creating column:', error);
      return null;
    }
  };

  return {
    tasks,
    columns,
    board,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    createColumn,
  };
};