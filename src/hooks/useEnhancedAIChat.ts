
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGPUAcceleration } from './useGPUAcceleration';
import { GPUTextProcessingService } from '@/services/gpuTextProcessing';

// Export the ChatMessage type so it can be used by other components
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const useEnhancedAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingLocally, setIsProcessingLocally] = useState(false);
  const { toast } = useToast();
  const { capabilities } = useGPUAcceleration();
  const gpuServiceRef = useRef<GPUTextProcessingService | null>(null);

  const initializeGPUService = useCallback(() => {
    if (!gpuServiceRef.current && capabilities.isInitialized) {
      gpuServiceRef.current = new GPUTextProcessingService(capabilities.preferredDevice);
      console.log(`GPU service initialized with device: ${capabilities.preferredDevice}`);
    }
    return gpuServiceRef.current;
  }, [capabilities]);

  const analyzeMessageSentiment = useCallback(async (message: string) => {
    const gpuService = initializeGPUService();
    if (!gpuService) return null;

    try {
      setIsProcessingLocally(true);
      const sentiment = await gpuService.classifyText(message);
      console.log('Message sentiment analysis:', sentiment);
      return sentiment;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return null;
    } finally {
      setIsProcessingLocally(false);
    }
  }, [initializeGPUService]);

  const generateMessageEmbeddings = useCallback(async (messages: string[]) => {
    const gpuService = initializeGPUService();
    if (!gpuService) return null;

    try {
      setIsProcessingLocally(true);
      const embeddings = await gpuService.generateEmbeddings(messages);
      console.log(`Generated embeddings for ${messages.length} messages using GPU`);
      return embeddings;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      return null;
    } finally {
      setIsProcessingLocally(false);
    }
  }, [initializeGPUService]);

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
      console.log('Sending enhanced chat message to AI:', { 
        messageCount: messages.length,
        gpuDevice: capabilities.preferredDevice,
        gpuSupported: capabilities.webGPUSupported || capabilities.webGLSupported,
        hasStructuredOutput: !!responseFormat
      });
      
      // Analyze sentiment of the last user message if GPU is available
      const lastUserMessage = messages.filter(m => m.isUser).pop();
      if (lastUserMessage && capabilities.preferredDevice !== 'cpu') {
        await analyzeMessageSentiment(lastUserMessage.content);
      }
      
      // Convert messages to OpenAI format
      const openAIMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      const requestBody: any = { 
        messages: openAIMessages,
        model: 'deepseek/deepseek-r1-0528:free'
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

      console.log('Enhanced AI response received successfully', {
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
    isProcessingLocally,
    analyzeMessageSentiment,
    generateMessageEmbeddings,
    gpuCapabilities: capabilities,
    gpuService: gpuServiceRef.current,
  };
};
