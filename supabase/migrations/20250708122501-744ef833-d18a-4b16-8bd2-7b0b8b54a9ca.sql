-- Optimize RLS policies to prevent re-evaluation of auth.uid() for each row
-- This improves query performance at scale

-- Drop existing policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Create optimized policies for user_profiles
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK ((SELECT auth.uid()) = id);

-- Drop existing policies for folders
DROP POLICY IF EXISTS "Users can view their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can create their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON public.folders;

-- Create optimized policies for folders
CREATE POLICY "Users can view their own folders" 
ON public.folders 
FOR SELECT 
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own folders" 
ON public.folders 
FOR INSERT 
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own folders" 
ON public.folders 
FOR UPDATE 
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own folders" 
ON public.folders 
FOR DELETE 
USING ((SELECT auth.uid()) = user_id);

-- Drop existing policies for notes_v2
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes_v2;

-- Create optimized policies for notes_v2
CREATE POLICY "Users can view their own notes" 
ON public.notes_v2 
FOR SELECT 
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own notes" 
ON public.notes_v2 
FOR INSERT 
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own notes" 
ON public.notes_v2 
FOR UPDATE 
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own notes" 
ON public.notes_v2 
FOR DELETE 
USING ((SELECT auth.uid()) = user_id);