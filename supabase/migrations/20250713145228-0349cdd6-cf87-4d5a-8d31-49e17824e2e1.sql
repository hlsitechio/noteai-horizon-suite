-- Create backlinks table for tracking referring domains and links
CREATE TABLE public.seo_backlinks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  domain TEXT NOT NULL,
  referring_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT,
  link_type TEXT DEFAULT 'Editorial',
  authority_score INTEGER,
  traffic_level TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Active',
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_nofollow BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create backlink analytics table for tracking metrics over time
CREATE TABLE public.seo_backlink_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_backlinks INTEGER DEFAULT 0,
  referring_domains INTEGER DEFAULT 0,
  domain_authority INTEGER DEFAULT 0,
  trust_flow INTEGER DEFAULT 0,
  link_profile_health INTEGER DEFAULT 0,
  monthly_growth INTEGER DEFAULT 0,
  high_authority_links_percent DECIMAL(5,2) DEFAULT 0,
  medium_authority_links_percent DECIMAL(5,2) DEFAULT 0,
  low_authority_links_percent DECIMAL(5,2) DEFAULT 0,
  recorded_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seo_backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_backlink_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for backlinks
CREATE POLICY "Users can manage their own backlinks" 
ON public.seo_backlinks 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policies for backlink analytics
CREATE POLICY "Users can manage their own backlink analytics" 
ON public.seo_backlink_analytics 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_seo_backlinks_user_id ON public.seo_backlinks(user_id);
CREATE INDEX idx_seo_backlinks_domain ON public.seo_backlinks(domain);
CREATE INDEX idx_seo_backlink_analytics_user_id ON public.seo_backlink_analytics(user_id);
CREATE INDEX idx_seo_backlink_analytics_date ON public.seo_backlink_analytics(recorded_date);

-- Create trigger for updated_at
CREATE TRIGGER update_seo_backlinks_updated_at
  BEFORE UPDATE ON public.seo_backlinks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();