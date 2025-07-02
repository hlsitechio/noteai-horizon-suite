-- Emergency: Disable problematic real-time features and reset performance
-- First, remove the throttle trigger that might be causing issues
DROP TRIGGER IF EXISTS throttle_realtime_trigger ON public.notes_v2;

-- Remove the table from realtime publication temporarily to stop the flood
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.notes_v2;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.folders;

-- Clean up any existing real-time performance logs
TRUNCATE public.realtime_performance_log;

-- Reset connection limits and clean up any stuck connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE application_name LIKE '%realtime%' 
AND state = 'idle in transaction'
AND query_start < NOW() - INTERVAL '5 minutes';

-- Optimize the notes_v2 table for better performance
-- Remove full replica identity temporarily to reduce overhead
ALTER TABLE public.notes_v2 REPLICA IDENTITY DEFAULT;

-- Create more efficient indexes for common queries
DROP INDEX IF EXISTS idx_notes_v2_user_id_updated_at;
DROP INDEX IF EXISTS idx_notes_v2_user_id_created_at;

-- Create optimized composite indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notes_v2_user_updated 
ON public.notes_v2(user_id, updated_at DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notes_v2_user_created 
ON public.notes_v2(user_id, created_at DESC) 
WHERE user_id IS NOT NULL;

-- Add back to realtime with minimal settings
ALTER TABLE public.notes_v2 REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes_v2;