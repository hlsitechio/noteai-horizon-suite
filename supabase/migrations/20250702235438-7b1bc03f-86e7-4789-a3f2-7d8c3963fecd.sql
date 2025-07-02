-- Emergency: Reset real-time performance issues
-- Remove the throttle trigger that might be causing issues
DROP TRIGGER IF EXISTS throttle_realtime_trigger ON public.notes_v2;

-- Clean up real-time performance logs
TRUNCATE public.realtime_performance_log;

-- Optimize the notes_v2 table performance
ALTER TABLE public.notes_v2 REPLICA IDENTITY DEFAULT;

-- Drop old inefficient indexes
DROP INDEX IF EXISTS idx_notes_v2_user_id_updated_at;
DROP INDEX IF EXISTS idx_notes_v2_user_id_created_at;