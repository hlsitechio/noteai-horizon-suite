
-- Comprehensive RLS optimization to resolve Auth RLS Initialization Plan warnings
-- This addresses all 44 warnings by optimizing RLS policies to use subqueries instead of direct auth.uid() calls

-- Optimize AI-related table policies
DROP POLICY IF EXISTS "Users can view their own AI interactions" ON public.ai_interactions;
CREATE POLICY "Users can view their own AI interactions" 
  ON public.ai_interactions 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own AI interactions" ON public.ai_interactions;
CREATE POLICY "Users can create their own AI interactions" 
  ON public.ai_interactions 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view their own AI interactions v2" ON public.ai_interactions_v2;
CREATE POLICY "Users can view their own AI interactions v2" 
  ON public.ai_interactions_v2 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own AI interactions v2" ON public.ai_interactions_v2;
CREATE POLICY "Users can create their own AI interactions v2" 
  ON public.ai_interactions_v2 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view their own AI usage tracking" ON public.ai_usage_tracking;
CREATE POLICY "Users can view their own AI usage tracking" 
  ON public.ai_usage_tracking 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own AI usage tracking" ON public.ai_usage_tracking;
CREATE POLICY "Users can create their own AI usage tracking" 
  ON public.ai_usage_tracking 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view their own AI copilot sessions" ON public.ai_copilot_sessions;
CREATE POLICY "Users can view their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own AI copilot sessions" ON public.ai_copilot_sessions;
CREATE POLICY "Users can create their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own AI copilot sessions" ON public.ai_copilot_sessions;
CREATE POLICY "Users can update their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own AI copilot sessions" ON public.ai_copilot_sessions;
CREATE POLICY "Users can delete their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

-- Optimize notes table policies
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes_v2;
CREATE POLICY "Users can view their own notes" 
  ON public.notes_v2 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes_v2;
CREATE POLICY "Users can create their own notes" 
  ON public.notes_v2 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes_v2;
CREATE POLICY "Users can update their own notes" 
  ON public.notes_v2 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes_v2;
CREATE POLICY "Users can delete their own notes" 
  ON public.notes_v2 
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

-- Optimize legacy notes table policies
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
CREATE POLICY "Users can view their own notes" 
  ON public.notes 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes;
CREATE POLICY "Users can create their own notes" 
  ON public.notes 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
CREATE POLICY "Users can update their own notes" 
  ON public.notes 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
CREATE POLICY "Users can delete their own notes" 
  ON public.notes 
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

-- Optimize folders policies
DROP POLICY IF EXISTS "Users can view their own folders" ON public.folders;
CREATE POLICY "Users can view their own folders" 
  ON public.folders 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own folders" ON public.folders;
CREATE POLICY "Users can create their own folders" 
  ON public.folders 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own folders" ON public.folders;
CREATE POLICY "Users can update their own folders" 
  ON public.folders 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own folders" ON public.folders;
CREATE POLICY "Users can delete their own folders" 
  ON public.folders 
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

-- Optimize user profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (id = (SELECT auth.uid()));

-- Optimize user settings policies
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
CREATE POLICY "Users can insert their own settings" 
  ON public.user_settings 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Optimize sharing and collaboration policies
DROP POLICY IF EXISTS "Users can view their own note shares" ON public.note_shares;
CREATE POLICY "Users can view their own note shares" 
  ON public.note_shares 
  FOR SELECT 
  USING (shared_by = (SELECT auth.uid()) OR shared_with = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own note shares" ON public.note_shares;
CREATE POLICY "Users can create their own note shares" 
  ON public.note_shares 
  FOR INSERT 
  WITH CHECK (shared_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own note shares" ON public.note_shares;
CREATE POLICY "Users can update their own note shares" 
  ON public.note_shares 
  FOR UPDATE 
  USING (shared_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own note shares" ON public.note_shares;
CREATE POLICY "Users can delete their own note shares" 
  ON public.note_shares 
  FOR DELETE 
  USING (shared_by = (SELECT auth.uid()));

-- Optimize note versions policies
DROP POLICY IF EXISTS "Users can view their own note versions" ON public.note_versions;
CREATE POLICY "Users can view their own note versions" 
  ON public.note_versions 
  FOR SELECT 
  USING (created_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own note versions" ON public.note_versions;
CREATE POLICY "Users can create their own note versions" 
  ON public.note_versions 
  FOR INSERT 
  WITH CHECK (created_by = (SELECT auth.uid()));

-- Optimize sync queue policies
DROP POLICY IF EXISTS "Users can view their own sync queue" ON public.sync_queue;
CREATE POLICY "Users can view their own sync queue" 
  ON public.sync_queue 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own sync queue" ON public.sync_queue;
CREATE POLICY "Users can create their own sync queue" 
  ON public.sync_queue 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own sync queue" ON public.sync_queue;
CREATE POLICY "Users can update their own sync queue" 
  ON public.sync_queue 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own sync queue" ON public.sync_queue;
CREATE POLICY "Users can delete their own sync queue" 
  ON public.sync_queue 
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

-- Optimize notification preferences policies
DROP POLICY IF EXISTS "Users can view their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can view their own notification preferences" 
  ON public.notification_preferences 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can update their own notification preferences" 
  ON public.notification_preferences 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can insert their own notification preferences" 
  ON public.notification_preferences 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Optimize reminders policies
DROP POLICY IF EXISTS "Users can view their own reminders" ON public.reminders;
CREATE POLICY "Users can view their own reminders" 
  ON public.reminders 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own reminders" ON public.reminders;
CREATE POLICY "Users can create their own reminders" 
  ON public.reminders 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own reminders" ON public.reminders;
CREATE POLICY "Users can update their own reminders" 
  ON public.reminders 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own reminders" ON public.reminders;
CREATE POLICY "Users can delete their own reminders" 
  ON public.reminders 
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

-- Optimize banners policies
DROP POLICY IF EXISTS "Users can view their own banners" ON public.banners;
CREATE POLICY "Users can view their own banners" 
  ON public.banners 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own banners" ON public.banners;
CREATE POLICY "Users can create their own banners" 
  ON public.banners 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own banners" ON public.banners;
CREATE POLICY "Users can update their own banners" 
  ON public.banners 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own banners" ON public.banners;
CREATE POLICY "Users can delete their own banners" 
  ON public.banners 
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

-- Optimize project realms policies
DROP POLICY IF EXISTS "Users can view their own project realms" ON public.project_realms;
CREATE POLICY "Users can view their own project realms" 
  ON public.project_realms 
  FOR SELECT 
  USING (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own project realms" ON public.project_realms;
CREATE POLICY "Users can create their own project realms" 
  ON public.project_realms 
  FOR INSERT 
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own project realms" ON public.project_realms;
CREATE POLICY "Users can update their own project realms" 
  ON public.project_realms 
  FOR UPDATE 
  USING (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own project realms" ON public.project_realms;
CREATE POLICY "Users can delete their own project realms" 
  ON public.project_realms 
  FOR DELETE 
  USING (creator_id = (SELECT auth.uid()));

-- Optimize project agents policies
DROP POLICY IF EXISTS "Users can view their own project agents" ON public.project_agents;
CREATE POLICY "Users can view their own project agents" 
  ON public.project_agents 
  FOR SELECT 
  USING (project_id IN (
    SELECT id FROM public.project_realms WHERE creator_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can create their own project agents" ON public.project_agents;
CREATE POLICY "Users can create their own project agents" 
  ON public.project_agents 
  FOR INSERT 
  WITH CHECK (project_id IN (
    SELECT id FROM public.project_realms WHERE creator_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update their own project agents" ON public.project_agents;
CREATE POLICY "Users can update their own project agents" 
  ON public.project_agents 
  FOR UPDATE 
  USING (project_id IN (
    SELECT id FROM public.project_realms WHERE creator_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete their own project agents" ON public.project_agents;
CREATE POLICY "Users can delete their own project agents" 
  ON public.project_agents 
  FOR DELETE 
  USING (project_id IN (
    SELECT id FROM public.project_realms WHERE creator_id = (SELECT auth.uid())
  ));

-- Optimize subscribers policies
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;
CREATE POLICY "Users can view their own subscription" 
  ON public.subscribers 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
CREATE POLICY "Users can update their own subscription" 
  ON public.subscribers 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
CREATE POLICY "Users can insert their own subscription" 
  ON public.subscribers 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));
