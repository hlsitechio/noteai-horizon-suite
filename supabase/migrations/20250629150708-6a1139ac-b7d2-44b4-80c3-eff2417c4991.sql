
-- Fix remaining functions with mutable search path warnings
-- These functions need SECURITY DEFINER with SET search_path = public

-- Fix the validate_note_content_enhanced function
CREATE OR REPLACE FUNCTION public.validate_note_content_enhanced()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate title
  IF NEW.title IS NULL OR LENGTH(TRIM(NEW.title)) = 0 THEN
    RAISE EXCEPTION 'Note title cannot be empty';
  END IF;
  
  IF LENGTH(NEW.title) > 500 THEN
    RAISE EXCEPTION 'Note title too long (max 500 characters)';
  END IF;
  
  -- Validate content
  IF NEW.content IS NULL THEN
    NEW.content := '';
  END IF;
  
  IF LENGTH(NEW.content) > 10485760 THEN -- 10MB limit
    RAISE EXCEPTION 'Note content too large (max 10MB)';
  END IF;
  
  -- Enhanced XSS prevention
  IF NEW.content ~* '<script[^>]*>.*?</script>' OR
     NEW.content ~* 'javascript:' OR
     NEW.content ~* 'data:text/html' OR
     NEW.content ~* 'vbscript:' OR
     NEW.content ~* 'on(load|error|click|focus|blur|change|submit)=' OR
     NEW.content ~* '<iframe[^>]*src=' OR
     NEW.content ~* '<object[^>]*data=' OR
     NEW.content ~* '<embed[^>]*src=' THEN
    RAISE EXCEPTION 'Content contains potentially malicious code';
  END IF;
  
  -- Validate tags array
  IF NEW.tags IS NOT NULL THEN
    IF array_length(NEW.tags, 1) > 20 THEN
      RAISE EXCEPTION 'Too many tags (max 20)';
    END IF;
    
    -- Check individual tag length
    FOR i IN 1..COALESCE(array_length(NEW.tags, 1), 0) LOOP
      IF LENGTH(NEW.tags[i]) > 50 THEN
        RAISE EXCEPTION 'Tag too long (max 50 characters)';
      END IF;
    END LOOP;
  END IF;
  
  -- Validate content_type
  IF NEW.content_type IS NOT NULL AND 
     NEW.content_type NOT IN ('html', 'markdown', 'plain', 'json') THEN
    NEW.content_type := 'html';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix the validate_note_content_security function
CREATE OR REPLACE FUNCTION public.validate_note_content_security()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate title
  IF NEW.title IS NULL OR LENGTH(TRIM(NEW.title)) = 0 THEN
    RAISE EXCEPTION 'Note title cannot be empty';
  END IF;
  
  IF LENGTH(NEW.title) > 500 THEN
    RAISE EXCEPTION 'Note title too long (max 500 characters)';
  END IF;
  
  -- Validate content using security function
  IF NOT public.validate_content_security(NEW.content) THEN
    RAISE EXCEPTION 'Content contains potentially malicious code or is too large';
  END IF;
  
  -- Validate tags array
  IF NEW.tags IS NOT NULL THEN
    IF array_length(NEW.tags, 1) > 20 THEN
      RAISE EXCEPTION 'Too many tags (max 20)';
    END IF;
    
    -- Check individual tag length
    FOR i IN 1..COALESCE(array_length(NEW.tags, 1), 0) LOOP
      IF LENGTH(NEW.tags[i]) > 50 THEN
        RAISE EXCEPTION 'Tag too long (max 50 characters)';
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix the log_suspicious_activity function
CREATE OR REPLACE FUNCTION public.log_suspicious_activity()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log rapid successive updates (potential data scraping)
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.security_incidents (
      incident_type,
      severity,
      details,
      ip_address
    ) VALUES (
      'rapid_updates',
      'medium',
      jsonb_build_object(
        'user_id', NEW.user_id,
        'table_name', TG_TABLE_NAME,
        'record_id', NEW.id
      ),
      inet_client_addr()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix the log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    created_at
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix the validate_note_trigger function
CREATE OR REPLACE FUNCTION public.validate_note_trigger()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.validate_note_content(NEW.content) THEN
    RAISE EXCEPTION 'Invalid note content detected';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix other update timestamp functions
CREATE OR REPLACE FUNCTION public.update_project_realms_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_reminders_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_banners_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
