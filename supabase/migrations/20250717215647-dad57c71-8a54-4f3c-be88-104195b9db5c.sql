-- Create user_storage_initialization table to track setup progress
CREATE TABLE IF NOT EXISTS public.user_storage_initialization (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wasabi_bucket_created BOOLEAN DEFAULT false,
  wasabi_bucket_name TEXT,
  default_workspace_created BOOLEAN DEFAULT false,
  storage_quota_set BOOLEAN DEFAULT false,
  initialization_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_user_storage_init_user UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_storage_initialization ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own storage initialization" 
ON public.user_storage_initialization 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own storage initialization" 
ON public.user_storage_initialization 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create storage initialization records" 
ON public.user_storage_initialization 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_storage_initialization_updated_at
BEFORE UPDATE ON public.user_storage_initialization
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();