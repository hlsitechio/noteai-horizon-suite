-- Fix RLS policies for dashboard_components table to improve performance
-- Replace direct auth.uid() calls with (select auth.uid()) to avoid re-evaluation per row

-- Fix the INSERT policy
ALTER POLICY "Users can create their own dashboard components" 
ON public.dashboard_components
WITH CHECK ((select auth.uid()) = user_id);

-- Fix the DELETE policy
ALTER POLICY "Users can delete their own dashboard components" 
ON public.dashboard_components
USING ((select auth.uid()) = user_id);

-- Fix the UPDATE policy
ALTER POLICY "Users can update their own dashboard components" 
ON public.dashboard_components
USING ((select auth.uid()) = user_id);

-- Fix the SELECT policy
ALTER POLICY "Users can view their own dashboard components" 
ON public.dashboard_components
USING ((select auth.uid()) = user_id);