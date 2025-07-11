-- Add welcome_message column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN welcome_message text DEFAULT 'Welcome back';