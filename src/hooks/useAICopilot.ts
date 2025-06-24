
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CopilotRequest {
  action: 'improve' | 'translate' | 'summarize' | 'expand' | 'simplify' | 'custom';
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
  const { toast } = useToast();

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
      const { data, error } = await supabase
        .from('ai_copilot_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch sessions: ${error.message}`);
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching user sessions:', error);
      toast.error(`Failed to fetch sessions: ${error.message}`);
      return [];
    }
  };

  const rateFeedback = async (sessionId: string, rating: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('ai_copilot_sessions')
        .update({ feedback_rating: rating })
        .eq('id', sessionId);

      if (error) {
        throw new Error(`Failed to save feedback: ${error.message}`);
      }

      toast.success('Thank you for your feedback!');
    } catch (error: any) {
      console.error('Error saving feedback:', error);
      toast.error(`Failed to save feedback: ${error.message}`);
    }
  };

  const getSessionAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_copilot_sessions')
        .select('session_type, processing_time, model_config, feedback_rating, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        throw new Error(`Failed to fetch analytics: ${error.message}`);
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      return [];
    }
  };

  return {
    processText,
    getUserSessions,
    rateFeedback,
    getSessionAnalytics,
    isLoading,
    currentSession
  };
};
