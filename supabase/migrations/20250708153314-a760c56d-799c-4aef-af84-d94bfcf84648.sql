-- Test and fix RLS policies for user_gallery table

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own gallery images" ON public.user_gallery;
DROP POLICY IF EXISTS "Users can create their own gallery images" ON public.user_gallery;
DROP POLICY IF EXISTS "Users can update their own gallery images" ON public.user_gallery;
DROP POLICY IF EXISTS "Users can delete their own gallery images" ON public.user_gallery;

-- Recreate policies with explicit auth.uid() casting
CREATE POLICY "Users can view their own gallery images" 
ON public.user_gallery 
FOR SELECT 
USING (auth.uid()::uuid = user_id::uuid);

CREATE POLICY "Users can create their own gallery images" 
ON public.user_gallery 
FOR INSERT 
WITH CHECK (auth.uid()::uuid = user_id::uuid);

CREATE POLICY "Users can update their own gallery images" 
ON public.user_gallery 
FOR UPDATE 
USING (auth.uid()::uuid = user_id::uuid);

CREATE POLICY "Users can delete their own gallery images" 
ON public.user_gallery 
FOR DELETE 
USING (auth.uid()::uuid = user_id::uuid);

-- Make sure RLS is enabled
ALTER TABLE public.user_gallery ENABLE ROW LEVEL SECURITY;