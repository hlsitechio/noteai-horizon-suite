-- Phase 1: Database optimizations for better performance

-- Add composite index for user queries
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_folder_updated 
ON public.notes_v2(user_id, folder_id, updated_at DESC) 
WHERE user_id IS NOT NULL;

-- Add index for search operations
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_text_search 
ON public.notes_v2 USING gin(user_id, to_tsvector('english', title || ' ' || content)) 
WHERE user_id IS NOT NULL;

-- Add index for tag searches
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_tags 
ON public.notes_v2 USING gin(user_id, tags) 
WHERE user_id IS NOT NULL AND tags IS NOT NULL;

-- Optimize realtime performance with better replica identity
ALTER TABLE public.notes_v2 REPLICA IDENTITY FULL;

-- Add notes to realtime publication (if not already added)
BEGIN;
  -- Check if table is already in publication
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'notes_v2'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.notes_v2;
    END IF;
  END $$;
COMMIT;

-- Create function to batch process notes for better performance
CREATE OR REPLACE FUNCTION public.get_user_notes_optimized(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0,
  p_folder_id UUID DEFAULT NULL,
  p_search_term TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  content_type TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN,
  folder_id UUID,
  reminder_date TIMESTAMP WITH TIME ZONE,
  reminder_status TEXT,
  reminder_frequency TEXT,
  reminder_enabled BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    n.id,
    n.title,
    n.content,
    n.content_type,
    n.tags,
    n.created_at,
    n.updated_at,
    n.is_public,
    n.folder_id,
    n.reminder_date,
    n.reminder_status,
    n.reminder_frequency,
    n.reminder_enabled
  FROM notes_v2 n
  WHERE n.user_id = p_user_id
    AND (p_folder_id IS NULL OR n.folder_id = p_folder_id)
    AND (
      p_search_term IS NULL 
      OR n.title ILIKE '%' || p_search_term || '%'
      OR n.content ILIKE '%' || p_search_term || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(n.tags) AS tag 
        WHERE tag ILIKE '%' || p_search_term || '%'
      )
    )
  ORDER BY n.updated_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;