
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onSend,
  onKeyPress,
  isLoading
}) => {
  return (
    <div className="border-t dark:border-gray-700 p-6">
      <div className="flex gap-3">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask me anything about your notes or ideas..."
          className="resize-none rounded-xl min-h-[60px]"
          rows={2}
          onKeyPress={onKeyPress}
          disabled={isLoading}
        />
        <Button
          size="lg"
          onClick={onSend}
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
  );
};
