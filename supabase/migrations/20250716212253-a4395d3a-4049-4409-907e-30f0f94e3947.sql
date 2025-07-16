-- Add missing ai_config column to project_realms
ALTER TABLE public.project_realms 
ADD COLUMN ai_config JSONB DEFAULT '{"agents": [], "memory_depth": 5}'::jsonb;

-- Rename type to agent_type in project_agents to match interface
ALTER TABLE public.project_agents 
RENAME COLUMN type TO agent_type;

-- Add missing columns to project_agents
ALTER TABLE public.project_agents 
ADD COLUMN prompt_template TEXT DEFAULT '',
ADD COLUMN is_active BOOLEAN DEFAULT true;