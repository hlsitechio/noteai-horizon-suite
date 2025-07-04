
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useEnhancedAIChat, ChatMessage } from '../hooks/useEnhancedAIChat';
import FormattedMessage from '../components/Chat/FormattedMessage';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { sendMessage: sendAIMessage } = useEnhancedAIChat();

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              AI Chat Assistant
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation with your AI assistant</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <FormattedMessage content={msg.content} isUser={msg.isUser} />
                      </div>
                    </div>
                  ))
                )}
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={chatMutation.isPending}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={chatMutation.isPending || !message.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
