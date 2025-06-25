
-- Create a storage bucket for banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true);

-- Create policies to allow authenticated users to upload their own banners
CREATE POLICY "Users can upload their own banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to view all banners (since they're public)
CREATE POLICY "Anyone can view banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'banners');

-- Create policy to allow users to update their own banners
CREATE POLICY "Users can update their own banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to delete their own banners
CREATE POLICY "Users can delete their own banners"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create a table to store banner metadata
CREATE TABLE public.banners (
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

-- Add Row Level Security (RLS) to ensure users can only see their own banners
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own banners
CREATE POLICY "Users can view their own banners" 
  ON public.banners 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own banners
CREATE POLICY "Users can create their own banners" 
  ON public.banners 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own banners
CREATE POLICY "Users can update their own banners" 
  ON public.banners 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own banners
CREATE POLICY "Users can delete their own banners" 
  ON public.banners 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_banners_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_banners_updated_at();
