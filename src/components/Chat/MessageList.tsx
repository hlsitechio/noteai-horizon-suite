
import React from 'react';
import { Bot, User, Zap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage } from '@/hooks/useEnhancedAIChat';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isProcessingLocally: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  isProcessingLocally
}) => {
  return (
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
  );
};
