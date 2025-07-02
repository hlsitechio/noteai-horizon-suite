-- Emergency: Reset real-time performance issues
-- Remove tables from realtime publication to stop the query flood
BEGIN;

-- Remove the throttle trigger that might be causing issues
DROP TRIGGER IF EXISTS throttle_realtime_trigger ON public.notes_v2;

-- Clean up real-time performance logs
TRUNCATE public.realtime_performance_log;

-- Optimize the notes_v2 table performance
ALTER TABLE public.notes_v2 REPLICA IDENTITY DEFAULT;

-- Create optimized indexes for better performance
DROP INDEX IF EXISTS idx_notes_v2_user_id_updated_at;
DROP INDEX IF EXISTS idx_notes_v2_user_id_created_at;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notes_v2_user_updated 
ON public.notes_v2(user_id, updated_at DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notes_v2_user_created 
ON public.notes_v2(user_id, created_at DESC) 
WHERE user_id IS NOT NULL;

COMMIT;