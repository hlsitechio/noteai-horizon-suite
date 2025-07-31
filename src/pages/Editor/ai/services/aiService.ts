import { supabase } from '@/integrations/supabase/client';
import { AIRequest, AIResponse, AIContext } from '../types/ai';

class AIService {
  private async getAIModels() {
    return [
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'openai' as const,
        capabilities: ['text_generation', 'translation', 'summarization', 'analysis'] as const,
        maxTokens: 16000,
        costPer1000Tokens: 0.0015,
        description: 'Fast and cost-effective for most tasks'
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai' as const,
        capabilities: ['text_generation', 'translation', 'summarization', 'analysis', 'creative_writing'] as const,
        maxTokens: 128000,
        costPer1000Tokens: 0.03,
        description: 'Most capable model for complex tasks'
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'anthropic' as const,
        capabilities: ['text_generation', 'analysis', 'conversation'] as const,
        maxTokens: 200000,
        costPer1000Tokens: 0.0025,
        description: 'Fast and efficient for everyday tasks'
      }
    ];
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    try {
      // Call the enhanced AI copilot edge function
      const { data, error } = await supabase.functions.invoke('ai-copilot-enhanced', {
        body: {
          action: request.action,
          text: request.text,
          noteId: request.noteId,
          customPrompt: request.customPrompt,
          targetLanguage: request.targetLanguage,
          context: await this.buildContext(request),
          sessionId: request.sessionId,
        }
      });

      if (error) {
        throw new Error((error as any)?.message || 'AI processing failed');
      }

      if (!data || !data.result) {
        throw new Error('Invalid response from AI service');
      }

      return {
        result: data.result,
        sessionId: data.sessionId || request.sessionId || 'unknown',
        processingTime: data.processingTime || 0,
        model: data.model || 'gpt-4o-mini',
        tokensUsed: data.tokensUsed,
        confidence: data.confidence,
        similarNotes: data.similarNotes || [],
        suggestions: data.suggestions || [],
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  private async buildContext(request: AIRequest): Promise<AIContext> {
    const context: AIContext = {
      selectedText: request.text,
    };

    // Get current note context if noteId provided
    if (request.noteId) {
      try {
        const { data: note } = await supabase
          .from('notes_v2')
          .select('id, title, content, content_type, tags')
          .eq('id', request.noteId)
          .maybeSingle();

        if (note) {
          context.currentNote = {
            id: note.id,
            title: note.title,
            content: note.content,
            category: note.content_type || 'general',
            tags: note.tags || [],
          };
        }
      } catch (error) {
        console.warn('Failed to fetch note context:', error);
      }
    }

    // Get recent notes for additional context
    try {
      const { data: recentNotes } = await supabase
        .from('notes_v2')
        .select('id, title, content')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (recentNotes) {
        context.recentNotes = recentNotes;
      }
    } catch (error) {
      console.warn('Failed to fetch recent notes:', error);
    }

    return context;
  }

  async submitFeedback(sessionId: string, interactionId: string, rating: number, feedback?: string): Promise<void> {
    // Simplified feedback storage - using existing table structure
    console.log('AI Feedback:', { sessionId, interactionId, rating, feedback });
  }

  async getSessionHistory(sessionId: string) {
    // Simplified for now - return empty array
    return [];
  }

  async getAvailableModels() {
    return this.getAIModels();
  }
}

export const aiService = new AIService();