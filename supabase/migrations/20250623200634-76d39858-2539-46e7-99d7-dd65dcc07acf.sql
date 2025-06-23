
-- Create a function to get user notes with all relevant information for RAG
CREATE OR REPLACE FUNCTION public.get_user_notes_for_rag(user_uuid uuid)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  tags text[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  category text,
  is_favorite boolean
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT 
    n.id,
    n.title,
    n.content,
    COALESCE(n.tags, '{}'::text[]) as tags,
    n.created_at,
    n.updated_at,
    COALESCE(n.content_type, 'general') as category,
    COALESCE(n.is_public, false) as is_favorite
  FROM notes_v2 n
  WHERE n.user_id = user_uuid
  ORDER BY n.updated_at DESC;
$$;

-- Create a function to search notes by content and tags for better RAG retrieval
CREATE OR REPLACE FUNCTION public.search_user_notes_for_rag(
  user_uuid uuid,
  search_query text DEFAULT '',
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  tags text[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  category text,
  is_favorite boolean,
  relevance_score float
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.title,
    n.content,
    COALESCE(n.tags, '{}'::text[]) as tags,
    n.created_at,
    n.updated_at,
    COALESCE(n.content_type, 'general') as category,
    COALESCE(n.is_public, false) as is_favorite,
    -- Simple relevance scoring based on text similarity
    CASE 
      WHEN search_query = '' THEN 1.0
      ELSE 
        (
          CASE WHEN n.title ILIKE '%' || search_query || '%' THEN 0.5 ELSE 0.0 END +
          CASE WHEN n.content ILIKE '%' || search_query || '%' THEN 0.3 ELSE 0.0 END +
          CASE WHEN array_to_string(n.tags, ' ') ILIKE '%' || search_query || '%' THEN 0.2 ELSE 0.0 END
        )
    END as relevance_score
  FROM notes_v2 n
  WHERE n.user_id = user_uuid
    AND (
      search_query = '' OR
      n.title ILIKE '%' || search_query || '%' OR
      n.content ILIKE '%' || search_query || '%' OR
      array_to_string(n.tags, ' ') ILIKE '%' || search_query || '%'
    )
  ORDER BY 
    CASE WHEN search_query = '' THEN n.updated_at END DESC,
    relevance_score DESC
  LIMIT limit_count;
END;
$$;

-- Track RAG usage for analytics
INSERT INTO public.ai_usage_tracking (user_id, request_type, tokens_used)
SELECT auth.uid(), 'rag_retrieval', 1
WHERE auth.uid() IS NOT NULL;
