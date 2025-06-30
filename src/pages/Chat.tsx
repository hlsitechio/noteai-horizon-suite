
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, Brain, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useEnhancedAIChat, ChatMessage } from '../hooks/useEnhancedAIChat';
import { Badge } from '@/components/ui/badge';

const Chat: React.FC = () => {
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
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Chat Assistant
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Enhanced AI
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    GPT-4 Powered
                  </Badge>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col border-2 border-purple-200/50 shadow-lg">
          <CardContent className="flex-1 flex flex-col p-4">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mx-auto w-fit mb-4">
                      <Brain className="w-12 h-12 mx-auto text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Welcome to your AI Assistant
                    </h3>
                    <p className="text-muted-foreground">
                      Start a conversation with your enhanced AI assistant powered by GPT-4
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                          msg.isUser
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200'
                        }`}
                      >
                        {!msg.isUser && (
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600">AI Assistant</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <div className="text-xs opacity-70 mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {(chatMutation.isPending || isLoading) && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-600">AI Assistant</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-sm text-gray-600 ml-2">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything or describe what you need help with..."
                disabled={chatMutation.isPending || isLoading}
                className="flex-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 bg-white"
              />
              <Button
                onClick={handleSend}
                disabled={chatMutation.isPending || isLoading || !message.trim()}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4"
              >
                {(chatMutation.isPending || isLoading) ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
