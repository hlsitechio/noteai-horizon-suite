
-- Enable RLS on all tables that don't have it yet and add appropriate policies
-- Using IF NOT EXISTS and DROP POLICY IF EXISTS to handle existing policies

-- Enable RLS on ai_interactions_v2 table
ALTER TABLE public.ai_interactions_v2 ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_interactions_v2
DROP POLICY IF EXISTS "Users can view their own AI interactions" ON public.ai_interactions_v2;
CREATE POLICY "Users can view their own AI interactions" ON public.ai_interactions_v2
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own AI interactions" ON public.ai_interactions_v2;
CREATE POLICY "Users can insert their own AI interactions" ON public.ai_interactions_v2
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Enable RLS on ai_usage_tracking table
ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_usage_tracking
DROP POLICY IF EXISTS "Users can view their own usage tracking" ON public.ai_usage_tracking;
CREATE POLICY "Users can view their own usage tracking" ON public.ai_usage_tracking
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own usage tracking" ON public.ai_usage_tracking;
CREATE POLICY "Users can insert their own usage tracking" ON public.ai_usage_tracking
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Enable RLS on note_shares table
ALTER TABLE public.note_shares ENABLE ROW LEVEL SECURITY;

-- RLS policies for note_shares
DROP POLICY IF EXISTS "Users can view shares they created or received" ON public.note_shares;
CREATE POLICY "Users can view shares they created or received" ON public.note_shares
FOR SELECT USING (shared_by = auth.uid() OR shared_with = auth.uid());

DROP POLICY IF EXISTS "Users can create their own shares" ON public.note_shares;
CREATE POLICY "Users can create their own shares" ON public.note_shares
FOR INSERT WITH CHECK (shared_by = auth.uid());

DROP POLICY IF EXISTS "Users can update their own shares" ON public.note_shares;
CREATE POLICY "Users can update their own shares" ON public.note_shares
FOR UPDATE USING (shared_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own shares" ON public.note_shares;
CREATE POLICY "Users can delete their own shares" ON public.note_shares
FOR DELETE USING (shared_by = auth.uid());

-- Enable RLS on note_versions table
ALTER TABLE public.note_versions ENABLE ROW LEVEL SECURITY;

-- RLS policies for note_versions
DROP POLICY IF EXISTS "Users can view versions of their own notes" ON public.note_versions;
CREATE POLICY "Users can view versions of their own notes" ON public.note_versions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.notes_v2 
    WHERE notes_v2.id = note_versions.note_id 
    AND notes_v2.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create versions of their own notes" ON public.note_versions;
CREATE POLICY "Users can create versions of their own notes" ON public.note_versions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.notes_v2 
    WHERE notes_v2.id = note_versions.note_id 
    AND notes_v2.user_id = auth.uid()
  )
);

-- Enable RLS on reminders table (already has RLS enabled)
-- RLS policies for reminders - drop existing and recreate
DROP POLICY IF EXISTS "Users can view their own reminders" ON public.reminders;
CREATE POLICY "Users can view their own reminders" ON public.reminders
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own reminders" ON public.reminders;
CREATE POLICY "Users can create their own reminders" ON public.reminders
FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own reminders" ON public.reminders;
CREATE POLICY "Users can update their own reminders" ON public.reminders
FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own reminders" ON public.reminders;
CREATE POLICY "Users can delete their own reminders" ON public.reminders
FOR DELETE USING (user_id = auth.uid());

-- Enable RLS on subscribers table
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscribers
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;
CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
CREATE POLICY "Users can update their own subscription" ON public.subscribers
FOR UPDATE USING (user_id = auth.uid());

-- Enable RLS on banners table (already has RLS enabled)
-- RLS policies for banners - drop existing and recreate
DROP POLICY IF EXISTS "Users can view their own banners" ON public.banners;
CREATE POLICY "Users can view their own banners" ON public.banners
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own banners" ON public.banners;
CREATE POLICY "Users can create their own banners" ON public.banners
FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own banners" ON public.banners;
CREATE POLICY "Users can update their own banners" ON public.banners
FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own banners" ON public.banners;
CREATE POLICY "Users can delete their own banners" ON public.banners
FOR DELETE USING (user_id = auth.uid());

-- Enable RLS on project_realms table (already has RLS enabled)
-- RLS policies for project_realms - drop existing and recreate
DROP POLICY IF EXISTS "Users can view their own project realms" ON public.project_realms;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.project_realms;
CREATE POLICY "Users can view their own projects" ON public.project_realms
FOR SELECT USING (creator_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own project realms" ON public.project_realms;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.project_realms;
CREATE POLICY "Users can create their own projects" ON public.project_realms
FOR INSERT WITH CHECK (creator_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own project realms" ON public.project_realms;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.project_realms;
CREATE POLICY "Users can update their own projects" ON public.project_realms
FOR UPDATE USING (creator_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own project realms" ON public.project_realms;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.project_realms;
CREATE POLICY "Users can delete their own projects" ON public.project_realms
FOR DELETE USING (creator_id = auth.uid());

-- Enable RLS on project_agents table (already has RLS enabled)
-- RLS policies for project_agents - drop existing and recreate
DROP POLICY IF EXISTS "Users can view agents of their own projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can view agents for their projects" ON public.project_agents;
CREATE POLICY "Users can view agents for their projects" ON public.project_agents
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.project_realms 
    WHERE project_realms.id = project_agents.project_id 
    AND project_realms.creator_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create agents for their own projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can create agents for their projects" ON public.project_agents;
CREATE POLICY "Users can create agents for their projects" ON public.project_agents
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_realms 
    WHERE project_realms.id = project_agents.project_id 
    AND project_realms.creator_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update agents of their own projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can update agents for their projects" ON public.project_agents;
CREATE POLICY "Users can update agents for their projects" ON public.project_agents
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.project_realms 
    WHERE project_realms.id = project_agents.project_id 
    AND project_realms.creator_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete agents of their own projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can delete agents for their projects" ON public.project_agents;
CREATE POLICY "Users can delete agents for their projects" ON public.project_agents
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.project_realms 
    WHERE project_realms.id = project_agents.project_id 
    AND project_realms.creator_id = auth.uid()
  )
);

-- Enable RLS on user_settings table (already has RLS enabled)
-- RLS policies for user_settings - drop existing and recreate
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
CREATE POLICY "Users can view their own settings" ON public.user_settings
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
CREATE POLICY "Users can update their own settings" ON public.user_settings
FOR UPDATE USING (user_id = auth.uid());

-- Enable RLS on user_profiles table (already has RLS enabled)
-- RLS policies for user_profiles - drop existing and recreate
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile" ON public.user_profiles
FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" ON public.user_profiles
FOR UPDATE USING (id = auth.uid());

-- Enable RLS on notification_preferences table
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification_preferences
DROP POLICY IF EXISTS "Users can view their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can view their own notification preferences" ON public.notification_preferences
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can create their own notification preferences" ON public.notification_preferences
FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can update their own notification preferences" ON public.notification_preferences
FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can delete their own notification preferences" ON public.notification_preferences
FOR DELETE USING (user_id = auth.uid());

-- Enable RLS on ai_copilot_sessions table (already has RLS enabled)
-- RLS policies for ai_copilot_sessions - drop existing and recreate
DROP POLICY IF EXISTS "Users can view their own AI copilot sessions" ON public.ai_copilot_sessions;
CREATE POLICY "Users can view their own AI copilot sessions" ON public.ai_copilot_sessions
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own AI copilot sessions" ON public.ai_copilot_sessions;
CREATE POLICY "Users can create their own AI copilot sessions" ON public.ai_copilot_sessions
FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own AI copilot sessions" ON public.ai_copilot_sessions;
CREATE POLICY "Users can update their own AI copilot sessions" ON public.ai_copilot_sessions
FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own AI copilot sessions" ON public.ai_copilot_sessions;
CREATE POLICY "Users can delete their own AI copilot sessions" ON public.ai_copilot_sessions
FOR DELETE USING (user_id = auth.uid());

-- Enable RLS on sync_queue table
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies for sync_queue
DROP POLICY IF EXISTS "Users can view their own sync queue items" ON public.sync_queue;
CREATE POLICY "Users can view their own sync queue items" ON public.sync_queue
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own sync queue items" ON public.sync_queue;
CREATE POLICY "Users can create their own sync queue items" ON public.sync_queue
FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own sync queue items" ON public.sync_queue;
CREATE POLICY "Users can update their own sync queue items" ON public.sync_queue
FOR UPDATE USING (user_id = auth.uid());

-- Tables that should remain public (analytics, system tables, etc.)
-- page_visits, pwa_analytics, rate_limits, security_incidents, etc. should remain accessible for system functionality

-- Enable RLS on content_moderation but allow admins to view all
ALTER TABLE public.content_moderation ENABLE ROW LEVEL SECURITY;

-- Only admins can access content moderation
DROP POLICY IF EXISTS "Only admins can access content moderation" ON public.content_moderation;
CREATE POLICY "Only admins can access content moderation" ON public.content_moderation
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Security audit log should only be accessible by admins
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can view security audit log" ON public.security_audit_log;
CREATE POLICY "Only admins can view security audit log" ON public.security_audit_log
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Shared notes should be readable by anyone with the link (public sharing)
ALTER TABLE public.shared_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view shared notes" ON public.shared_notes;
CREATE POLICY "Anyone can view shared notes" ON public.shared_notes
FOR SELECT USING (true);
