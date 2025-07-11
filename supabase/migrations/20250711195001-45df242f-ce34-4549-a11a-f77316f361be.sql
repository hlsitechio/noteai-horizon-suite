-- Add role to user preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN user_role text DEFAULT 'user';

-- Create enum for user roles
CREATE TYPE public.user_role_type AS ENUM ('developer', 'designer', 'product_manager', 'analyst', 'content_creator', 'student', 'other');

-- Update the role column to use the enum (this will set all existing roles to 'other')
ALTER TABLE public.user_preferences 
ALTER COLUMN user_role TYPE user_role_type USING 'other'::user_role_type;

-- Set better default
ALTER TABLE public.user_preferences 
ALTER COLUMN user_role SET DEFAULT 'other';

-- Add initial onboarding completion tracking to user_onboarding table
ALTER TABLE public.user_onboarding 
ADD COLUMN initial_onboarding_completed boolean DEFAULT false;

-- Create trigger to update user_onboarding updated_at
CREATE OR REPLACE FUNCTION public.update_user_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_onboarding updates
DROP TRIGGER IF EXISTS update_user_onboarding_updated_at_trigger ON public.user_onboarding;
CREATE TRIGGER update_user_onboarding_updated_at_trigger
  BEFORE UPDATE ON public.user_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_onboarding_updated_at();