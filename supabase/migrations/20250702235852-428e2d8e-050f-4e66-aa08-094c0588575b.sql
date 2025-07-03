-- Create better optimized indexes for notes queries
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_updated 
ON public.notes_v2(user_id, updated_at DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notes_v2_user_created 
ON public.notes_v2(user_id, created_at DESC) 
WHERE user_id IS NOT NULL;

-- Add back minimal real-time functionality with better replica identity
ALTER TABLE public.notes_v2 REPLICA IDENTITY FULL;