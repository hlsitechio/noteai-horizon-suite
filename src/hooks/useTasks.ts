import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  category: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  category: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks((data || []) as Task[]);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create task
  const createTask = async (taskData: CreateTaskData): Promise<Task | null> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      return data as Task;
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update task
  const updateTask = async (id: string, updates: Partial<CreateTaskData & { completed: boolean }>): Promise<Task | null> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      return null;
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string): Promise<void> => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await updateTask(id, { completed: !task.completed });
  };

  // Delete task
  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      return false;
    }
  };

  // Set up real-time subscription - disabled to prevent connection errors
  useEffect(() => {
    fetchTasks();
    // Real-time subscription disabled
    console.warn('Tasks real-time subscription disabled');
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    refetch: fetchTasks
  };
};