
-- Create enhanced AI interactions table for copilot functionality (without vector embeddings)
CREATE TABLE IF NOT EXISTS public.ai_copilot_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  note_id UUID REFERENCES public.notes_v2(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL DEFAULT 'copilot', -- 'copilot', 'rag', 'enhancement'
  original_content TEXT NOT NULL,
  processed_content TEXT,
  summary_result TEXT,
  polished_result TEXT,
  suggestions_result TEXT,
  model_config JSONB DEFAULT '{}'::jsonb, -- Store which models were used
  processing_time INTEGER, -- milliseconds
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for AI copilot sessions
ALTER TABLE public.ai_copilot_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI copilot sessions" 
  ON public.ai_copilot_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS ai_copilot_note_id_idx ON public.ai_copilot_sessions (note_id);
CREATE INDEX IF NOT EXISTS ai_copilot_user_id_idx ON public.ai_copilot_sessions (user_id);
CREATE INDEX IF NOT EXISTS ai_copilot_session_type_idx ON public.ai_copilot_sessions (session_type);

-- Function to find similar notes based on text similarity (fallback without vector embeddings)
CREATE OR REPLACE FUNCTION public.find_similar_notes_text(
  search_text TEXT,
  user_uuid UUID,
  max_results INTEGER DEFAULT 5
)
RETURNS TABLE(
  note_id UUID,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    n.id as note_id,
    n.title,
    n.content,
    n.created_at
  FROM notes_v2 n
  WHERE n.user_id = user_uuid
    AND (
      n.title ILIKE '%' || search_text || '%' OR
      n.content ILIKE '%' || search_text || '%' OR
      array_to_string(n.tags, ' ') ILIKE '%' || search_text || '%'
    )
  ORDER BY 
    CASE 
      WHEN n.title ILIKE '%' || search_text || '%' THEN 1
      WHEN n.content ILIKE '%' || search_text || '%' THEN 2
      ELSE 3
    END,
    n.updated_at DESC
  LIMIT max_results;
$$;

-- Function to track AI usage for copilot
CREATE OR REPLACE FUNCTION public.track_copilot_usage(
  user_uuid UUID,
  tokens_used INTEGER DEFAULT 0,
  model_name TEXT DEFAULT 'mistral-7b'
)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO public.ai_usage_tracking (user_id, request_type, tokens_used, date)
  VALUES (user_uuid, 'copilot_' || model_name, tokens_used, CURRENT_DATE)
  ON CONFLICT (user_id, request_type, date) 
  DO UPDATE SET 
    tokens_used = ai_usage_tracking.tokens_used + EXCLUDED.tokens_used;
$$;

-- Update trigger for ai_copilot_sessions
CREATE OR REPLACE FUNCTION public.update_ai_copilot_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_copilot_sessions_updated_at
  BEFORE UPDATE ON public.ai_copilot_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_copilot_updated_at();
