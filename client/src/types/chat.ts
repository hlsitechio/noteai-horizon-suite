export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  tokens_used?: number;
  model_used?: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface SemanticMemory {
  id: string;
  content: string;
  summary: string;
  importance_score: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  tokensUsed: number;
  contextUsed: {
    similarMessages: number;
    semanticMemory: number;
    recentMessages: number;
  };
}

export interface SimilarMessage {
  id: string;
  content: string;
  role: string;
  similarity: number;
  created_at: string;
}

export interface ChatContextType {
  messages: ChatMessage[];
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, systemPrompt?: string) => Promise<void>;
  createNewSession: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  searchSimilarMessages: (query: string) => Promise<SimilarMessage[]>;
  getSemanticMemory: () => Promise<SemanticMemory[]>;
}