
-- Fix the sanitize_input function with proper search path security
CREATE OR REPLACE FUNCTION public.sanitize_input(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove potentially dangerous patterns
  input_text := regexp_replace(input_text, '<script[^>]*>.*?</script>', '', 'gi');
  input_text := regexp_replace(input_text, 'javascript:', '', 'gi');
  input_text := regexp_replace(input_text, 'data:', '', 'gi');
  input_text := regexp_replace(input_text, 'vbscript:', '', 'gi');
  
  -- Limit length
  IF LENGTH(input_text) > 10000 THEN
    input_text := LEFT(input_text, 10000);
  END IF;
  
  RETURN input_text;
END;
$$;
