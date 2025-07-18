
-- Create kanban_boards table
CREATE TABLE public.kanban_boards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.project_realms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kanban_columns table
CREATE TABLE public.kanban_columns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES public.kanban_boards(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  color TEXT DEFAULT '#64748b',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kanban_tasks table
CREATE TABLE public.kanban_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  column_id UUID REFERENCES public.kanban_columns(id) ON DELETE CASCADE NOT NULL,
  board_id UUID REFERENCES public.kanban_boards(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'blocked')),
  assigned_to UUID,
  due_date TIMESTAMP WITH TIME ZONE,
  labels JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  checklist JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.kanban_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for kanban_boards
CREATE POLICY "Users can manage their own kanban boards" 
  ON public.kanban_boards 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for kanban_columns
CREATE POLICY "Users can manage columns in their boards" 
  ON public.kanban_columns 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.kanban_boards 
      WHERE id = kanban_columns.board_id 
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.kanban_boards 
      WHERE id = kanban_columns.board_id 
      AND user_id = auth.uid()
    )
  );

-- Create RLS policies for kanban_tasks
CREATE POLICY "Users can manage tasks in their boards" 
  ON public.kanban_tasks 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.kanban_boards 
      WHERE id = kanban_tasks.board_id 
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.kanban_boards 
      WHERE id = kanban_tasks.board_id 
      AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_kanban_boards_user_id ON public.kanban_boards(user_id);
CREATE INDEX idx_kanban_boards_project_id ON public.kanban_boards(project_id);
CREATE INDEX idx_kanban_columns_board_id ON public.kanban_columns(board_id);
CREATE INDEX idx_kanban_columns_position ON public.kanban_columns(board_id, position);
CREATE INDEX idx_kanban_tasks_column_id ON public.kanban_tasks(column_id);
CREATE INDEX idx_kanban_tasks_board_id ON public.kanban_tasks(board_id);
CREATE INDEX idx_kanban_tasks_position ON public.kanban_tasks(column_id, position);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_kanban_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kanban_boards_updated_at
  BEFORE UPDATE ON public.kanban_boards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_kanban_updated_at();

CREATE TRIGGER update_kanban_columns_updated_at
  BEFORE UPDATE ON public.kanban_columns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_kanban_updated_at();

CREATE TRIGGER update_kanban_tasks_updated_at
  BEFORE UPDATE ON public.kanban_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_kanban_updated_at();
