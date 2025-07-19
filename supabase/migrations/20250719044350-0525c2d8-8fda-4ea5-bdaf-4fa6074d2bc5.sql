-- Create the missing trigger function and fix remaining security issue

-- Create the trigger function for app_metrics
CREATE OR REPLACE FUNCTION public.update_app_metrics_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.timestamp = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

-- Create the trigger for app_metrics
CREATE TRIGGER update_app_metrics_timestamp_trigger
BEFORE UPDATE ON public.app_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_app_metrics_timestamp();