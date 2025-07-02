-- Fix RLS performance issues on public.data table
-- Replace direct auth function calls with subqueries for better performance

-- Drop existing policies
DROP POLICY IF EXISTS "insert_policy" ON public.data;
DROP POLICY IF EXISTS "select_policy" ON public.data;
DROP POLICY IF EXISTS "update_policy" ON public.data;
DROP POLICY IF EXISTS "delete_policy" ON public.data;

-- Recreate policies with optimized auth function calls
CREATE POLICY "insert_policy" ON public.data
FOR INSERT
TO public
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "select_policy" ON public.data
FOR SELECT
TO public
USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "update_policy" ON public.data
FOR UPDATE
TO public
USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "delete_policy" ON public.data
FOR DELETE
TO public
USING (true);

-- Add comment documenting the optimization
COMMENT ON TABLE public.data IS 'RLS policies optimized to use subqueries for auth functions to improve performance at scale.';