-- Fix the remaining function security issue
-- Update the app metrics function that was just created

ALTER FUNCTION public.update_app_metrics_updated_at() SET search_path TO '';

-- Also create the missing trigger for app_metrics that was referenced earlier
CREATE TRIGGER update_app_metrics_updated_at_trigger
BEFORE UPDATE ON public.app_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_app_metrics_updated_at();