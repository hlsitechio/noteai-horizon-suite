
-- Fix the validate_folder_data function with proper search path security
CREATE OR REPLACE FUNCTION public.validate_folder_data()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate folder name
  IF NEW.name IS NULL OR LENGTH(TRIM(NEW.name)) = 0 THEN
    RAISE EXCEPTION 'Folder name cannot be empty';
  END IF;
  
  IF LENGTH(NEW.name) > 255 THEN
    RAISE EXCEPTION 'Folder name too long (max 255 characters)';
  END IF;
  
  -- Validate color format (hex color)
  IF NEW.color IS NOT NULL AND NEW.color !~ '^#[0-9A-Fa-f]{6}$' THEN
    NEW.color := '#64748b'; -- Default color
  END IF;
  
  -- Prevent circular references in folder hierarchy
  IF NEW.parent_id IS NOT NULL AND NEW.parent_id = NEW.id THEN
    RAISE EXCEPTION 'Folder cannot be its own parent';
  END IF;
  
  RETURN NEW;
END;
$$;
