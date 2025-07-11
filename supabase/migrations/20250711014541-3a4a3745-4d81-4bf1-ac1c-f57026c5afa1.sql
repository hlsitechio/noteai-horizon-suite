-- Create table for website visitor tracking
CREATE TABLE public.seo_visitor_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  website_domain TEXT NOT NULL,
  page_path TEXT NOT NULL,
  visitor_id TEXT NOT NULL, -- Unique visitor identifier (could be session-based)
  session_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT, -- mobile, desktop, tablet
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  page_load_time INTEGER, -- in milliseconds
  time_on_page INTEGER, -- in seconds
  bounce_rate BOOLEAN DEFAULT false,
  conversion_event TEXT, -- track specific conversion events
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for website configuration
CREATE TABLE public.seo_website_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  website_domain TEXT NOT NULL,
  website_name TEXT NOT NULL,
  tracking_enabled BOOLEAN DEFAULT true,
  widget_settings JSONB DEFAULT '{}'::jsonb,
  goals JSONB DEFAULT '[]'::jsonb, -- conversion goals
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, website_domain)
);

-- Create table for real-time visitor sessions
CREATE TABLE public.seo_active_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  website_domain TEXT NOT NULL,
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  current_page TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  total_pages_viewed INTEGER DEFAULT 1,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  UNIQUE(session_id)
);

-- Enable Row Level Security
ALTER TABLE public.seo_visitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_website_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_active_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for visitor analytics
CREATE POLICY "Users can manage their own visitor analytics" 
ON public.seo_visitor_analytics 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for website configs
CREATE POLICY "Users can manage their own website configs" 
ON public.seo_website_configs 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for active sessions
CREATE POLICY "Users can manage their own active sessions" 
ON public.seo_active_sessions 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_seo_visitor_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_seo_website_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_seo_visitor_analytics_updated_at
  BEFORE UPDATE ON public.seo_visitor_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seo_visitor_analytics_updated_at();

CREATE TRIGGER update_seo_website_configs_updated_at
  BEFORE UPDATE ON public.seo_website_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seo_website_configs_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_seo_visitor_analytics_user_domain ON public.seo_visitor_analytics(user_id, website_domain);
CREATE INDEX idx_seo_visitor_analytics_page_path ON public.seo_visitor_analytics(page_path);
CREATE INDEX idx_seo_visitor_analytics_created_at ON public.seo_visitor_analytics(created_at DESC);
CREATE INDEX idx_seo_visitor_analytics_session_id ON public.seo_visitor_analytics(session_id);
CREATE INDEX idx_seo_active_sessions_website_domain ON public.seo_active_sessions(website_domain);
CREATE INDEX idx_seo_active_sessions_is_active ON public.seo_active_sessions(is_active) WHERE is_active = true;