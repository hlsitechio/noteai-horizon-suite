-- Create organized storage buckets for different file types

-- Dashboard banners bucket (images and videos for dashboard backgrounds)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dashboard-banners', 
  'dashboard-banners', 
  true, 
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Project banners bucket (project-specific banner images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-banners', 
  'project-banners', 
  true, 
  20971520, -- 20MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- User gallery bucket (general user uploaded images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-gallery', 
  'user-gallery', 
  true, 
  10485760, -- 10MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Notes attachments bucket (for file attachments in notes)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'notes-attachments', 
  'notes-attachments', 
  false, -- Private bucket for user-specific notes
  25165824, -- 25MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mpeg',
    'audio/wav',
    'video/mp4',
    'video/webm'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Banner videos bucket (high-quality videos up to 4K)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banner-videos', 
  'banner-videos', 
  true, 
  209715200, -- 200MB limit for 4K videos
  ARRAY[
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/avi',
    'video/x-msvideo'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create RLS policies for dashboard-banners bucket
CREATE POLICY "Users can upload dashboard banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dashboard-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view dashboard banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'dashboard-banners');

CREATE POLICY "Users can update their dashboard banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dashboard-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their dashboard banners"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'dashboard-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create RLS policies for project-banners bucket
CREATE POLICY "Users can upload project banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view project banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-banners');

CREATE POLICY "Users can update their project banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their project banners"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create RLS policies for user-gallery bucket
CREATE POLICY "Users can upload to user gallery"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-gallery' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view user gallery"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'user-gallery');

CREATE POLICY "Users can update their gallery images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-gallery' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their gallery images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-gallery' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create RLS policies for notes-attachments bucket (private)
CREATE POLICY "Users can upload notes attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'notes-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their notes attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'notes-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their notes attachments"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'notes-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their notes attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'notes-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create RLS policies for banner-videos bucket
CREATE POLICY "Users can upload banner videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banner-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view banner videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'banner-videos');

CREATE POLICY "Users can update their banner videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banner-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their banner videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'banner-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);