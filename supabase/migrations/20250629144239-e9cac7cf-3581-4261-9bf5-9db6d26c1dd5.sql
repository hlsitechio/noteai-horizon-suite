
-- Comprehensive security audit and fixes for remaining warnings
-- This migration addresses missing RLS policies, indexes, and security configurations

-- First, let's ensure all tables that should have RLS actually have it enabled
-- Some tables might have been missed in previous migrations

-- Enable RLS on any remaining tables that don't have it
DO $$
BEGIN
    -- Check and enable RLS on tables that might be missing it
    IF NOT (SELECT pg_class.relrowsecurity FROM pg_class WHERE relname = 'ai_interactions') THEN
        ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT pg_class.relrowsecurity FROM pg_class WHERE relname = 'notes') THEN
        ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Add missing RLS policies for ai_interactions table
DROP POLICY IF EXISTS "Users can view their own AI interactions" ON public.ai_interactions;
CREATE POLICY "Users can view their own AI interactions" ON public.ai_interactions
FOR SELECT USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own AI interactions" ON public.ai_interactions;
CREATE POLICY "Users can create their own AI interactions" ON public.ai_interactions
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own AI interactions" ON public.ai_interactions;
CREATE POLICY "Users can update their own AI interactions" ON public.ai_interactions
FOR UPDATE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own AI interactions" ON public.ai_interactions;
CREATE POLICY "Users can delete their own AI interactions" ON public.ai_interactions
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Add missing RLS policies for notes table
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
CREATE POLICY "Users can view their own notes" ON public.notes
FOR SELECT USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes;
CREATE POLICY "Users can create their own notes" ON public.notes
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
CREATE POLICY "Users can update their own notes" ON public.notes
FOR UPDATE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
CREATE POLICY "Users can delete their own notes" ON public.notes
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Add performance indexes for frequently queried columns
-- These indexes will help with RLS policy performance

-- Index for user_id columns (most important for RLS performance)
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_id ON public.notes_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON public.folders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_banners_user_id ON public.banners(user_id);
CREATE INDEX IF NOT EXISTS idx_project_realms_creator_id ON public.project_realms(creator_id);
CREATE INDEX IF NOT EXISTS idx_ai_copilot_sessions_user_id ON public.ai_copilot_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_user_id ON public.sync_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_user_id ON public.ai_usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON public.ai_interactions(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_interactions_v2_user_id ON public.ai_interactions_v2(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_note_shares_shared_by ON public.note_shares(shared_by) WHERE shared_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_note_shares_shared_with ON public.note_shares(shared_with) WHERE shared_with IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_note_versions_note_id ON public.note_versions(note_id) WHERE note_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id) WHERE user_id IS NOT NULL;

-- Add indexes for commonly filtered datetime columns
CREATE INDEX IF NOT EXISTS idx_notes_v2_created_at ON public.notes_v2(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_v2_updated_at ON public.notes_v2(updated_at);
CREATE INDEX IF NOT EXISTS idx_reminders_reminder_date ON public.reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON public.reminders(status);
CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON public.page_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_date ON public.ai_usage_tracking(date);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_folder ON public.notes_v2(user_id, folder_id) WHERE folder_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reminders_user_status ON public.reminders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_user_date ON public.ai_usage_tracking(user_id, date);

-- Ensure foreign key constraints are properly indexed
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON public.folders(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notes_v2_folder_id ON public.notes_v2(folder_id) WHERE folder_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reminders_note_id ON public.reminders(note_id);
CREATE INDEX IF NOT EXISTS idx_project_agents_project_id ON public.project_agents(project_id);

-- Add helpful comments to tables for documentation
COMMENT ON TABLE public.notes_v2 IS 'Main notes table with full RLS security enabled';
COMMENT ON TABLE public.folders IS 'User folders with hierarchical support and RLS security';
COMMENT ON TABLE public.reminders IS 'User reminders linked to notes with RLS security';
COMMENT ON TABLE public.ai_interactions_v2 IS 'AI interaction history with user-based access control';
COMMENT ON TABLE public.user_profiles IS 'User profile data with self-access only';
COMMENT ON TABLE public.user_settings IS 'User-specific application settings with RLS';

-- Ensure proper grants for authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes_v2 TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.folders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_interactions_v2 TO authenticated;
GRANT SELECT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, UPDATE ON public.user_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_preferences TO authenticated;
GRANT SELECT, UPDATE ON public.subscribers TO authenticated;

-- Revoke unnecessary permissions from anon users on sensitive tables
REVOKE ALL ON public.security_audit_log FROM anon;
REVOKE ALL ON public.security_incidents FROM anon;
REVOKE ALL ON public.user_roles FROM anon;
REVOKE ALL ON public.cron_job_logs FROM anon;
REVOKE ALL ON public.security_settings FROM anon;

-- Add triggers for updated_at columns where missing
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to tables that might be missing them
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscribers_updated_at ON public.subscribers;
CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON public.notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update table statistics to help query planner
ANALYZE public.notes_v2;
ANALYZE public.folders;
ANALYZE public.reminders;
ANALYZE public.ai_interactions_v2;
ANALYZE public.user_profiles;
ANALYZE public.user_settings;
