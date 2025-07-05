export type AIAssistantMode = 'inline' | 'contextmenu' | 'sidebar' | 'command';

export type AIAction = 
  | 'improve' 
  | 'translate' 
  | 'summarize' 
  | 'expand' 
  | 'simplify' 
  | 'custom'
  | 'fix_grammar'
  | 'make_professional'
  | 'make_casual'
  | 'explain'
  | 'continue'
  | 'replace';

export interface AIRequest {
  action: AIAction;
  text: string;
  noteId?: string;
  customPrompt?: string;
  targetLanguage?: string;
  context?: AIContext;
  sessionId?: string;
}

export interface AIResponse {
  result: string;
  sessionId: string;
  processingTime: number;
  model: string;
  tokensUsed?: number;
  confidence?: number;
  similarNotes?: Array<{
    id: string;
    title: string;
    content: string;
    relevance: number;
  }>;
  suggestions?: string[];
}

export interface AIContext {
  currentNote?: {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
  };
  selectedText?: string;
  recentNotes?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  userPreferences?: {
    writingStyle: string;
    preferredLanguage: string;
    complexity: 'simple' | 'detailed' | 'technical';
  };
}

export interface AISession {
  id: string;
  noteId?: string;
  startTime: Date;
  interactions: AIInteraction[];
  context: AIContext;
}

export interface AIInteraction {
  id: string;
  timestamp: Date;
  request: AIRequest;
  response: AIResponse;
  rating?: number;
  feedback?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'openrouter';
  capabilities: AICapability[];
  maxTokens: number;
  costPer1000Tokens: number;
  description: string;
}

export type AICapability = 
  | 'text_generation'
  | 'translation'
  | 'summarization'
  | 'code_generation'
  | 'creative_writing'
  | 'analysis'
  | 'conversation';

export interface AIUsageStats {
  totalRequests: number;
  totalTokens: number;
  averageResponseTime: number;
  topActions: Array<{
    action: AIAction;
    count: number;
  }>;
  favoriteModel: string;
}