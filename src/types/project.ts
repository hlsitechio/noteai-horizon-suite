
export interface ProjectRealm {
  id: string;
  title: string;
  description?: string;
  creator_id: string;
  settings: Record<string, any>;
  ai_config: {
    agents: string[];
    memory_depth: number;
  };
  status: 'active' | 'archived' | 'hibernating';
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface ProjectAgent {
  id: string;
  project_id: string;
  agent_type: 'scribe' | 'strategist' | 'researcher' | 'scheduler' | 'custom';
  name: string;
  prompt_template: string;
  config: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectAIInteraction {
  id: string;
  project_id: string;
  agent_id?: string;
  interaction_type: string;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  context_notes: string[];
  processing_time?: number;
  created_at: string;
}

export interface ProjectKnowledgeLink {
  id: string;
  project_id: string;
  source_note_id: string;
  target_note_id: string;
  link_type: string;
  strength: number;
  ai_generated: boolean;
  created_at: string;
}

export interface ProjectConversation {
  id: string;
  project_id: string;
  user_id: string;
  message_type: 'user' | 'assistant';
  content: string;
  context_data: Record<string, any>;
  created_at: string;
}

export interface ProjectFilters {
  status?: 'active' | 'archived' | 'hibernating';
  searchTerm?: string;
}
