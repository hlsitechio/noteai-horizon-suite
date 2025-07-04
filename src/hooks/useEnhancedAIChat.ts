import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';

// Export the ChatMessage type so it can be used by other components
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const useEnhancedAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (
    messages: ChatMessage[], 
    responseFormat?: {
      type: 'json_schema';
      json_schema: {
        name: string;
        strict: boolean;
        schema: object;
      };
    }
  ): Promise<string> => {
    setIsLoading(true);
    
    try {
      console.log('Sending chat message to AI:', { 
        messageCount: messages.length,
        hasStructuredOutput: !!responseFormat
      });
      
      // Convert messages to OpenAI format
      const openAIMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      const requestBody: any = { 
        messages: openAIMessages,
        model: 'deepseek/deepseek-chat-v3-0324:free'
      };

      // Add structured output format if provided
      if (responseFormat) {
        requestBody.response_format = responseFormat;
      }

      const { data, error } = await supabase.functions.invoke('chat-openrouter', {
        body: requestBody
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to get AI response: ${error.message}`);
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

      console.log('AI response received successfully', {
        structured: data.structured || false
      });
      return data.message;

    } catch (error: any) {
      console.error('Error sending enhanced chat message:', error);
      
      // More specific error messages
      if (error.message?.includes('OPENROUTER_API_KEY')) {
        toast.error('AI service not configured. Please contact support.');
      } else if (error.message?.includes('network')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(`AI chat failed: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendStructuredMessage = async (
    messages: ChatMessage[],
    schema: {
      name: string;
      schema: object;
      description?: string;
    }
  ): Promise<string> => {
    const responseFormat = {
      type: 'json_schema' as const,
      json_schema: {
        name: schema.name,
        strict: true,
        schema: schema.schema
      }
    };

    return sendMessage(messages, responseFormat);
  };

  return {
    sendMessage,
    sendStructuredMessage,
    isLoading,
  };
};
