
-- Fix the search_user_notes_for_rag function to return correct data types
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
  relevance_score double precision
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
    -- Simple relevance scoring based on text similarity (cast to double precision)
    CASE 
      WHEN search_query = '' THEN 1.0::double precision
      ELSE 
        (
          CASE WHEN n.title ILIKE '%' || search_query || '%' THEN 0.5 ELSE 0.0 END +
          CASE WHEN n.content ILIKE '%' || search_query || '%' THEN 0.3 ELSE 0.0 END +
          CASE WHEN array_to_string(n.tags, ' ') ILIKE '%' || search_query || '%' THEN 0.2 ELSE 0.0 END
        )::double precision
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
