-- Fix the update_user_activities_updated_at function to have secure search path
CREATE OR REPLACE FUNCTION public.update_user_activities_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;