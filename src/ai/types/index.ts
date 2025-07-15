export interface AIAgent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  capabilities: string[];
  personality: string;
  expertiseAreas: string[];
}

export interface AIContext {
  userId?: string;
  sessionId: string;
  conversationHistory: AIMessage[];
  userProfile?: UserProfile;
  preferences?: UserPreferences;
  currentTask?: TaskContext;
  sharedKnowledge: SharedKnowledge;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
  metadata?: {
    actions?: AIAction[];
    actionResults?: any[];
    confidence?: number;
    reasoning?: string;
  };
}

export interface AIAction {
  type: string;
  data: any;
  message?: string;
  priority?: 'low' | 'medium' | 'high';
  requiresConfirmation?: boolean;
}

export interface UserProfile {
  displayName?: string;
  preferences?: Record<string, any>;
  workingStyle?: string;
  goals?: string[];
  timezone?: string;
}

export interface UserPreferences {
  communicationStyle: 'concise' | 'detailed' | 'conversational';
  taskManagementStyle: 'structured' | 'flexible' | 'minimal';
  notificationLevel: 'high' | 'medium' | 'low';
  preferredLanguage: string;
  aiPersonality: 'professional' | 'friendly' | 'creative' | 'analytical';
}

export interface TaskContext {
  type: 'productivity' | 'writing' | 'analysis' | 'general' | 'creative';
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  relatedItems?: string[];
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface SharedKnowledge {
  userNotes: Note[];
  recentActions: AIAction[];
  contextualMemory: ContextualMemory[];
  preferences: UserPreferences;
  workingPatterns: WorkingPattern[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContextualMemory {
  id: string;
  context: string;
  insights: string[];
  importance: number;
  timestamp: Date;
  relatedTopics: string[];
}

export interface WorkingPattern {
  timeOfDay: string;
  activityType: string;
  frequency: number;
  effectiveness: number;
}

export interface AgentResponse {
  message: string;
  actions?: AIAction[];
  confidence: number;
  reasoning?: string;
  needsClarification?: boolean;
  clarificationQuestion?: string;
  suggestedFollowUps?: string[];
}

export type ChatMode = 'general' | 'task-focused' | 'creative' | 'analytical';