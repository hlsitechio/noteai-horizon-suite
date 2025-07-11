-- Add unique constraint on user_id column for user_onboarding table
-- This will fix the "no unique or exclusion constraint matching the ON CONFLICT specification" error

ALTER TABLE public.user_onboarding 
ADD CONSTRAINT user_onboarding_user_id_unique UNIQUE (user_id);