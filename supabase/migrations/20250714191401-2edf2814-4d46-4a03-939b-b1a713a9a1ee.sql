-- Fix storage bucket security - ensure proper RLS policies for all buckets
-- First, let's check and fix the user-gallery bucket permissions

-- Create more restrictive policies for user-gallery bucket
CREATE POLICY "Users can only upload to their own folder in user-gallery"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-gallery' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only view their own files in user-gallery"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-gallery' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only update their own files in user-gallery"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-gallery' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only delete their own files in user-gallery"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-gallery' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Fix notes-attachments bucket policies
CREATE POLICY "Users can only upload to their own folder in notes-attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'notes-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only view their own attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'notes-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only update their own attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'notes-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only delete their own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'notes-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Fix aichat-history bucket policies
CREATE POLICY "Users can only upload to their own folder in aichat-history"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'aichat-history' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only view their own chat history"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'aichat-history' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only update their own chat history"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'aichat-history' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only delete their own chat history"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'aichat-history' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Add enhanced security audit logging for storage operations
CREATE OR REPLACE FUNCTION public.log_storage_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    event_type,
    event_data,
    ip_address,
    user_agent,
    timestamp
  ) VALUES (
    auth.uid(),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'STORAGE_UPLOAD'
      WHEN TG_OP = 'UPDATE' THEN 'STORAGE_UPDATE'
      WHEN TG_OP = 'DELETE' THEN 'STORAGE_DELETE'
      ELSE 'STORAGE_ACCESS'
    END,
    jsonb_build_object(
      'bucket_id', COALESCE(NEW.bucket_id, OLD.bucket_id),
      'object_name', COALESCE(NEW.name, OLD.name),
      'operation', TG_OP
    ),
    inet_client_addr()::text,
    current_setting('request.headers')::json->>'user-agent',
    now()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create security audit logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  timestamp timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for security audit logs - only admins can view all logs
CREATE POLICY "Users can view their own security audit logs"
ON public.security_audit_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create trigger for storage access logging
DROP TRIGGER IF EXISTS storage_access_audit_trigger ON storage.objects;
CREATE TRIGGER storage_access_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON storage.objects
  FOR EACH ROW EXECUTE FUNCTION public.log_storage_access();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_event_type ON public.security_audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_timestamp ON public.security_audit_logs(timestamp DESC);