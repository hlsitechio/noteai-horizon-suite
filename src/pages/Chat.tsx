
import React, { useState } from 'react';
import { useEnhancedAIChat, ChatMessage } from '@/hooks/useEnhancedAIChat';
import { useToast } from '@/hooks/useToast';
import { StructuredOutputDemo } from '@/components/StructuredOutputDemo';
import { ChatHeader } from '@/components/Chat/ChatHeader';
import { ChatContainer } from '@/components/Chat/ChatContainer';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your GPU-accelerated AI assistant powered by DeepSeek R1. I can help you organize your thoughts, brainstorm ideas, and improve your notes with enhanced performance. What would you like to work on today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const { 
    sendMessage, 
    isLoading, 
    isProcessingLocally, 
    gpuCapabilities 
  } = useEnhancedAIChat();
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');

    try {
      // Send all messages for context
      const updatedMessages = [...messages, userMessage];
      const aiResponse = await sendMessage(updatedMessages);
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the user message if AI response failed
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      setInput(currentInput); // Restore the input
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        content: 'Hello! I\'m your GPU-accelerated AI assistant powered by DeepSeek R1. I can help you organize your thoughts, brainstorm ideas, and improve your notes with enhanced performance. What would you like to work on today?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    toast.success('New chat started');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)]">
      <ChatHeader
        gpuCapabilities={gpuCapabilities}
        onNewChat={handleNewChat}
        isLoading={isLoading}
      />

      <StructuredOutputDemo />

      <ChatContainer
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
        isLoading={isLoading}
        isProcessingLocally={isProcessingLocally}
      />
    </div>
  );
};

export default Chat;
