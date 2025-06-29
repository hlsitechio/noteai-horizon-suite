
-- Complete security review and RLS implementation for remaining public tables
-- This migration will secure all remaining tables that should have user-based access control

-- Enable RLS on tables that currently don't have it but should
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for folders table
DROP POLICY IF EXISTS "Users can view their own folders" ON public.folders;
CREATE POLICY "Users can view their own folders" ON public.folders
FOR SELECT USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own folders" ON public.folders;
CREATE POLICY "Users can create their own folders" ON public.folders
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own folders" ON public.folders;
CREATE POLICY "Users can update their own folders" ON public.folders
FOR UPDATE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own folders" ON public.folders;
CREATE POLICY "Users can delete their own folders" ON public.folders
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- RLS policies for user_roles table - only admins can manage roles
DROP POLICY IF EXISTS "Only admins can view user roles" ON public.user_roles;
CREATE POLICY "Only admins can view user roles" ON public.user_roles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can create user roles" ON public.user_roles;
CREATE POLICY "Only admins can create user roles" ON public.user_roles
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can update user roles" ON public.user_roles;
CREATE POLICY "Only admins can update user roles" ON public.user_roles
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can delete user roles" ON public.user_roles;
CREATE POLICY "Only admins can delete user roles" ON public.user_roles
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Secure system tables that should only be accessible by admins
ALTER TABLE public.cron_job_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only admins can access cron job logs" ON public.cron_job_logs;
CREATE POLICY "Only admins can access cron job logs" ON public.cron_job_logs
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only admins can access security settings" ON public.security_settings;
CREATE POLICY "Only admins can access security settings" ON public.security_settings
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Keep analytics tables public but add basic protection
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Page visits are publicly readable" ON public.page_visits;
CREATE POLICY "Page visits are publicly readable" ON public.page_visits
FOR SELECT USING (true);

ALTER TABLE public.pwa_analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "PWA analytics are publicly readable" ON public.pwa_analytics;
CREATE POLICY "PWA analytics are publicly readable" ON public.pwa_analytics
FOR SELECT USING (true);

-- Rate limits should be system-managed, not user-accessible
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Rate limits are system managed" ON public.rate_limits;
CREATE POLICY "Rate limits are system managed" ON public.rate_limits
FOR ALL USING (false); -- Block all direct access

-- Security incidents should only be accessible by admins
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only admins can access security incidents" ON public.security_incidents;
CREATE POLICY "Only admins can access security incidents" ON public.security_incidents
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Static reference data can remain public (countries, cities, etc.)
-- These tables contain reference data that should be publicly readable
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Countries are publicly readable" ON public.countries;
CREATE POLICY "Countries are publicly readable" ON public.countries
FOR SELECT USING (true);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cities are publicly readable" ON public.cities;
CREATE POLICY "Cities are publicly readable" ON public.cities
FOR SELECT USING (true);

ALTER TABLE public.gemini_models ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Gemini models are publicly readable" ON public.gemini_models;
CREATE POLICY "Gemini models are publicly readable" ON public.gemini_models
FOR SELECT USING (true);

-- Ensure the data table (if it contains user data) is secured
ALTER TABLE public.data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Data table blocked by default" ON public.data;
CREATE POLICY "Data table blocked by default" ON public.data
FOR ALL USING (false); -- Block all access until we understand what this table contains

-- Note: Views (daily_visit_counts, pwa_analytics_summary, visitor_stats) cannot have RLS
-- Their security is controlled by the underlying tables they query from
