import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Placeholder - feature temporarily disabled
  const fetchTasks = async () => {
    console.log('Tasks feature temporarily disabled');
    setLoading(false);
  };

  // Placeholder implementations - feature temporarily disabled
  const createTask = async (taskData: CreateTaskData): Promise<Task | null> => {
    toast({
      title: "Error",
      description: "Tasks feature temporarily disabled",
      variant: "destructive",
    });
    return null;
  };

  const updateTask = async (id: string, updates: Partial<CreateTaskData & { completed: boolean }>): Promise<Task | null> => {
    toast({
      title: "Error",
      description: "Tasks feature temporarily disabled",
      variant: "destructive",
    });
    return null;
  };

  const toggleTaskCompletion = async (id: string): Promise<void> => {
    toast({
      title: "Error",
      description: "Tasks feature temporarily disabled",
      variant: "destructive",
    });
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    toast({
      title: "Error",
      description: "Tasks feature temporarily disabled",
      variant: "destructive",
    });
    return false;
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchTasks();

    return () => {
      // No cleanup needed since no subscription was created
    };
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