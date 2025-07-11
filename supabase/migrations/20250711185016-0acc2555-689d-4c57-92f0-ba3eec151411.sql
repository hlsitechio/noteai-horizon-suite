-- Add dashboard_components column to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN dashboard_components TEXT[] DEFAULT '{}';

-- Add comment to document the column
COMMENT ON COLUMN public.user_preferences.dashboard_components IS 'Array of selected dashboard component IDs from onboarding';