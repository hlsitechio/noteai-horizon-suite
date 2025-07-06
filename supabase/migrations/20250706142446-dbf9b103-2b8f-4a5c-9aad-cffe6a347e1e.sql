-- Create storage buckets for banner images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banner-images', 'banner-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for banner images bucket
CREATE POLICY "Users can upload their own banner images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'banner-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view all banner images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'banner-images');

CREATE POLICY "Users can update their own banner images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'banner-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own banner images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'banner-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create user_gallery table to track uploaded images
CREATE TABLE public.user_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  title TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  is_banner BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for user_gallery
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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_user_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_gallery_updated_at
BEFORE UPDATE ON public.user_gallery
FOR EACH ROW
EXECUTE FUNCTION public.update_user_gallery_updated_at();