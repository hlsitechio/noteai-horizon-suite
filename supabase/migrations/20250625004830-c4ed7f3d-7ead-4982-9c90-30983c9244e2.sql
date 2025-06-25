
-- Phase 1: Enhanced RLS Policies and Input Validation

-- Add comprehensive input validation trigger for notes_v2
CREATE OR REPLACE FUNCTION public.validate_note_content_enhanced()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Apply enhanced validation trigger to notes_v2
DROP TRIGGER IF EXISTS validate_note_content_trigger ON public.notes_v2;
CREATE TRIGGER validate_note_content_trigger
  BEFORE INSERT OR UPDATE ON public.notes_v2
  FOR EACH ROW EXECUTE FUNCTION public.validate_note_content_enhanced();

-- Enhanced folder validation
CREATE OR REPLACE FUNCTION public.validate_folder_data()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Apply folder validation trigger
DROP TRIGGER IF EXISTS validate_folder_data_trigger ON public.folders;
CREATE TRIGGER validate_folder_data_trigger
  BEFORE INSERT OR UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.validate_folder_data();

-- Enhanced rate limiting function with better security
CREATE OR REPLACE FUNCTION public.check_enhanced_rate_limit_v2(
  user_uuid uuid, 
  action_type text, 
  max_requests integer DEFAULT 50, 
  time_window interval DEFAULT '01:00:00'::interval
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_count INTEGER;
  user_tier TEXT;
  tier_multiplier NUMERIC := 1.0;
  is_admin BOOLEAN := false;
BEGIN
  -- Check if user is admin (admins get higher limits)
  SELECT public.has_role(user_uuid, 'admin') INTO is_admin;
  
  IF is_admin THEN
    tier_multiplier := 10.0;
  ELSE
    -- Get user tier for rate limit adjustment
    SELECT COALESCE(subscription_tier, 'starter') INTO user_tier
    FROM public.subscribers
    WHERE user_id = user_uuid;
    
    -- Adjust rate limits based on subscription tier
    IF user_tier = 'professional' THEN
      tier_multiplier := 3.0;
    ELSIF user_tier = 'premium' THEN
      tier_multiplier := 5.0;
    END IF;
  END IF;
  
  -- Count recent requests with proper indexing
  SELECT COUNT(*) INTO request_count
  FROM public.security_audit_log
  WHERE user_id = user_uuid
    AND action = action_type
    AND created_at > NOW() - time_window;
  
  -- Log if approaching limit
  IF request_count > (max_requests * tier_multiplier * 0.8) THEN
    INSERT INTO public.security_incidents (
      incident_type, 
      severity, 
      details
    ) VALUES (
      'rate_limit_warning',
      'low',
      jsonb_build_object(
        'user_id', user_uuid,
        'action', action_type,
        'count', request_count,
        'limit', max_requests * tier_multiplier
      )
    );
  END IF;
  
  -- Return true if under the adjusted limit
  RETURN request_count < (max_requests * tier_multiplier);
END;
$$;

-- Create index for better performance on security audit log
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_action_time 
ON public.security_audit_log (user_id, action, created_at DESC);

-- Enhanced AI usage tracking with better validation
CREATE OR REPLACE FUNCTION public.track_ai_usage_enhanced(
  user_uuid uuid,
  request_type_param text,
  tokens_used_param integer DEFAULT 0,
  model_name_param text DEFAULT 'default'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate inputs
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  IF request_type_param IS NULL OR LENGTH(TRIM(request_type_param)) = 0 THEN
    RAISE EXCEPTION 'Request type cannot be empty';
  END IF;
  
  IF tokens_used_param < 0 THEN
    tokens_used_param := 0;
  END IF;
  
  IF tokens_used_param > 1000000 THEN -- Sanity check
    RAISE EXCEPTION 'Token usage seems unrealistic';
  END IF;
  
  -- Insert or update usage tracking
  INSERT INTO public.ai_usage_tracking (
    user_id, 
    request_type, 
    tokens_used, 
    date
  )
  VALUES (
    user_uuid, 
    request_type_param, 
    tokens_used_param, 
    CURRENT_DATE
  )
  ON CONFLICT (user_id, request_type, date) 
  DO UPDATE SET 
    tokens_used = ai_usage_tracking.tokens_used + EXCLUDED.tokens_used;
END;
$$;

-- Add security monitoring for suspicious activity
CREATE OR REPLACE FUNCTION public.log_suspicious_activity()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply monitoring to sensitive tables (optional, can be enabled later)
-- CREATE TRIGGER monitor_notes_activity
--   AFTER UPDATE ON public.notes_v2
--   FOR EACH ROW EXECUTE FUNCTION public.log_suspicious_activity();
