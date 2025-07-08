-- Clean up duplicate RLS policies on folders table
-- Keep only the optimized policies and remove duplicates

-- Drop the old duplicate policies
DROP POLICY IF EXISTS "Users can only view their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can only insert their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can only update their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can only delete their own folders" ON public.folders;

-- The optimized policies from the previous migration will remain:
-- "Users can view their own folders" - using (( SELECT auth.uid()) = user_id)
-- "Users can create their own folders" - using (( SELECT auth.uid()) = user_id)  
-- "Users can update their own folders" - using (( SELECT auth.uid()) = user_id)
-- "Users can delete their own folders" - using (( SELECT auth.uid()) = user_id)