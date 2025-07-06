-- Create dashboard layout settings table
CREATE TABLE public.dashboard_layouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  layout_name TEXT NOT NULL DEFAULT 'default',
  panel_configurations JSONB NOT NULL DEFAULT '{}',
  panel_sizes JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dashboard_layouts ENABLE ROW LEVEL SECURITY;

-- Create policies for dashboard layouts
CREATE POLICY "Users can view their own dashboard layouts" 
ON public.dashboard_layouts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dashboard layouts" 
ON public.dashboard_layouts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard layouts" 
ON public.dashboard_layouts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dashboard layouts" 
ON public.dashboard_layouts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_dashboard_layouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dashboard_layouts_updated_at
BEFORE UPDATE ON public.dashboard_layouts
FOR EACH ROW
EXECUTE FUNCTION public.update_dashboard_layouts_updated_at();

-- Create available dashboard components table
CREATE TABLE public.dashboard_components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  component_key TEXT NOT NULL UNIQUE,
  component_name TEXT NOT NULL,
  component_description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  default_props JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default available components
INSERT INTO public.dashboard_components (component_key, component_name, component_description, category) VALUES
('recent-activity', 'Recent Activity', 'Shows recent user activities and updates', 'activity'),
('quick-actions', 'Quick Actions', 'Quick action buttons for common tasks', 'actions'),
('analytics-overview', 'Analytics Overview', 'Analytics and metrics overview', 'analytics'),
('system-status', 'System Status', 'System health and status indicators', 'system'),
('notes-summary', 'Notes Summary', 'Summary of notes and documents', 'content'),
('calendar-widget', 'Calendar Widget', 'Mini calendar with upcoming events', 'calendar'),
('weather-widget', 'Weather Widget', 'Current weather information', 'widgets'),
('task-list', 'Task List', 'Personal task and todo management', 'productivity');

-- Make dashboard components publicly readable
ALTER TABLE public.dashboard_components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dashboard components are publicly readable" 
ON public.dashboard_components 
FOR SELECT 
USING (true);