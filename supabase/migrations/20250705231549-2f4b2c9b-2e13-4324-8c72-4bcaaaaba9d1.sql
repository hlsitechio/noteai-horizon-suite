-- Create chat sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create chat messages table with vector embeddings
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embedding dimension
  tokens_used INTEGER DEFAULT 0,
  model_used TEXT DEFAULT 'gpt-4.1-2025-04-14',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create semantic memory table for long-term knowledge storage
CREATE TABLE IF NOT EXISTS public.semantic_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  summary TEXT,
  embedding VECTOR(1536),
  importance_score FLOAT DEFAULT 0.5,
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on all tables
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semantic_memory ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_sessions
CREATE POLICY "Users can create their own chat sessions" 
ON public.chat_sessions FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own chat sessions" 
ON public.chat_sessions FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own chat sessions" 
ON public.chat_sessions FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own chat sessions" 
ON public.chat_sessions FOR DELETE 
USING (user_id = auth.uid());

-- RLS policies for chat_messages
CREATE POLICY "Users can create their own chat messages" 
ON public.chat_messages FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own chat messages" 
ON public.chat_messages FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own chat messages" 
ON public.chat_messages FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own chat messages" 
ON public.chat_messages FOR DELETE 
USING (user_id = auth.uid());

-- RLS policies for semantic_memory
CREATE POLICY "Users can create their own semantic memory" 
ON public.semantic_memory FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own semantic memory" 
ON public.semantic_memory FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own semantic memory" 
ON public.semantic_memory FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own semantic memory" 
ON public.semantic_memory FOR DELETE 
USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON public.chat_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_semantic_memory_user_id ON public.semantic_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_semantic_memory_importance ON public.semantic_memory(importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_semantic_memory_accessed ON public.semantic_memory(last_accessed_at DESC);

-- Create vector similarity indexes (requires pgvector extension)
CREATE INDEX IF NOT EXISTS idx_chat_messages_embedding ON public.chat_messages 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_semantic_memory_embedding ON public.semantic_memory 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_semantic_memory_updated_at
BEFORE UPDATE ON public.semantic_memory
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

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