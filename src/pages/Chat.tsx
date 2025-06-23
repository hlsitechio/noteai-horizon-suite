
import React, { useState } from 'react';
import { Plus, Send, Bot, User, Zap, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useEnhancedAIChat, ChatMessage } from '@/hooks/useEnhancedAIChat';
import { useToast } from '@/hooks/useToast';

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

  const formatMessageContent = (content: string) => {
    try {
      // Try to parse as JSON to see if it's structured output
      const parsed = JSON.parse(content);
      return (
        <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border overflow-auto">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      // If it's not JSON, return as regular text
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
  };

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

  const getGPUStatusBadge = () => {
    if (!gpuCapabilities.isInitialized) {
      return (
        <Badge variant="secondary" className="bg-gray-500/10 text-gray-600">
          <Cpu className="w-3 h-3 mr-1" />
          Initializing...
        </Badge>
      );
    }

    if (gpuCapabilities.webGPUSupported) {
      return (
        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
          <Zap className="w-3 h-3 mr-1" />
          WebGPU Enabled
        </Badge>
      );
    }

    if (gpuCapabilities.webGLSupported) {
      return (
        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
          <Zap className="w-3 h-3 mr-1" />
          WebGL Enabled
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">
        <Cpu className="w-3 h-3 mr-1" />
        CPU Only
      </Badge>
    );
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
              DeepSeek R1
            </Badge>
            {getGPUStatusBadge()}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Get help with your notes and ideas using GPU-accelerated AI
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
            <div className="flex-1 overflow-y-auto max-h-[400px] p-6">
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
                      {message.isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        formatMessageContent(message.content)
                      )}
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
                {(isLoading || isProcessingLocally) && (
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
                        <span className="text-sm">
                          {isProcessingLocally ? 'Processing locally with GPU...' : 'AI is thinking...'}
                        </span>
                        {isProcessingLocally && (
                          <Zap className="w-3 h-3 text-green-500" />
                        )}
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
                Powered by DeepSeek R1 with GPU acceleration • Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
