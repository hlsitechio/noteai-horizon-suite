-- Fix security issue: Update function to set secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  SET search_path = '';
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;