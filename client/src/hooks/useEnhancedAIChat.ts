// Temporary placeholder for missing Enhanced AI Chat hook
import { useState } from 'react';

export const useEnhancedAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return {
    messages,
    isLoading,
    sendMessage: () => {},
    clearMessages: () => {},
  };
};