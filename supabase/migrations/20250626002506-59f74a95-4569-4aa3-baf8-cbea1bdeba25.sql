
-- Enable real-time updates for the notes_v2 table
ALTER TABLE public.notes_v2 REPLICA IDENTITY FULL;

-- Add the notes_v2 table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes_v2;

-- Create an index for better real-time performance on user queries
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_updated ON public.notes_v2(user_id, updated_at DESC);
