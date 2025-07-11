-- Add dashboard_theme column to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN dashboard_theme TEXT DEFAULT 'default';

-- Add comment to document the column
COMMENT ON COLUMN public.user_preferences.dashboard_theme IS 'Selected dashboard theme from onboarding (default, sunset, dark, neon)';