-- Optimize real-time performance for notes_v2 table
-- Enable proper replica identity and add to realtime publication
ALTER TABLE public.notes_v2 REPLICA IDENTITY FULL;

-- Remove table from existing publication if it exists
BEGIN;
  -- Check if publication exists and remove table
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1 
      FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'notes_v2'
    ) THEN
      ALTER PUBLICATION supabase_realtime DROP TABLE public.notes_v2;
    END IF;
  END $$;
  
  -- Add table back with optimized settings
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notes_v2;
COMMIT;

-- Create indexes to optimize real-time queries
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_id_updated_at 
ON public.notes_v2(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_notes_v2_user_id_created_at 
ON public.notes_v2(user_id, created_at DESC);

-- Optimize the real-time subscription by creating a function that limits change frequency
CREATE OR REPLACE FUNCTION public.throttle_realtime_changes()
RETURNS TRIGGER AS $$
DECLARE
  last_change TIMESTAMP;
BEGIN
  -- For updates, check if there was a recent change (within 1 second)
  IF TG_OP = 'UPDATE' THEN
    SELECT updated_at INTO last_change 
    FROM public.notes_v2 
    WHERE id = NEW.id;
    
    -- If updated very recently, skip the realtime notification
    IF last_change IS NOT NULL AND (NOW() - last_change) < INTERVAL '1 second' THEN
      RETURN NULL;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add performance monitoring
CREATE TABLE IF NOT EXISTS public.realtime_performance_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on performance log
ALTER TABLE public.realtime_performance_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view performance logs
CREATE POLICY "Admins can view realtime performance logs" 
ON public.realtime_performance_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to clean up old performance logs
CREATE OR REPLACE FUNCTION public.cleanup_realtime_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.realtime_performance_log 
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;