-- Critical Production Security and Database Fixes (Part 1)

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

-- 2. Add rate limiting table for production security
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

-- Rate limit policies
CREATE POLICY "Users can view their own rate limits" ON public.rate_limits
FOR SELECT USING (auth.uid() = user_id);

-- 3. Add application metrics table for monitoring
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

-- 4. Clean up old data to improve performance
DELETE FROM public.security_audit_logs WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM public.seo_visitor_analytics WHERE created_at < NOW() - INTERVAL '180 days';

-- 5. Optimize existing tables for better performance
ANALYZE public.notes_v2;
ANALYZE public.dashboard_components;
ANALYZE public.seo_visitor_analytics;
ANALYZE public.kanban_tasks;