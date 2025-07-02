-- Comprehensive RLS Performance Optimization
-- Fix all direct auth function calls to use subqueries for better performance at scale

-- Fix ai_interactions table
DROP POLICY IF EXISTS "ai_interactions_insert_policy" ON public.ai_interactions;
DROP POLICY IF EXISTS "ai_interactions_select_policy" ON public.ai_interactions;

CREATE POLICY "ai_interactions_insert_policy" ON public.ai_interactions
FOR INSERT
TO public
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "ai_interactions_select_policy" ON public.ai_interactions
FOR SELECT
TO public
USING (user_id = (SELECT auth.uid()));

-- Fix ai_interactions_v2 table
DROP POLICY IF EXISTS "Users can insert own AI interactions" ON public.ai_interactions_v2;
DROP POLICY IF EXISTS "Users can insert their own AI interactions" ON public.ai_interactions_v2;
DROP POLICY IF EXISTS "Users can view own AI interactions" ON public.ai_interactions_v2;
DROP POLICY IF EXISTS "Users can view their own AI interactions" ON public.ai_interactions_v2;
DROP POLICY IF EXISTS "ai_interactions_v2_insert_policy" ON public.ai_interactions_v2;
DROP POLICY IF EXISTS "ai_interactions_v2_select_policy" ON public.ai_interactions_v2;

CREATE POLICY "ai_interactions_v2_insert_policy" ON public.ai_interactions_v2
FOR INSERT
TO public
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "ai_interactions_v2_select_policy" ON public.ai_interactions_v2
FOR SELECT
TO public
USING (user_id = (SELECT auth.uid()));

-- Fix ai_usage_tracking table
DROP POLICY IF EXISTS "Users can insert their own usage tracking" ON public.ai_usage_tracking;
DROP POLICY IF EXISTS "Users can view their own usage tracking" ON public.ai_usage_tracking;
DROP POLICY IF EXISTS "users_insert_own_usage" ON public.ai_usage_tracking;
DROP POLICY IF EXISTS "users_view_own_usage" ON public.ai_usage_tracking;

CREATE POLICY "users_insert_own_usage" ON public.ai_usage_tracking
FOR INSERT
TO public
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "users_view_own_usage" ON public.ai_usage_tracking
FOR SELECT
TO public
USING (user_id = (SELECT auth.uid()));

-- Fix notes table (remove duplicate policies with direct auth calls)
DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
DROP POLICY IF EXISTS "authenticated_users_delete_own_notes" ON public.notes;
DROP POLICY IF EXISTS "authenticated_users_insert_own_notes" ON public.notes;
DROP POLICY IF EXISTS "authenticated_users_select_own_notes" ON public.notes;
DROP POLICY IF EXISTS "authenticated_users_update_own_notes" ON public.notes;
DROP POLICY IF EXISTS "notes_delete_policy" ON public.notes;
DROP POLICY IF EXISTS "notes_insert_policy" ON public.notes;
DROP POLICY IF EXISTS "notes_select_policy" ON public.notes;
DROP POLICY IF EXISTS "notes_update_policy" ON public.notes;

-- Keep only the optimized policies
CREATE POLICY "notes_insert_policy" ON public.notes
FOR INSERT
TO public
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "notes_select_policy" ON public.notes
FOR SELECT
TO public
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "notes_update_policy" ON public.notes
FOR UPDATE
TO public
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "notes_delete_policy" ON public.notes
FOR DELETE
TO public
USING (user_id = (SELECT auth.uid()));

-- Fix notes_v2 table
DROP POLICY IF EXISTS "Users can delete own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can delete their own notes v2" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can insert own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can insert their own notes v2" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can update own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can update their own notes v2" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can view their own notes v2" ON public.notes_v2;

-- Keep optimized policies for notes_v2
CREATE POLICY "notes_v2_crud_policy" ON public.notes_v2
FOR ALL
TO public
USING (user_id = (SELECT auth.uid()) OR is_public = true)
WITH CHECK (user_id = (SELECT auth.uid()));

-- Add optimization comments
COMMENT ON TABLE public.ai_interactions IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.ai_interactions_v2 IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.ai_usage_tracking IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.notes IS 'RLS policies optimized with subqueries for auth functions';
COMMENT ON TABLE public.notes_v2 IS 'RLS policies optimized with subqueries for auth functions';