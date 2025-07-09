-- Create AI chat history bucket for storing user chat sessions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'aichat-history', 
  'aichat-history', 
  false, -- Private bucket for user-specific chat history
  5242880, -- 5MB limit per file
  ARRAY[
    'application/json',
    'text/plain',
    'text/json'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create RLS policies for aichat-history bucket (private user access only)
CREATE POLICY "Users can upload their chat history"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'aichat-history' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own chat history"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'aichat-history' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own chat history"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'aichat-history' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own chat history"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'aichat-history' AND
  auth.uid()::text = (storage.foldername(name))[1]
);