/**
 * AI Integration Hook (Simplified Browser-Compatible Version)
 * Direct AI operations without worker thread dependencies
 */

import { useState } from 'react';
import { useToast } from './useToast';
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage } from './useAIChat';

export const useWorkerAIIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Direct AI Chat (simplified without worker support)
  const sendChatMessage = async (messages: ChatMessage[]): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Use direct Supabase call
      const { data, error } = await supabase.functions.invoke('chat-openrouter', {
        body: { messages }
      });
      
      if (error) throw error;
      
      setIsLoading(false);
      return data?.content || '';
    } catch (error) {
      console.error('AI chat failed:', error);
      setIsLoading(false);
      toast.error('Failed to send message');
      throw error;
    }
  };

  // Direct text generation (simplified)
  const generateText = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-writing-assistant', {
        body: { 
          prompt,
          mode: 'generate'
        }
      });
      
      if (error) throw error;
      
      setIsLoading(false);
      return data?.content || '';
    } catch (error) {
      console.error('Text generation failed:', error);
      setIsLoading(false);
      toast.error('Failed to generate text');
      throw error;
    }
  };

  // Direct tag generation (simplified)
  const generateTags = async (title: string, content: string): Promise<string[]> => {
    setIsLoading(true);
    
    try {
      const prompt = `Generate relevant tags for this note:\nTitle: ${title}\nContent: ${content.slice(0, 500)}...`;
      const response = await generateText(prompt);
      
      // Extract tags from response
      const tags = response.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      setIsLoading(false);
      return tags.slice(0, 5); // Limit to 5 tags
    } catch (error) {
      console.error('Tag generation failed:', error);
      setIsLoading(false);
      toast.error('Failed to generate tags');
      return [];
    }
  };

  // Direct RAG Chat (simplified)
  const sendRAGMessage = async (
    messages: ChatMessage[], 
    useRAG: boolean = true,
    searchQuery?: string
  ): Promise<any> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-rag', {
        body: {
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          })),
          model: 'deepseek/deepseek-r1-0528:free',
          useRAG,
          searchQuery
        }
      });
      
      if (error) throw error;
      
      setIsLoading(false);
      
      return {
        message: data?.message || '',
        model: data?.model || 'deepseek/deepseek-r1-0528:free',
        usage: data?.usage,
        ragEnabled: data?.ragEnabled || false,
        notesUsed: data?.notesUsed || 0,
        relevantNotes: data?.relevantNotes || []
      };
    } catch (error) {
      console.error('RAG chat failed:', error);
      setIsLoading(false);
      toast.error('AI chat failed');
      throw error;
    }
  };

  return {
    sendChatMessage,
    generateTags,
    sendRAGMessage,
    isLoading
  };
};