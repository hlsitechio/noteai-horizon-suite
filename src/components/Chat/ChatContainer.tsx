
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatMessage } from '@/hooks/useEnhancedAIChat';

interface ChatContainerProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  isProcessingLocally: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  input,
  onInputChange,
  onSend,
  onKeyPress,
  isLoading,
  isProcessingLocally
}) => {
  return (
    <Card className="flex-1">
      <CardContent className="p-0">
        <div className="flex flex-col h-full justify-end">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            isProcessingLocally={isProcessingLocally}
          />
          <ChatInput
            input={input}
            onInputChange={onInputChange}
            onSend={onSend}
            onKeyPress={onKeyPress}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};
