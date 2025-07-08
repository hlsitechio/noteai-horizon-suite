-- Clean up duplicate RLS policies on notes_v2 table
-- Drop the older/less consistently named policies, keep the newer optimized ones

-- Drop duplicate policies for notes_v2
DROP POLICY IF EXISTS "Users can only view their own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can only update their own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can only delete their own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can only insert their own notes" ON public.notes_v2;

-- Drop duplicate policies for user_profiles  
DROP POLICY IF EXISTS "Users can only view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can only update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can only delete their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can only insert their own profile" ON public.user_profiles;

-- Verify that the optimized policies remain in place
-- (These should already exist from previous migrations)
-- Notes policies: "Users can view their own notes", "Users can update their own notes", etc.
-- User profiles policies: "Users can view their own profile", "Users can update their own profile", etc.