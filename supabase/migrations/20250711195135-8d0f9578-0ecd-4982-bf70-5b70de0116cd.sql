-- Create enum for user roles first
CREATE TYPE public.user_role_type AS ENUM ('developer', 'designer', 'product_manager', 'analyst', 'content_creator', 'student', 'other');

-- Add role column with proper enum type
ALTER TABLE public.user_preferences 
ADD COLUMN user_role user_role_type DEFAULT 'other';

-- Add initial onboarding completion tracking to user_onboarding table
ALTER TABLE public.user_onboarding 
ADD COLUMN initial_onboarding_completed boolean DEFAULT false;