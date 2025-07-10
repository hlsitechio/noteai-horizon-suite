-- Add weather settings to user preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN weather_enabled boolean DEFAULT true,
ADD COLUMN weather_city text DEFAULT 'New York',
ADD COLUMN weather_units text DEFAULT 'celsius',
ADD COLUMN weather_update_interval integer DEFAULT 30;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Update the updated_at trigger to include new columns
CREATE OR REPLACE FUNCTION public.update_user_preferences_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;