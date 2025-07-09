-- Fix RLS policies for dashboard_layouts table to improve performance
-- Replace direct auth.uid() calls with (select auth.uid()) to avoid re-evaluation per row

-- Fix the INSERT policy
ALTER POLICY "Users can create their own dashboard layouts" 
ON public.dashboard_layouts
WITH CHECK ((select auth.uid()) = user_id);

-- Fix the DELETE policy
ALTER POLICY "Users can delete their own dashboard layouts" 
ON public.dashboard_layouts
USING ((select auth.uid()) = user_id);

-- Fix the UPDATE policy
ALTER POLICY "Users can update their own dashboard layouts" 
ON public.dashboard_layouts
USING ((select auth.uid()) = user_id);

-- Fix the SELECT policy
ALTER POLICY "Users can view their own dashboard layouts" 
ON public.dashboard_layouts
USING ((select auth.uid()) = user_id);