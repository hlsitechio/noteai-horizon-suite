-- Critical Production Security and Performance Fixes

-- 1. Fix all function search_path security issues
ALTER FUNCTION public.cleanup_old_security_logs() SET search_path TO '';
ALTER FUNCTION public.update_seo_visitor_analytics_updated_at() SET search_path TO '';
ALTER FUNCTION public.update_user_preferences_updated_at() SET search_path TO '';
ALTER FUNCTION public.update_seo_website_configs_updated_at() SET search_path TO '';
ALTER FUNCTION public.update_page_banner_settings_updated_at() SET search_path TO '';
ALTER FUNCTION public.update_user_onboarding_updated_at() SET search_path TO '';
ALTER FUNCTION public.initialize_user_onboarding() SET search_path TO '';
ALTER FUNCTION public.update_kanban_updated_at() SET search_path TO '';
ALTER FUNCTION public.log_storage_access() SET search_path TO '';
ALTER FUNCTION public.get_user_passkeys() SET search_path TO '';
ALTER FUNCTION public.delete_user_passkey(text) SET search_path TO '';
ALTER FUNCTION public.update_dashboard_workspaces_updated_at() SET search_path TO '';
ALTER FUNCTION public.ensure_default_dashboard_workspace() SET search_path TO '';
ALTER FUNCTION public.handle_new_user() SET search_path TO '';
ALTER FUNCTION public.update_reminders_updated_at() SET search_path TO '';

-- 2. Add performance indexes for high-traffic queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notes_v2_user_search 
ON public.notes_v2(user_id, title) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dashboard_components_user_layout 
ON public.dashboard_components(user_id, layout_id, position_x, position_y) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_seo_visitor_analytics_user_date 
ON public.seo_visitor_analytics(user_id, created_at DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kanban_tasks_board_position 
ON public.kanban_tasks(board_id, position) 
WHERE board_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_audit_logs_user_type_date 
ON public.security_audit_logs(user_id, event_type, created_at DESC) 
WHERE user_id IS NOT NULL;

-- 3. Add rate limiting table for production security
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  ip_address INET,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limit policies (users can only see their own rate limits)
CREATE POLICY "Users can view their own rate limits" ON public.rate_limits
FOR SELECT USING (auth.uid() = user_id);

-- Index for rate limiting lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limits_user_endpoint_window 
ON public.rate_limits(user_id, endpoint, window_start DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limits_ip_endpoint_window 
ON public.rate_limits(ip_address, endpoint, window_start DESC) 
WHERE ip_address IS NOT NULL;

-- 4. Add application metrics table for monitoring
CREATE TABLE IF NOT EXISTS public.app_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT NOT NULL DEFAULT 'counter',
  tags JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for app metrics
ALTER TABLE public.app_metrics ENABLE ROW LEVEL SECURITY;

-- App metrics policies
CREATE POLICY "Users can manage their own app metrics" ON public.app_metrics
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Index for metrics queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_app_metrics_user_name_time 
ON public.app_metrics(user_id, metric_name, timestamp DESC) 
WHERE user_id IS NOT NULL;

-- 5. Optimize existing tables for better performance
ANALYZE public.notes_v2;
ANALYZE public.dashboard_components;
ANALYZE public.seo_visitor_analytics;
ANALYZE public.kanban_tasks;

-- 6. Clean up old data to improve performance
DELETE FROM public.security_audit_logs WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM public.seo_visitor_analytics WHERE created_at < NOW() - INTERVAL '180 days';

-- 7. Add trigger for app metrics updated_at
CREATE OR REPLACE FUNCTION public.update_app_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.timestamp = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

-- Note: We'll add the trigger in the next migration to avoid conflicts