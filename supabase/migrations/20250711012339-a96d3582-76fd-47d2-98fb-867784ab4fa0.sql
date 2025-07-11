-- Create SEO Competitors table for competitive analysis
CREATE TABLE public.seo_competitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  competitor_domain TEXT NOT NULL,
  competitor_name TEXT NOT NULL,
  target_keywords TEXT[],
  last_analyzed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  analysis_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, competitor_domain)
);

-- Create SEO Recommendations table for AI-powered suggestions
CREATE TABLE public.seo_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  page_path TEXT NOT NULL,
  recommendation_type TEXT CHECK (recommendation_type IN ('content', 'technical', 'keywords', 'backlinks', 'performance')),
  priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_items TEXT[],
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 100),
  implementation_difficulty TEXT CHECK (implementation_difficulty IN ('easy', 'medium', 'hard')),
  is_implemented BOOLEAN DEFAULT false,
  ai_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SEO Audits table for technical SEO monitoring
CREATE TABLE public.seo_audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  audit_type TEXT CHECK (audit_type IN ('technical', 'content', 'performance', 'mobile', 'security')),
  audit_score INTEGER CHECK (audit_score >= 0 AND audit_score <= 100),
  issues_found INTEGER DEFAULT 0,
  issues_fixed INTEGER DEFAULT 0,
  audit_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SEO Alerts table for real-time monitoring
CREATE TABLE public.seo_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('ranking_drop', 'ranking_gain', 'traffic_drop', 'traffic_spike', 'new_competitor', 'broken_links', 'crawl_errors')),
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  page_path TEXT,
  keyword TEXT,
  metric_value NUMERIC,
  previous_value NUMERIC,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SEO Content Gaps table for content opportunities
CREATE TABLE public.seo_content_gaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  keyword_difficulty INTEGER,
  competitor_ranking_urls TEXT[],
  content_type_suggestion TEXT,
  content_outline TEXT,
  priority_score INTEGER CHECK (priority_score >= 1 AND priority_score <= 100),
  is_targeted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.seo_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_content_gaps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
CREATE POLICY "Users can manage their own competitor data" ON public.seo_competitors FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own SEO recommendations" ON public.seo_recommendations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own SEO audits" ON public.seo_audits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own SEO alerts" ON public.seo_alerts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own content gaps" ON public.seo_content_gaps FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create triggers for timestamp updates
CREATE TRIGGER update_seo_competitors_updated_at BEFORE UPDATE ON public.seo_competitors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seo_recommendations_updated_at BEFORE UPDATE ON public.seo_recommendations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seo_content_gaps_updated_at BEFORE UPDATE ON public.seo_content_gaps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample advanced SEO data
INSERT INTO public.seo_competitors (user_id, competitor_domain, competitor_name, target_keywords) VALUES
  ('00000000-0000-0000-0000-000000000000', 'notion.so', 'Notion', ARRAY['productivity tools', 'note taking', 'workspace management']),
  ('00000000-0000-0000-0000-000000000000', 'obsidian.md', 'Obsidian', ARRAY['note taking app', 'knowledge management', 'digital notes']),
  ('00000000-0000-0000-0000-000000000000', 'roamresearch.com', 'Roam Research', ARRAY['research notes', 'knowledge graphs', 'note connections']);

INSERT INTO public.seo_recommendations (user_id, page_path, recommendation_type, priority, title, description, action_items, impact_score, implementation_difficulty) VALUES
  ('00000000-0000-0000-0000-000000000000', '/features', 'content', 'high', 'Add Feature Comparison Table', 'Create a detailed comparison table showing your features vs competitors', ARRAY['Research competitor features', 'Create comparison matrix', 'Add interactive elements'], 85, 'medium'),
  ('00000000-0000-0000-0000-000000000000', '/dashboard', 'technical', 'critical', 'Optimize Core Web Vitals', 'Your LCP is 2.8s, aim for under 2.5s for better rankings', ARRAY['Optimize images', 'Reduce JavaScript bundle', 'Enable compression'], 95, 'hard'),
  ('00000000-0000-0000-0000-000000000000', '/ai-features', 'keywords', 'high', 'Target Long-tail AI Keywords', 'Optimize for "AI-powered note taking software" and similar phrases', ARRAY['Add FAQ section', 'Create AI capabilities page', 'Add schema markup'], 78, 'easy');

INSERT INTO public.seo_audits (user_id, audit_type, audit_score, issues_found, issues_fixed, audit_data) VALUES
  ('00000000-0000-0000-0000-000000000000', 'technical', 87, 12, 8, '{"issues": ["Missing H1 tags on 3 pages", "4 broken internal links", "Large image files"], "recommendations": ["Add H1 tags", "Fix broken links", "Compress images"]}'),
  ('00000000-0000-0000-0000-000000000000', 'performance', 76, 8, 5, '{"core_web_vitals": {"lcp": 2.8, "fid": 45, "cls": 0.02}, "suggestions": ["Optimize images", "Reduce JS bundle size"]}'),
  ('00000000-0000-0000-0000-000000000000', 'mobile', 92, 3, 3, '{"mobile_friendly": true, "issues": [], "suggestions": ["Perfect mobile optimization"]}');

INSERT INTO public.seo_alerts (user_id, alert_type, severity, title, message, page_path, keyword, metric_value, previous_value) VALUES
  ('00000000-0000-0000-0000-000000000000', 'ranking_gain', 'info', 'Keyword Ranking Improved!', '"note taking app" moved from position 5 to position 3', '/features', 'note taking app', 3, 5),
  ('00000000-0000-0000-0000-000000000000', 'traffic_spike', 'info', 'Traffic Surge Detected', 'Organic traffic increased by 45% this week', '/dashboard', NULL, 2450, 1690),
  ('00000000-0000-0000-0000-000000000000', 'ranking_drop', 'warning', 'Ranking Drop Alert', '"digital notebook" dropped from position 9 to position 12', '/editor', 'digital notebook', 12, 9);

INSERT INTO public.seo_content_gaps (user_id, keyword, search_volume, keyword_difficulty, competitor_ranking_urls, content_type_suggestion, content_outline, priority_score) VALUES
  ('00000000-0000-0000-0000-000000000000', 'AI note taking for students', 8900, 35, ARRAY['notion.so/students', 'obsidian.md/education'], 'Landing Page', 'Student-focused features, pricing plans, educational use cases, testimonials from students', 88),
  ('00000000-0000-0000-0000-000000000000', 'collaborative note taking software', 5600, 42, ARRAY['notion.so/collaboration', 'google.com/docs'], 'Feature Page', 'Real-time collaboration, team workspaces, sharing permissions, commenting system', 75),
  ('00000000-0000-0000-0000-000000000000', 'note taking app comparison', 12000, 55, ARRAY['zapier.com/blog/note-apps', 'productivityist.com/note-apps'], 'Blog Post', 'Detailed comparison of top note apps, pros/cons, pricing, feature matrix', 92);