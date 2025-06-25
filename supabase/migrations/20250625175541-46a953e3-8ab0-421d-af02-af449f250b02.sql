
-- First, let's enable RLS on all tables that don't have it yet and create proper policies

-- Enable RLS on tables that don't have it
ALTER TABLE public.ai_copilot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own AI copilot sessions" ON public.ai_copilot_sessions;
DROP POLICY IF EXISTS "Users can create their own AI copilot sessions" ON public.ai_copilot_sessions;
DROP POLICY IF EXISTS "Users can update their own AI copilot sessions" ON public.ai_copilot_sessions;
DROP POLICY IF EXISTS "Users can delete their own AI copilot sessions" ON public.ai_copilot_sessions;

DROP POLICY IF EXISTS "Users can view their own AI interactions" ON public.ai_interactions;
DROP POLICY IF EXISTS "Users can create their own AI interactions" ON public.ai_interactions;

DROP POLICY IF EXISTS "Users can view their own AI interactions v2" ON public.ai_interactions_v2;
DROP POLICY IF EXISTS "Users can create their own AI interactions v2" ON public.ai_interactions_v2;

DROP POLICY IF EXISTS "Users can view their own AI usage tracking" ON public.ai_usage_tracking;
DROP POLICY IF EXISTS "Users can create their own AI usage tracking" ON public.ai_usage_tracking;

DROP POLICY IF EXISTS "Users can view their own note shares" ON public.note_shares;
DROP POLICY IF EXISTS "Users can create their own note shares" ON public.note_shares;
DROP POLICY IF EXISTS "Users can update their own note shares" ON public.note_shares;
DROP POLICY IF EXISTS "Users can delete their own note shares" ON public.note_shares;

DROP POLICY IF EXISTS "Users can view their own note versions" ON public.note_versions;
DROP POLICY IF EXISTS "Users can create their own note versions" ON public.note_versions;

DROP POLICY IF EXISTS "Users can view their own sync queue" ON public.sync_queue;
DROP POLICY IF EXISTS "Users can create their own sync queue" ON public.sync_queue;
DROP POLICY IF EXISTS "Users can update their own sync queue" ON public.sync_queue;
DROP POLICY IF EXISTS "Users can delete their own sync queue" ON public.sync_queue;

-- Create comprehensive RLS policies for ai_copilot_sessions
CREATE POLICY "Users can view their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for ai_interactions
CREATE POLICY "Users can view their own AI interactions" 
  ON public.ai_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI interactions" 
  ON public.ai_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for ai_interactions_v2
CREATE POLICY "Users can view their own AI interactions v2" 
  ON public.ai_interactions_v2 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI interactions v2" 
  ON public.ai_interactions_v2 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for ai_usage_tracking
CREATE POLICY "Users can view their own AI usage tracking" 
  ON public.ai_usage_tracking 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI usage tracking" 
  ON public.ai_usage_tracking 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for note_shares
CREATE POLICY "Users can view their own note shares" 
  ON public.note_shares 
  FOR SELECT 
  USING (auth.uid() = shared_by OR auth.uid() = shared_with);

CREATE POLICY "Users can create their own note shares" 
  ON public.note_shares 
  FOR INSERT 
  WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can update their own note shares" 
  ON public.note_shares 
  FOR UPDATE 
  USING (auth.uid() = shared_by);

CREATE POLICY "Users can delete their own note shares" 
  ON public.note_shares 
  FOR DELETE 
  USING (auth.uid() = shared_by);

-- Create RLS policies for note_versions
CREATE POLICY "Users can view their own note versions" 
  ON public.note_versions 
  FOR SELECT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own note versions" 
  ON public.note_versions 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

-- Create RLS policies for sync_queue
CREATE POLICY "Users can view their own sync queue" 
  ON public.sync_queue 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sync queue" 
  ON public.sync_queue 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync queue" 
  ON public.sync_queue 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sync queue" 
  ON public.sync_queue 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add security audit logging trigger to critical tables
CREATE TRIGGER log_notes_v2_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.notes_v2
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

CREATE TRIGGER log_folders_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

CREATE TRIGGER log_user_profiles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

-- Create enhanced authentication check function
CREATE OR REPLACE FUNCTION public.ensure_authenticated()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'insufficient_privilege';
  END IF;
END;
$$;

-- Create secure user data access function
CREATE OR REPLACE FUNCTION public.get_current_user_data()
RETURNS TABLE(
  user_id uuid,
  email text,
  display_name text,
  role app_role
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Ensure user is authenticated
  PERFORM public.ensure_authenticated();
  
  RETURN QUERY
  SELECT 
    up.id,
    up.email,
    up.display_name,
    COALESCE(ur.role, 'user'::app_role) as role
  FROM public.user_profiles up
  LEFT JOIN public.user_roles ur ON up.id = ur.user_id
  WHERE up.id = auth.uid();
END;
$$;

-- Enhanced content validation function
CREATE OR REPLACE FUNCTION public.validate_content_security(content text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check for null or empty content
  IF content IS NULL THEN
    RETURN true; -- Allow null content
  END IF;
  
  -- Check maximum content length (10MB for notes)
  IF LENGTH(content) > 10485760 THEN
    RETURN false;
  END IF;
  
  -- Enhanced XSS prevention - check for dangerous patterns
  IF content ~* '<script[^>]*>.*?</script>' OR
     content ~* 'javascript:' OR
     content ~* 'data:text/html' OR
     content ~* 'vbscript:' OR
     content ~* 'on(load|error|click|focus|blur|change|submit)=' OR
     content ~* '<iframe[^>]*src=' OR
     content ~* '<object[^>]*data=' OR
     content ~* '<embed[^>]*src=' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Add content validation to notes trigger
CREATE OR REPLACE FUNCTION public.validate_note_content_security()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Replace the existing validation trigger
DROP TRIGGER IF EXISTS validate_note_content_trigger ON public.notes_v2;
CREATE TRIGGER validate_note_content_security_trigger
  BEFORE INSERT OR UPDATE ON public.notes_v2
  FOR EACH ROW EXECUTE FUNCTION public.validate_note_content_security();

-- Create secure session management function
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clean up expired note shares
  DELETE FROM public.note_shares 
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
  
  -- Clean up old AI copilot sessions (older than 30 days)
  DELETE FROM public.ai_copilot_sessions 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Clean up old security audit logs (older than 90 days)
  DELETE FROM public.security_audit_log 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Clean up old sync queue entries (older than 7 days)
  DELETE FROM public.sync_queue 
  WHERE created_at < NOW() - INTERVAL '7 days' 
  AND status IN ('completed', 'failed');
END;
$$;
