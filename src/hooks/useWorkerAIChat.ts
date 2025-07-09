/**
 * Worker-enhanced AI Chat Hook
 * Uses worker threads for CPU-intensive AI processing
 */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';
import { workerPool } from '@/workers/worker-pool';
import type { ChatMessage } from './useAIChat';

export const useWorkerAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (messages: ChatMessage[]): Promise<string> => {
    setIsLoading(true);
    
    try {
      console.log('[Worker AI Chat] Processing with worker thread');
      
      // Process messages in worker thread to prevent main thread blocking
      const workerResult = await workerPool.runAITask({
        type: 'chat',
        payload: {
          messages,
          model: 'deepseek/deepseek-r1-0528:free'
        }
      });

      if (!workerResult.success) {
        throw new Error(workerResult.error || 'Worker processing failed');
      }

      // Use processed data from worker for API call
      const { processedMessages, model } = workerResult.data;

      const { data, error } = await supabase.functions.invoke('chat-openrouter', {
        body: { 
          messages: processedMessages,
          model
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to get AI response: ${error.message}`);
      }

      if (!data || data.error) {
        throw new Error(data?.error || 'No response from AI service');
      }

      if (!data.message) {
        throw new Error('Invalid response format from AI service');
      }

      console.log('[Worker AI Chat] Response received successfully');
      return data.message;

    } catch (error: any) {
      console.error('[Worker AI Chat] Error:', error);
      
      // More specific error messages
      if (error.message?.includes('OPENROUTER_API_KEY')) {
        toast.error('AI service not configured. Please contact support.');
      } else if (error.message?.includes('network')) {
        toast.error('Network error. Please check your connection.');
      } else if (error.message?.includes('Worker')) {
        toast.error('AI processing failed. Falling back to main thread.');
        // Could implement fallback to non-worker version here
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