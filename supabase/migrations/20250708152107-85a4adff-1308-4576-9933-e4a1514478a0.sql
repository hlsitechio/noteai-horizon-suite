-- Create user_gallery table for image storage if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  description TEXT,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own gallery images" 
ON public.user_gallery 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gallery images" 
ON public.user_gallery 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gallery images" 
ON public.user_gallery 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gallery images" 
ON public.user_gallery 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_gallery_updated_at
BEFORE UPDATE ON public.user_gallery
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();