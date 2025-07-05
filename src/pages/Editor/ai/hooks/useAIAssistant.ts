import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { aiService } from '../services/aiService';
import { AIRequest, AIResponse, AIInteraction, AIModel } from '../types/ai';

interface UseAIAssistantProps {
  noteId?: string;
}

export const useAIAssistant = ({ noteId }: UseAIAssistantProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [sessionHistory, setSessionHistory] = useState<AIInteraction[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('gpt-4o-mini');
  const [error, setError] = useState<string | null>(null);
  
  const sessionId = useRef<string>(Date.now().toString());

  const processRequest = useCallback(async (request: AIRequest): Promise<AIResponse | null> => {
    if (!request.text.trim() && request.action !== 'custom') {
      toast.error('Please provide text to process');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const enhancedRequest: AIRequest = {
        ...request,
        sessionId: sessionId.current,
        noteId,
      };

      const response = await aiService.processRequest(enhancedRequest);
      
      if (response) {
        setCurrentResponse(response);
        
        // Add to session history
        const interaction: AIInteraction = {
          id: Date.now().toString(),
          timestamp: new Date(),
          request: enhancedRequest,
          response,
        };
        
        setSessionHistory(prev => [...prev, interaction]);
        
        toast.success(`AI processing completed in ${response.processingTime}ms`);
        return response;
      }
    } catch (error) {
      console.error('AI processing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'AI processing failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
    
    return null;
  }, [noteId]);

  const clearSession = useCallback(() => {
    setSessionHistory([]);
    setCurrentResponse(null);
    setError(null);
    sessionId.current = Date.now().toString();
  }, []);

  const switchModel = useCallback(async (modelId: string) => {
    setCurrentModel(modelId);
    toast.success(`Switched to ${modelId}`);
  }, []);

  const rateResponse = useCallback(async (interactionId: string, rating: number, feedback?: string) => {
    setSessionHistory(prev => 
      prev.map(interaction => 
        interaction.id === interactionId 
          ? { ...interaction, rating, feedback }
          : interaction
      )
    );
    
    // Send rating to analytics service
    try {
      await aiService.submitFeedback(sessionId.current, interactionId, rating, feedback);
      toast.success('Thanks for your feedback!');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  }, []);

  const getUsageStats = useCallback(() => {
    const totalRequests = sessionHistory.length;
    const totalTokens = sessionHistory.reduce((sum, interaction) => 
      sum + (interaction.response.tokensUsed || 0), 0
    );
    const averageResponseTime = sessionHistory.length > 0 
      ? sessionHistory.reduce((sum, interaction) => sum + interaction.response.processingTime, 0) / sessionHistory.length
      : 0;

    return {
      totalRequests,
      totalTokens,
      averageResponseTime,
      sessionId: sessionId.current,
    };
  }, [sessionHistory]);

  return {
    // State
    isLoading,
    currentResponse,
    sessionHistory,
    currentModel,
    error,
    
    // Actions
    processRequest,
    clearSession,
    switchModel,
    rateResponse,
    
    // Utils
    getUsageStats,
  };
};