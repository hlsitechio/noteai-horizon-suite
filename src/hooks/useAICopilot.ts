
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CopilotRequest {
  action: 'improve' | 'continue' | 'translate' | 'summarize' | 'expand' | 'simplify' | 'change-tone' | 'change-style' | 'longer' | 'shorter' | 'copy-text' | 'custom';
  text: string;
  noteId?: string;
  targetLanguage?: string;
  customPrompt?: string;
  sessionId?: string;
}

export interface CopilotResponse {
  result: string;
  sessionId: string;
  processingTime: number;
  model: string;
  tokensUsed?: number;
  similarNotes?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

export interface CopilotSession {
  id: string;
  session_type: string;
  original_content: string;
  processed_content: string;
  model_config: any;
  processing_time: number;
  feedback_rating?: number;
  created_at: string;
  updated_at: string;
}

export const useAICopilot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<string | null>(null);

  const processText = async (request: CopilotRequest): Promise<CopilotResponse> => {
    setIsLoading(true);
    
    try {
      console.log('Processing AI Copilot request:', { 
        action: request.action,
        textLength: request.text.length,
        noteId: request.noteId,
        sessionId: request.sessionId
      });

      const { data, error } = await supabase.functions.invoke('ai-copilot-enhanced', {
        body: request
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`AI processing failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No response from AI service');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('AI Copilot response received:', {
        processingTime: data.processingTime,
        model: data.model,
        tokensUsed: data.tokensUsed,
        similarNotesCount: data.similarNotes?.length || 0
      });

      setCurrentSession(data.sessionId);
      
      return data as CopilotResponse;

    } catch (error: any) {
      console.error('Error in AI Copilot processing:', error);
      
      if (error.message?.includes('limit exceeded')) {
        toast.error('Daily AI usage limit reached. Please upgrade your plan or try again tomorrow.');
      } else if (error.message?.includes('OPENROUTER_API_KEY')) {
        toast.error('AI service not configured. Please contact support.');
      } else if (error.message?.includes('authentication') || error.message?.includes('auth')) {
        toast.error('Please log in to use the AI assistant.');
      } else {
        toast.error(`AI processing failed: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserSessions = async (limit: number = 10): Promise<CopilotSession[]> => {
    try {
      // Since ai_copilot_sessions table doesn't exist, return empty array for now
      // TODO: Create ai_copilot_sessions table if AI copilot functionality is needed
      console.warn('AI Copilot sessions table not available in current schema');
      return [];
    } catch (error: any) {
      console.error('Error fetching user sessions:', error);
      toast.error(`Failed to fetch sessions: ${error.message}`);
      return [];
    }
  };

  const rateFeedback = async (sessionId: string, rating: number): Promise<void> => {
    try {
      // Since ai_copilot_sessions table doesn't exist, just log for now
      console.warn('AI Copilot feedback not available - sessions table missing');
      toast.success('Thank you for your feedback!');
    } catch (error: any) {
      console.error('Error saving feedback:', error);
      toast.error(`Failed to save feedback: ${error.message}`);
    }
  };

  const getSessionAnalytics = async () => {
    try {
      // Since ai_copilot_sessions table doesn't exist, return mock data
      console.warn('AI Copilot analytics not available - sessions table missing');
      return {
        totalSessions: 0,
        averageProcessingTime: 0,
        feedbackStats: { positive: 0, negative: 0 },
        usageByType: {},
        recentActivity: []
      };
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      return {
        totalSessions: 0,
        averageProcessingTime: 0,
        feedbackStats: { positive: 0, negative: 0 },
        usageByType: {},
        recentActivity: []
      };
    }
  };

  return {
    processWithAI: processText,
    processText, // Keep this for compatibility
    getUserSessions,
    rateFeedback,
    getSessionAnalytics,
    isProcessing: isLoading,
    isLoading, // Keep this for compatibility  
    error: null,
    currentSession: null // Add this for compatibility
  };
};
