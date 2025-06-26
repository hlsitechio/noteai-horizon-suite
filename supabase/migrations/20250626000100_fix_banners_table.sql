
-- Ensure the banners table exists with proper structure
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  banner_type TEXT NOT NULL CHECK (banner_type IN ('dashboard', 'project')),
  project_id TEXT, -- Only used for project banners
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, banner_type, project_id)
);

-- Enable Row Level Security
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own banners" ON public.banners;
DROP POLICY IF EXISTS "Users can create their own banners" ON public.banners;
DROP POLICY IF EXISTS "Users can update their own banners" ON public.banners;
DROP POLICY IF EXISTS "Users can delete their own banners" ON public.banners;

-- Create RLS policies
CREATE POLICY "Users can view their own banners" 
  ON public.banners 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own banners" 
  ON public.banners 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own banners" 
  ON public.banners 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own banners" 
  ON public.banners 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION public.update_banners_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS banners_updated_at ON public.banners;
CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_banners_updated_at();

-- Ensure the storage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Users can upload their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own banners" ON storage.objects;

CREATE POLICY "Users can upload their own banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'banners');

CREATE POLICY "Users can update their own banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own banners"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
