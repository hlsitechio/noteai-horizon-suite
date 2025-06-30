
import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const useEnhancedAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (messages: ChatMessage[]): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Simulate AI response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userMessage = messages[messages.length - 1]?.content || '';
      
      // Simple response logic for demo
      if (userMessage.toLowerCase().includes('help')) {
        return "I'm here to help! What would you like assistance with?";
      } else if (userMessage.toLowerCase().includes('improve')) {
        return "Here are some suggestions to improve your text: Consider adding more detail, checking grammar, and ensuring clarity.";
      } else if (userMessage.toLowerCase().includes('summarize')) {
        return "Here's a summary: The selected text appears to be about a specific topic that could benefit from condensation and key point extraction.";
      } else {
        return "I understand your request. Let me help you with that. Could you provide more specific details about what you'd like me to do?";
      }
    } catch (error) {
      console.error('AI chat error:', error);
      return "I apologize, but I encountered an error. Please try again.";
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading
  };
};
