
import React, { useState } from 'react';
import { Plus, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAIChat, ChatMessage } from '@/hooks/useAIChat';
import { useToast } from '@/hooks/useToast';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant powered by Llama 3.1. I can help you organize your thoughts, brainstorm ideas, and improve your notes. What would you like to work on today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useAIChat();
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
        content: 'Hello! I\'m your AI assistant powered by Llama 3.1. I can help you organize your thoughts, brainstorm ideas, and improve your notes. What would you like to work on today?',
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
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              AI Assistant
            </h1>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Llama 3.1
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Get help with your notes and ideas using advanced AI
          </p>
        </div>
        <Button size="sm" onClick={handleNewChat} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Messages */}
      <Card className="flex-1">
        <CardContent className="p-0">
          <div className="flex flex-col h-full justify-end">
            <div className="flex-1 overflow-y-auto max-h-[500px] p-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-4 ${
                      message.isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!message.isUser && (
                      <Avatar className="w-8 h-8 bg-blue-500 flex-shrink-0">
                        <AvatarFallback className="text-white">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl ${
                        message.isUser
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.isUser && (
                      <Avatar className="w-8 h-8 bg-purple-500 flex-shrink-0">
                        <AvatarFallback className="text-white">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-4 justify-start">
                    <Avatar className="w-8 h-8 bg-blue-500">
                      <AvatarFallback className="text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-bl-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="border-t dark:border-gray-700 p-6">
              <div className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your notes or ideas..."
                  className="resize-none rounded-xl min-h-[60px]"
                  rows={2}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <Button
                  size="lg"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Powered by Llama 3.1 • Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
