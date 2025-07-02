
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const useAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (messages: ChatMessage[]): Promise<string> => {
    setIsLoading(true);
    
    try {
      console.log('Sending chat message to AI:', { messageCount: messages.length });
      
      // Convert messages to OpenAI format
      const openAIMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chat-openrouter', {
        body: { 
          messages: openAIMessages,
          model: 'deepseek/deepseek-r1-0528:free'
        }
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

      console.log('AI response received successfully');
      return data.message;

    } catch (error: any) {
      console.error('Error sending chat message:', error);
      
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

  return {
    sendMessage,
    isLoading
  };
};
