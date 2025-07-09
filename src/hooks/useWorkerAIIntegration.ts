/**
 * Worker AI Integration Hook
 * Manages AI operations with intelligent worker thread usage
 */

import { useState } from 'react';
import { useToast } from './useToast';
import { usePerformanceMonitor } from './usePerformanceMonitor';
import { workerPool } from '@/workers/worker-pool';
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage } from './useAIChat';

export const useWorkerAIIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { shouldUseWorkers } = usePerformanceMonitor();

  // Enhanced AI Chat with worker support
  const sendChatMessage = async (messages: ChatMessage[]): Promise<string> => {
    setIsLoading(true);
    
    try {
      const useWorkerThreads = shouldUseWorkers();
      console.log(`[AI Integration] Using ${useWorkerThreads ? 'worker threads' : 'main thread'}`);
      
      let processedMessages;
      
      if (useWorkerThreads) {
        // Use worker thread for message processing
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

        processedMessages = workerResult.data.processedMessages;
      } else {
        // Process on main thread if workers are overloaded
        processedMessages = messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        }));
      }

      // Make API call
      const { data, error } = await supabase.functions.invoke('chat-openrouter', {
        body: { 
          messages: processedMessages,
          model: 'deepseek/deepseek-r1-0528:free'
        }
      });

      if (error) {
        throw new Error(`Failed to get AI response: ${error.message}`);
      }

      if (!data?.message) {
        throw new Error('Invalid response format from AI service');
      }

      return data.message;

    } catch (error: any) {
      console.error('[AI Integration] Chat error:', error);
      
      if (error.message?.includes('Worker')) {
        toast.error('AI processing failed. Using fallback method.');
        // Could implement fallback here
      } else {
        toast.error(`AI chat failed: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced Auto-tagging with worker support
  const generateTags = async (title: string, content: string): Promise<string[]> => {
    if (!title.trim() && !content.trim()) return [];

    setIsLoading(true);
    
    try {
      const useWorkerThreads = shouldUseWorkers();
      console.log(`[AI Integration] Tag generation using ${useWorkerThreads ? 'worker threads' : 'main thread'}`);
      
      let requestBody;
      
      if (useWorkerThreads) {
        // Use worker thread for text analysis
        const workerResult = await workerPool.runAITask({
          type: 'auto-tagging',
          payload: { title, content }
        });

        if (!workerResult.success) {
          throw new Error(workerResult.error || 'Worker processing failed');
        }

        requestBody = workerResult.data.requestBody;
        
        // Log analysis results for better tagging
        const analysis = workerResult.data.analysis;
        console.log('[AI Integration] Text analysis:', {
          wordCount: analysis.wordCount,
          contentType: analysis.contentType,
          complexity: analysis.complexity,
          keyPhrases: analysis.keyPhrases.slice(0, 5) // Log first 5 key phrases
        });
      } else {
        requestBody = { title, content };
      }

      // Make API call
      const { data, error } = await supabase.functions.invoke('generate-note-tags', {
        body: requestBody
      });

      if (error) {
        throw new Error(`Failed to generate tags: ${error.message}`);
      }

      if (!data?.tags || !Array.isArray(data.tags)) {
        throw new Error('Invalid response from tag generation service');
      }

      if (data.tags.length > 0) {
        toast.success(`Generated ${data.tags.length} tags automatically`);
      } else {
        toast.info('No relevant tags could be generated');
      }

      return data.tags;

    } catch (error: any) {
      console.error('[AI Integration] Tag generation error:', error);
      
      if (error.message?.includes('Worker')) {
        toast.error('Tag generation failed. Using simpler method.');
      } else {
        toast.error(`Failed to generate tags: ${error.message}`);
      }
      
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced RAG Chat with worker support
  const sendRAGMessage = async (
    messages: ChatMessage[], 
    useRAG: boolean = true,
    searchQuery?: string
  ): Promise<any> => {
    setIsLoading(true);
    
    try {
      const useWorkerThreads = shouldUseWorkers();
      console.log(`[AI Integration] RAG chat using ${useWorkerThreads ? 'worker threads' : 'main thread'}`);
      
      let requestBody;
      
      if (useWorkerThreads) {
        // Use worker thread for message processing
        const workerResult = await workerPool.runAITask({
          type: 'rag-chat',
          payload: {
            messages,
            model: 'deepseek/deepseek-r1-0528:free',
            useRAG,
            searchQuery
          }
        });

        if (!workerResult.success) {
          throw new Error(workerResult.error || 'Worker processing failed');
        }

        requestBody = {
          messages: workerResult.data.messages,
          model: workerResult.data.model,
          useRAG: workerResult.data.useRAG,
          searchQuery: workerResult.data.searchQuery
        };
      } else {
        // Process on main thread
        requestBody = {
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          })),
          model: 'deepseek/deepseek-r1-0528:free',
          useRAG,
          searchQuery
        };
      }

      // Make API call
      const { data, error } = await supabase.functions.invoke('chat-with-rag', {
        body: requestBody
      });

      if (error) {
        throw new Error(`Failed to get AI response: ${error.message}`);
      }

      if (!data?.message) {
        throw new Error('Invalid response format from AI service');
      }

      return {
        message: data.message,
        model: data.model || 'deepseek/deepseek-r1-0528:free',
        usage: data.usage,
        ragEnabled: data.ragEnabled || false,
        notesUsed: data.notesUsed || 0,
        relevantNotes: data.relevantNotes || []
      };

    } catch (error: any) {
      console.error('[AI Integration] RAG chat error:', error);
      
      if (error.message?.includes('Worker')) {
        toast.error('AI processing failed. Using fallback method.');
      } else {
        toast.error(`AI chat failed: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendChatMessage,
    generateTags,
    sendRAGMessage,
    isLoading
  };
};