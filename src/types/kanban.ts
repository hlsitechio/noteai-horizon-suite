import { Json } from '@/integrations/supabase/types';

export interface KanbanBoard {
  id: string;
  user_id: string;
  project_id?: string | null;
  title: string;
  description?: string | null;
  settings: Json;
  created_at: string;
  updated_at: string;
}

export interface KanbanColumn {
  id: string;
  board_id: string;
  title: string;
  position: number;
  color?: string | null;
  settings: Json;
  created_at: string;
  updated_at: string;
}

export interface KanbanTask {
  id: string;
  column_id: string;
  board_id: string;
  title: string;
  description?: string | null;
  position: number;
  priority: string;
  status: string;
  assigned_to?: string | null;
  due_date?: string | null;
  labels: Json;
  attachments: Json;
  checklist: Json;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CreateBoardData {
  title: string;
  description?: string;
  project_id?: string;
}

export interface CreateColumnData {
  title: string;
  position: number;
  color?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  position: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  labels?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  position?: number;
  column_id?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  labels?: Json;
  checklist?: Json;
}