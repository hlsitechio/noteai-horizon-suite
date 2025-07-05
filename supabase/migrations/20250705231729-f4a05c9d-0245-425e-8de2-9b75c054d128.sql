-- Enable the pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create chat sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create chat messages table with vector embeddings
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
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
  user_id UUID NOT NULL,
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