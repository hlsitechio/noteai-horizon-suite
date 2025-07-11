-- Create SEO Keywords table for tracking keyword performance
CREATE TABLE public.seo_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  keyword TEXT NOT NULL,
  target_url TEXT NOT NULL,
  current_position INTEGER,
  previous_position INTEGER,
  search_volume TEXT,
  difficulty TEXT CHECK (difficulty IN ('Low', 'Medium', 'High')),
  traffic TEXT,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SEO Page Settings table for managing meta data per page
CREATE TABLE public.seo_page_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  page_path TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, page_path)
);

-- Create SEO Analytics table for tracking performance metrics
CREATE TABLE public.seo_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  page_path TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('organic_traffic', 'keyword_ranking', 'click_through_rate', 'bounce_rate')),
  metric_value NUMERIC,
  recorded_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, page_path, metric_type, recorded_date)
);

-- Enable Row Level Security
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for seo_keywords
CREATE POLICY "Users can view their own SEO keywords" 
ON public.seo_keywords 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SEO keywords" 
ON public.seo_keywords 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SEO keywords" 
ON public.seo_keywords 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SEO keywords" 
ON public.seo_keywords 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for seo_page_settings
CREATE POLICY "Users can view their own SEO page settings" 
ON public.seo_page_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SEO page settings" 
ON public.seo_page_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SEO page settings" 
ON public.seo_page_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SEO page settings" 
ON public.seo_page_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for seo_analytics
CREATE POLICY "Users can view their own SEO analytics" 
ON public.seo_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SEO analytics" 
ON public.seo_analytics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SEO analytics" 
ON public.seo_analytics 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SEO analytics" 
ON public.seo_analytics 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_seo_keywords_updated_at
BEFORE UPDATE ON public.seo_keywords
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seo_page_settings_updated_at
BEFORE UPDATE ON public.seo_page_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for the current user (this will be replaced with real data)
INSERT INTO public.seo_keywords (user_id, keyword, target_url, current_position, previous_position, search_volume, difficulty, traffic) VALUES
  ('00000000-0000-0000-0000-000000000000', 'note taking app', '/features', 3, 5, '12K', 'Medium', '1.2K'),
  ('00000000-0000-0000-0000-000000000000', 'productivity tools', '/dashboard', 7, 8, '8.5K', 'High', '850'),
  ('00000000-0000-0000-0000-000000000000', 'digital notebook', '/editor', 12, 9, '5.2K', 'Low', '520'),
  ('00000000-0000-0000-0000-000000000000', 'AI writing assistant', '/ai-features', 5, 9, '15K', 'High', '1.8K');

-- Insert SEO page settings for key pages
INSERT INTO public.seo_page_settings (user_id, page_path, meta_title, meta_description, meta_keywords) VALUES
  ('00000000-0000-0000-0000-000000000000', '/features', 'Advanced Note Taking App Features - OnlineNote AI', 'Discover powerful features of our AI-powered note taking app. Smart organization, real-time sync, and intelligent suggestions for maximum productivity.', ARRAY['note taking app', 'productivity features', 'smart notes', 'ai features']),
  ('00000000-0000-0000-0000-000000000000', '/dashboard', 'Productivity Tools Dashboard - OnlineNote AI', 'Access your comprehensive productivity tools dashboard. Track your notes, manage tasks, and boost efficiency with our AI-powered workspace.', ARRAY['productivity tools', 'dashboard', 'task management', 'workspace']),
  ('00000000-0000-0000-0000-000000000000', '/editor', 'Digital Notebook Editor - OnlineNote AI', 'Experience our advanced digital notebook editor with AI-powered writing assistance, rich formatting, and seamless collaboration features.', ARRAY['digital notebook', 'note editor', 'writing tools', 'collaboration']),
  ('00000000-0000-0000-0000-000000000000', '/ai-features', 'AI Writing Assistant Features - OnlineNote AI', 'Enhance your writing with our advanced AI writing assistant. Get intelligent suggestions, grammar corrections, and content optimization.', ARRAY['AI writing assistant', 'ai features', 'writing enhancement', 'content optimization']);