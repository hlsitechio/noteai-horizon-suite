-- Create vector similarity indexes (after tables are created)
CREATE INDEX IF NOT EXISTS idx_chat_messages_embedding ON public.chat_messages 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_semantic_memory_embedding ON public.semantic_memory 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_chat_updated_at();

CREATE TRIGGER update_semantic_memory_updated_at
BEFORE UPDATE ON public.semantic_memory
FOR EACH ROW EXECUTE FUNCTION public.update_chat_updated_at();

-- Function to search similar messages by embedding
CREATE OR REPLACE FUNCTION public.search_similar_messages(
  query_embedding VECTOR(1536),
  user_uuid UUID,
  similarity_threshold FLOAT DEFAULT 0.7,
  match_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  session_id UUID,
  content TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  similarity FLOAT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    cm.id,
    cm.session_id,
    cm.content,
    cm.role,
    cm.created_at,
    1 - (cm.embedding <=> query_embedding) AS similarity
  FROM chat_messages cm
  WHERE cm.user_id = user_uuid
    AND cm.embedding IS NOT NULL
    AND 1 - (cm.embedding <=> query_embedding) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- Function to search semantic memory
CREATE OR REPLACE FUNCTION public.search_semantic_memory(
  query_embedding VECTOR(1536),
  user_uuid UUID,
  similarity_threshold FLOAT DEFAULT 0.7,
  match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  summary TEXT,
  importance_score FLOAT,
  similarity FLOAT,
  tags TEXT[]
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    sm.id,
    sm.content,
    sm.summary,
    sm.importance_score,
    1 - (sm.embedding <=> query_embedding) AS similarity,
    sm.tags
  FROM semantic_memory sm
  WHERE sm.user_id = user_uuid
    AND sm.embedding IS NOT NULL
    AND 1 - (sm.embedding <=> query_embedding) > similarity_threshold
  ORDER BY similarity DESC, importance_score DESC
  LIMIT match_count;
$$;

-- Function to get chat history with context
CREATE OR REPLACE FUNCTION public.get_chat_context(
  session_uuid UUID,
  user_uuid UUID,
  message_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  role TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    cm.id,
    cm.role,
    cm.content,
    cm.created_at
  FROM chat_messages cm
  WHERE cm.session_id = session_uuid
    AND cm.user_id = user_uuid
  ORDER BY cm.created_at DESC
  LIMIT message_limit;
$$;