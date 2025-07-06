-- Fix the search_similar_messages function with proper security and correct vector operator
CREATE OR REPLACE FUNCTION public.search_similar_messages(
  query_embedding vector, 
  user_uuid uuid, 
  similarity_threshold double precision DEFAULT 0.7, 
  match_count integer DEFAULT 10
)
RETURNS TABLE(
  id uuid, 
  session_id uuid, 
  content text, 
  role text, 
  created_at timestamp with time zone, 
  similarity double precision
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''  -- This fixes the mutable search_path security issue
AS $function$
  SELECT 
    cm.id,
    cm.session_id,
    cm.content,
    cm.role,
    cm.created_at,
    1 - public.cosine_distance(cm.embedding, query_embedding) AS similarity
  FROM public.chat_messages cm  -- Explicitly reference the schema
  WHERE cm.user_id = user_uuid
    AND cm.embedding IS NOT NULL
    AND 1 - public.cosine_distance(cm.embedding, query_embedding) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$function$;