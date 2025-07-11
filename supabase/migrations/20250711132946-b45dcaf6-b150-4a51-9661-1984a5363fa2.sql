-- Create Google Drive integration settings table
CREATE TABLE public.google_drive_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  drive_folder_id TEXT,
  sync_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.google_drive_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own Google Drive settings" 
ON public.google_drive_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Google Drive settings" 
ON public.google_drive_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Google Drive settings" 
ON public.google_drive_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Google Drive settings" 
ON public.google_drive_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_google_drive_settings_updated_at
BEFORE UPDATE ON public.google_drive_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();