-- Add dashboard settings table for storing user preferences like selected banner
CREATE TABLE IF NOT EXISTS public.dashboard_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_banner_url text,
  selected_banner_type text CHECK (selected_banner_type IN ('image', 'video')),
  sidebar_panel_sizes jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.dashboard_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own dashboard settings"
  ON public.dashboard_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dashboard settings"
  ON public.dashboard_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard settings"
  ON public.dashboard_settings
  FOR UPDATE
  Using (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_dashboard_settings_updated_at
  BEFORE UPDATE ON public.dashboard_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();