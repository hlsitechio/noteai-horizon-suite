
-- First, let's check and update the RLS policies for ai_interactions table
-- Replace direct auth.uid() calls with subquery to improve performance

-- Drop existing policies that might have performance issues
DROP POLICY IF EXISTS "Users can view their own AI interactions" ON public.ai_interactions;
DROP POLICY IF EXISTS "Users can create their own AI interactions" ON public.ai_interactions;
DROP POLICY IF EXISTS "Users can insert their own AI interactions" ON public.ai_interactions;

-- Create optimized RLS policies with subquery pattern
CREATE POLICY "Users can view their own AI interactions" 
  ON public.ai_interactions 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own AI interactions" 
  ON public.ai_interactions 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Also optimize ai_interactions_v2 table policies
DROP POLICY IF EXISTS "Users can view their own AI interactions v2" ON public.ai_interactions_v2;
DROP POLICY IF EXISTS "Users can create their own AI interactions v2" ON public.ai_interactions_v2;

CREATE POLICY "Users can view their own AI interactions v2" 
  ON public.ai_interactions_v2 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own AI interactions v2" 
  ON public.ai_interactions_v2 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Also optimize ai_usage_tracking table policies
DROP POLICY IF EXISTS "Users can view their own AI usage tracking" ON public.ai_usage_tracking;
DROP POLICY IF EXISTS "Users can create their own AI usage tracking" ON public.ai_usage_tracking;

CREATE POLICY "Users can view their own AI usage tracking" 
  ON public.ai_usage_tracking 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own AI usage tracking" 
  ON public.ai_usage_tracking 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Optimize ai_copilot_sessions policies as well
DROP POLICY IF EXISTS "Users can view their own AI copilot sessions" ON public.ai_copilot_sessions;
DROP POLICY IF EXISTS "Users can create their own AI copilot sessions" ON public.ai_copilot_sessions;
DROP POLICY IF EXISTS "Users can update their own AI copilot sessions" ON public.ai_copilot_sessions;
DROP POLICY IF EXISTS "Users can delete their own AI copilot sessions" ON public.ai_copilot_sessions;

CREATE POLICY "Users can view their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));
