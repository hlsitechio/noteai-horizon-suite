-- Create user activities table for tracking user actions
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  activity_title TEXT NOT NULL,
  activity_description TEXT,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own activities" 
ON public.user_activities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
ON public.user_activities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" 
ON public.user_activities 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" 
ON public.user_activities 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_user_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_activities_updated_at
BEFORE UPDATE ON public.user_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_user_activities_updated_at();

-- Create index for better performance
CREATE INDEX idx_user_activities_user_id_created_at ON public.user_activities(user_id, created_at DESC);
CREATE INDEX idx_user_activities_entity ON public.user_activities(entity_type, entity_id);