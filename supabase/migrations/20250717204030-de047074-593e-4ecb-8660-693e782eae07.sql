-- Create user storage quotas table for tracking Wasabi storage usage
CREATE TABLE IF NOT EXISTS public.user_storage_quotas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  bucket_name text NOT NULL,
  total_quota_mb numeric(10,2) NOT NULL DEFAULT 1024.00,
  used_storage_mb numeric(10,2) NOT NULL DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_quota_check timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_storage_quotas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own storage quota"
  ON public.user_storage_quotas
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own storage quota"
  ON public.user_storage_quotas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own storage quota"
  ON public.user_storage_quotas
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_storage_quotas_updated_at
  BEFORE UPDATE ON public.user_storage_quotas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();