
-- Fix the update_folders_updated_at function with proper search path security
-- First, let's see what this function currently does and fix it properly
CREATE OR REPLACE FUNCTION public.update_folders_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
