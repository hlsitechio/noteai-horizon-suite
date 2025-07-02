-- Fix remaining critical RLS performance issues

-- Fix note_shares table
DROP POLICY IF EXISTS "Users can create their own shares" ON public.note_shares;
DROP POLICY IF EXISTS "Users can delete their own shares" ON public.note_shares;
DROP POLICY IF EXISTS "Users can update their own shares" ON public.note_shares;
DROP POLICY IF EXISTS "Users can view shares they created or received" ON public.note_shares;
DROP POLICY IF EXISTS "Users can manage shares of own notes" ON public.note_shares;
DROP POLICY IF EXISTS "Users can view shares of own notes" ON public.note_shares;

CREATE POLICY "note_shares_optimized_policy" ON public.note_shares
FOR ALL
TO public
USING (
  shared_by = (SELECT auth.uid()) OR 
  shared_with = (SELECT auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM notes_v2 
    WHERE notes_v2.id = note_shares.note_id 
    AND notes_v2.user_id = (SELECT auth.uid())
  )
)
WITH CHECK (shared_by = (SELECT auth.uid()));

-- Fix project_realms table
DROP POLICY IF EXISTS "Users can create their own projects" ON public.project_realms;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.project_realms;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.project_realms;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.project_realms;

CREATE POLICY "project_realms_optimized_policy" ON public.project_realms
FOR ALL
TO public
USING (creator_id = (SELECT auth.uid()))
WITH CHECK (creator_id = (SELECT auth.uid()));

-- Fix project_agents table
DROP POLICY IF EXISTS "Users can create agents for their projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can delete agents for their projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can delete agents of their projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can update agents for their projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can update agents of their projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can view agents for their projects" ON public.project_agents;
DROP POLICY IF EXISTS "Users can view agents of their projects" ON public.project_agents;

CREATE POLICY "project_agents_optimized_policy" ON public.project_agents
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM project_realms 
    WHERE project_realms.id = project_agents.project_id 
    AND project_realms.creator_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM project_realms 
    WHERE project_realms.id = project_agents.project_id 
    AND project_realms.creator_id = (SELECT auth.uid())
  )
);

-- Fix note_versions table
DROP POLICY IF EXISTS "Users can create versions of their own notes" ON public.note_versions;
DROP POLICY IF EXISTS "Users can insert versions of own notes" ON public.note_versions;
DROP POLICY IF EXISTS "Users can view versions of own notes" ON public.note_versions;
DROP POLICY IF EXISTS "Users can view versions of their own notes" ON public.note_versions;

CREATE POLICY "note_versions_optimized_policy" ON public.note_versions
FOR ALL
TO public
USING (
  created_by = (SELECT auth.uid()) OR
  EXISTS (
    SELECT 1 FROM notes_v2 
    WHERE notes_v2.id = note_versions.note_id 
    AND notes_v2.user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  created_by = (SELECT auth.uid()) OR
  EXISTS (
    SELECT 1 FROM notes_v2 
    WHERE notes_v2.id = note_versions.note_id 
    AND notes_v2.user_id = (SELECT auth.uid())
  )
);

-- Fix user profiles and settings tables
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_policy" ON public.user_profiles;

CREATE POLICY "user_profiles_optimized_policy" ON public.user_profiles
FOR ALL
TO public
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

-- Fix user_settings
DROP POLICY IF EXISTS "Users can manage own settings" ON public.user_settings;
DROP POLICY IF EXISTS "user_settings_delete_policy" ON public.user_settings;
DROP POLICY IF EXISTS "user_settings_insert_policy" ON public.user_settings;
DROP POLICY IF EXISTS "user_settings_select_policy" ON public.user_settings;
DROP POLICY IF EXISTS "user_settings_update_policy" ON public.user_settings;

CREATE POLICY "user_settings_optimized_policy" ON public.user_settings
FOR ALL
TO public
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

-- Fix notification_preferences
DROP POLICY IF EXISTS "Users can create their own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can delete their own notification preferences" ON public.notification_preferences;

CREATE POLICY "notification_preferences_optimized_policy" ON public.notification_preferences
FOR ALL
TO public
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

-- Fix sync_queue
DROP POLICY IF EXISTS "Users can create their own sync queue items" ON public.sync_queue;
DROP POLICY IF EXISTS "Users can manage own sync queue" ON public.sync_queue;
DROP POLICY IF EXISTS "Users can update their own sync queue items" ON public.sync_queue;
DROP POLICY IF EXISTS "Users can view their own sync queue items" ON public.sync_queue;

CREATE POLICY "sync_queue_optimized_policy" ON public.sync_queue
FOR ALL
TO public
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

-- Fix subscribers table (keep auth.email() optimization since it's already optimal)
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
TO public
USING (user_id = (SELECT auth.uid()) OR email = (SELECT auth.email()));

-- Add optimization comments
COMMENT ON TABLE public.note_shares IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.project_realms IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.project_agents IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.note_versions IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.user_profiles IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.user_settings IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.notification_preferences IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.sync_queue IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.subscribers IS 'RLS policies optimized with subqueries for auth functions';