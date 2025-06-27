
-- Enable RLS on project_realms table
ALTER TABLE public.project_realms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own projects" ON public.project_realms;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.project_realms;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.project_realms;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.project_realms;

-- Create RLS policies for project_realms table
CREATE POLICY "Users can view their own projects" 
  ON public.project_realms 
  FOR SELECT 
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can create their own projects" 
  ON public.project_realms 
  FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own projects" 
  ON public.project_realms 
  FOR UPDATE 
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.project_realms 
  FOR DELETE 
  USING (auth.uid() = creator_id);

-- Also enable RLS on project_agents table
ALTER TABLE public.project_agents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view agents for their projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can create agents for their projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can update agents for their projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can delete agents for their projects" ON public.project_agents;

-- Create RLS policies for project_agents table
CREATE POLICY "Users can view agents for their projects" 
  ON public.project_agents 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.project_realms 
      WHERE id = project_agents.project_id 
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can create agents for their projects" 
  ON public.project_agents 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.project_realms 
      WHERE id = project_agents.project_id 
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update agents for their projects" 
  ON public.project_agents 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.project_realms 
      WHERE id = project_agents.project_id 
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete agents for their projects" 
  ON public.project_agents 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.project_realms 
      WHERE id = project_agents.project_id 
      AND creator_id = auth.uid()
    )
  );
