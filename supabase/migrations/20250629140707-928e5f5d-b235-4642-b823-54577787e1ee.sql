
-- Drop the existing RLS policy first
DROP POLICY IF EXISTS "Users can view own notes" ON public.notes_v2;

-- Create an optimized RLS policy that evaluates auth.uid() only once per query
CREATE POLICY "Users can view own notes" ON public.notes_v2
FOR SELECT
USING (user_id = (SELECT auth.uid()));

-- Also optimize other policies if they exist
DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes_v2;
CREATE POLICY "Users can create their own notes" ON public.notes_v2
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes_v2;
CREATE POLICY "Users can update their own notes" ON public.notes_v2
FOR UPDATE
USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes_v2;
CREATE POLICY "Users can delete their own notes" ON public.notes_v2
FOR DELETE
USING (user_id = (SELECT auth.uid()));
