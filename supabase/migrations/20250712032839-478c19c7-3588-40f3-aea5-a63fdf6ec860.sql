-- Create a unified dashboard workspace settings table
CREATE TABLE public.dashboard_workspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workspace_name TEXT NOT NULL DEFAULT 'Main Dashboard',
  is_default BOOLEAN NOT NULL DEFAULT true,
  
  -- Layout Settings
  dashboard_layout JSONB DEFAULT '{}',
  sidebar_layout JSONB DEFAULT '{}',
  panel_sizes JSONB DEFAULT '{}',
  
  -- Banner Settings
  selected_banner_url TEXT,
  selected_banner_type TEXT CHECK (selected_banner_type IN ('image', 'video')),
  banner_settings JSONB DEFAULT '{}',
  
  -- UI Settings
  glowing_effects_enabled BOOLEAN DEFAULT true,
  theme_settings JSONB DEFAULT '{}',
  
  -- Weather Settings
  weather_location TEXT DEFAULT 'New York',
  weather_enabled BOOLEAN DEFAULT true,
  weather_units TEXT DEFAULT 'celsius' CHECK (weather_units IN ('celsius', 'fahrenheit')),
  
  -- Edit Mode Settings
  dashboard_edit_mode BOOLEAN DEFAULT false,
  sidebar_edit_mode BOOLEAN DEFAULT false,
  edit_mode_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional Settings
  custom_settings JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure each user has only one default workspace
  CONSTRAINT unique_default_workspace UNIQUE (user_id, is_default) DEFERRABLE INITIALLY DEFERRED
);

-- Enable RLS
ALTER TABLE public.dashboard_workspaces ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own workspaces" 
ON public.dashboard_workspaces 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workspaces" 
ON public.dashboard_workspaces 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspaces" 
ON public.dashboard_workspaces 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workspaces" 
ON public.dashboard_workspaces 
FOR DELETE 
USING (auth.uid() = user_id AND is_default = false);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_dashboard_workspaces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dashboard_workspaces_updated_at
BEFORE UPDATE ON public.dashboard_workspaces
FOR EACH ROW
EXECUTE FUNCTION public.update_dashboard_workspaces_updated_at();

-- Create function to ensure default workspace exists
CREATE OR REPLACE FUNCTION public.ensure_default_dashboard_workspace()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default workspace for new users
  INSERT INTO public.dashboard_workspaces (
    user_id,
    workspace_name,
    is_default
  ) VALUES (
    NEW.id,
    'Main Dashboard',
    true
  ) ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create default workspace
CREATE TRIGGER create_default_dashboard_workspace
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.ensure_default_dashboard_workspace();