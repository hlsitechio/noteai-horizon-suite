
-- Ensure the banners storage bucket exists with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners', 
  'banners', 
  true, 
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'video/mp4',
    'video/avi',
    'video/quicktime',
    'video/x-msvideo'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own banners" ON storage.objects;

-- Create comprehensive storage policies for automatic banner management
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
)
WITH CHECK (
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

-- Ensure the banners table has proper RLS policies for automatic banner management
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own banners" ON public.banners;
DROP POLICY IF EXISTS "Users can create their own banners" ON public.banners;
DROP POLICY IF EXISTS "Users can update their own banners" ON public.banners;
DROP POLICY IF EXISTS "Users can delete their own banners" ON public.banners;

-- Create RLS policies for the banners table
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
