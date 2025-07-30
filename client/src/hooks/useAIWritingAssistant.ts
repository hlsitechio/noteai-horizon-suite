import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';

export type AIMode = 
  | 'continue' 
  | 'enhance' 
  | 'summarize' 
  | 'expand' 
  | 'rewrite' 
  | 'grammar' 
  | 'suggest' 
  | 'complete'
  | 'outline'
  | 'brainstorm';

export type AITone = 'professional' | 'casual' | 'friendly' | 'formal' | 'creative' | 'academic';
export type AILength = 'short' | 'medium' | 'long';

interface AIWritingRequest {
  mode: AIMode;
  content: string;
  context?: string;
  tone?: AITone;
  length?: AILength;
  selectedText?: string;
  cursorPosition?: number;
}

interface AIWritingResponse {
  result: string;
  mode: AIMode;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const useAIWritingAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<AIWritingResponse | null>(null);
  const { toast } = useToast();

  const processWithAI = useCallback(async (request: AIWritingRequest): Promise<string> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-writing-assistant-enhanced', {
        body: request
      });

      if (error) {
        throw error;
      }

      if (!data?.result) {
        throw new Error('No result received from AI assistant');
      }

      setLastResponse(data);
      
      // Show success toast with mode-specific message
      const modeMessages = {
        continue: 'Content continued successfully',
        enhance: 'Text enhanced successfully',
        summarize: 'Summary generated successfully', 
        expand: 'Content expanded successfully',
        rewrite: 'Text rewritten successfully',
        grammar: 'Grammar checked and improved',
        suggest: 'Writing suggestions generated',
        complete: 'Text completed successfully',
        outline: 'Outline created successfully',
        brainstorm: 'Ideas brainstormed successfully'
      };

      toast.success(modeMessages[request.mode] || 'AI processing completed');
      
      return data.result;

    } catch (error) {
      console.error('AI Writing Assistant error:', error);
      toast.error(`AI processing failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Convenience methods for specific AI operations
  const continueWriting = useCallback((content: string, tone: AITone = 'professional') => 
    processWithAI({ mode: 'continue', content, tone }), [processWithAI]);

  const enhanceText = useCallback((selectedText: string, tone: AITone = 'professional') => 
    processWithAI({ mode: 'enhance', content: '', selectedText, tone }), [processWithAI]);

  const summarizeContent = useCallback((content: string, length: AILength = 'medium') => 
    processWithAI({ mode: 'summarize', content, length }), [processWithAI]);

  const expandText = useCallback((selectedText: string, tone: AITone = 'professional') => 
    processWithAI({ mode: 'expand', content: '', selectedText, tone }), [processWithAI]);

  const rewriteText = useCallback((selectedText: string, tone: AITone = 'professional') => 
    processWithAI({ mode: 'rewrite', content: '', selectedText, tone }), [processWithAI]);

  const checkGrammar = useCallback((content: string) => 
    processWithAI({ mode: 'grammar', content }), [processWithAI]);

  const getSuggestions = useCallback((content: string) => 
    processWithAI({ mode: 'suggest', content }), [processWithAI]);

  const completeText = useCallback((content: string, cursorPosition: number) => 
    processWithAI({ mode: 'complete', content, cursorPosition }), [processWithAI]);

  const createOutline = useCallback((content: string) => 
    processWithAI({ mode: 'outline', content }), [processWithAI]);

  const brainstormIdeas = useCallback((content: string) => 
    processWithAI({ mode: 'brainstorm', content }), [processWithAI]);

  return {
    // Core functionality
    processWithAI,
    isLoading,
    lastResponse,
    
    // Convenience methods
    continueWriting,
    enhanceText,
    summarizeContent,
    expandText,
    rewriteText,
    checkGrammar,
    getSuggestions,
    completeText,
    createOutline,
    brainstormIdeas,
  };
};