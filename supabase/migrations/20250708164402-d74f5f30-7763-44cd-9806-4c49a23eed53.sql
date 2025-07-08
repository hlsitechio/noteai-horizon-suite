-- Create RLS policies for the onaib1 storage bucket

-- Create policies for the onaib1 bucket to allow users to upload their own files
CREATE POLICY "Users can upload to onaib1 bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'onaib1' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view files in onaib1 bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'onaib1');

CREATE POLICY "Users can update their own files in onaib1 bucket" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'onaib1' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files in onaib1 bucket" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'onaib1' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);