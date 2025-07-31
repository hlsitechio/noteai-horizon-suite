
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface RAGChatResponse {
  message: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  ragEnabled: boolean;
  notesUsed: number;
  relevantNotes: Array<{
    id: string;
    title: string;
    relevanceScore: number;
  }>;
}

export const useRAGChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (
    messages: ChatMessage[], 
    useRAG: boolean = true,
    searchQuery?: string
  ): Promise<RAGChatResponse> => {
    setIsLoading(true);
    
    try {
      console.log('Sending RAG-enhanced chat message:', { 
        messageCount: messages.length,
        useRAG,
        searchQuery: searchQuery?.slice(0, 50) + (searchQuery && searchQuery.length > 50 ? '...' : '')
      });
      
      // Convert messages to OpenAI format
      const openAIMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chat-with-rag', {
        body: { 
          messages: openAIMessages,
          model: 'deepseek/deepseek-r1-0528:free',
          useRAG,
          searchQuery
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to get AI response: ${(error as any)?.message || 'Unknown error'}`);
      }

      if (!data) {
        throw new Error('No response from AI service');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.message) {
        throw new Error('Invalid response format from AI service');
      }

      console.log('RAG-enhanced AI response received:', {
        ragEnabled: data.ragEnabled,
        notesUsed: data.notesUsed,
        hasUsage: !!data.usage
      });

      return {
        message: data.message,
        model: data.model || 'deepseek/deepseek-r1-0528:free',
        usage: data.usage,
        ragEnabled: data.ragEnabled || false,
        notesUsed: data.notesUsed || 0,
        relevantNotes: data.relevantNotes || []
      };

    } catch (error: any) {
      console.error('Error sending RAG-enhanced chat message:', error);
      
      // More specific error messages based on the error type
      if (error.message?.includes('OPENROUTER_API_KEY')) {
        toast.error('AI service not configured. Please contact support.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (error.message?.includes('Authentication') || error.message?.includes('auth')) {
        toast.error('Please log in to use the AI assistant.');
      } else if (error.message?.includes('Rate limit')) {
        toast.error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.message?.includes('credits') || error.message?.includes('quota')) {
        toast.error('API quota exceeded. Please try again later.');
      } else {
        toast.error(`AI chat failed: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};
