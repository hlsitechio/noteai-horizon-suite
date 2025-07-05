import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface AIPromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const AIPromptInput: React.FC<AIPromptInputProps> = ({
  onSubmit,
  isLoading,
  placeholder = "Ask AI anything..."
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !input.trim()}
        size="sm"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default AIPromptInput;