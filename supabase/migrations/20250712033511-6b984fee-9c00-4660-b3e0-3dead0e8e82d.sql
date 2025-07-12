-- Create user-specific private media storage policies

-- Update user-gallery bucket policies for workspace integration
CREATE POLICY "Users can view their own gallery items in workspace" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'user-gallery' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload to their own gallery workspace" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'user-gallery' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own gallery workspace items" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'user-gallery' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own gallery workspace items" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'user-gallery' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Update notes-attachments bucket policies for workspace integration
CREATE POLICY "Users can view their own note attachments in workspace" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'notes-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload note attachments to their workspace" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'notes-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own note attachments in workspace" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'notes-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own note attachments in workspace" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'notes-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Update dashboard banner storage to use workspace-specific paths
CREATE POLICY "Users can view their workspace banners" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'dashboard-banners' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload banners to their workspace" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'dashboard-banners' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their workspace banners" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'dashboard-banners' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their workspace banners" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'dashboard-banners' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Update banner videos storage for workspace integration
CREATE POLICY "Users can view their workspace banner videos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'banner-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload banner videos to their workspace" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'banner-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their workspace banner videos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'banner-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their workspace banner videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'banner-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);