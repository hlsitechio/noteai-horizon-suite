
import React, { useState } from 'react';
import { Send, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import { useEnhancedAIChat, ChatMessage } from '../../hooks/useEnhancedAIChat';
import DynamicMobileHeader from '../components/DynamicMobileHeader';

const MobileChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { sendMessage: sendAIMessage, isLoading } = useEnhancedAIChat();

  // Use TanStack Query mutation for chat messages
  const chatMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: newMessage,
        isUser: true,
        timestamp: new Date()
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      const aiResponse = await sendAIMessage(updatedMessages);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      return { updatedMessages, aiMessage };
    },
    onSuccess: ({ updatedMessages, aiMessage }) => {
      setMessages([...updatedMessages, aiMessage]);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    },
  });

  const handleSend = async () => {
    if (message.trim()) {
      chatMutation.mutate(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <DynamicMobileHeader 
        title="AI Chat" 
        rightContent={
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
            <Brain className="w-3 h-3 mr-1" />
            AI Assistant
          </Badge>
        }
      />
      
      <div className="flex-1 flex flex-col p-4">
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mx-auto w-fit mb-4">
                  <Brain className="w-12 h-12 mx-auto text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Assistant Ready
                </h3>
                <p className="text-muted-foreground text-sm">
                  Ask me anything or get help with your notes
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-muted border'
                    }`}
                  >
                    {!msg.isUser && (
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-3 h-3 text-purple-600" />
                        <span className="text-xs font-medium text-purple-600">AI</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {(chatMutation.isPending || isLoading) && (
              <div className="flex justify-start">
                <div className="bg-muted border p-3 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-3 h-3 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">AI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2 p-3 bg-muted/50 rounded-xl">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={chatMutation.isPending || isLoading}
            className="flex-1 bg-background"
          />
          <Button
            onClick={handleSend}
            disabled={chatMutation.isPending || isLoading || !message.trim()}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {(chatMutation.isPending || isLoading) ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileChat;
