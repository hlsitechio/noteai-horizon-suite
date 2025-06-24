
-- Create project_realms table
CREATE TABLE public.project_realms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  ai_config JSONB DEFAULT '{
    "agents": [],
    "memory_depth": 100
  }',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'hibernating')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_agents table
CREATE TABLE public.project_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project_realms(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('scribe', 'strategist', 'researcher', 'scheduler', 'custom')),
  name TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_realms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_agents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_realms
CREATE POLICY "Users can view their own projects" ON public.project_realms
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create their own projects" ON public.project_realms
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own projects" ON public.project_realms
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own projects" ON public.project_realms
  FOR DELETE USING (auth.uid() = creator_id);

-- Create RLS policies for project_agents
CREATE POLICY "Users can view agents of their projects" ON public.project_agents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_realms pr 
      WHERE pr.id = project_agents.project_id 
      AND pr.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can create agents for their projects" ON public.project_agents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_realms pr 
      WHERE pr.id = project_agents.project_id 
      AND pr.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update agents of their projects" ON public.project_agents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM project_realms pr 
      WHERE pr.id = project_agents.project_id 
      AND pr.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete agents of their projects" ON public.project_agents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM project_realms pr 
      WHERE pr.id = project_agents.project_id 
      AND pr.creator_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_project_realms_creator_id ON public.project_realms(creator_id);
CREATE INDEX idx_project_realms_status ON public.project_realms(status);
CREATE INDEX idx_project_realms_last_activity ON public.project_realms(last_activity_at DESC);
CREATE INDEX idx_project_agents_project_id ON public.project_agents(project_id);
CREATE INDEX idx_project_agents_is_active ON public.project_agents(is_active);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_project_realms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_realms_updated_at_trigger
  BEFORE UPDATE ON public.project_realms
  FOR EACH ROW
  EXECUTE FUNCTION update_project_realms_updated_at();

CREATE TRIGGER update_project_agents_updated_at_trigger
  BEFORE UPDATE ON public.project_agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
