
import React, { useState } from 'react';
import { MessageCircle, Send, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: 'Thanks for your message! This is a demo response.',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Chat</h1>
          <p className="text-muted-foreground">Chat with your AI assistant</p>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Chat Assistant</CardTitle>
          <CardDescription>
            Ask questions and get helpful responses
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
