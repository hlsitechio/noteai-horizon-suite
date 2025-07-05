import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { AIAction } from '../types/ai';

interface AIInterfaceProps {
  context: any;
  onSubmit: (action: AIAction, customPrompt?: string) => void;
  isLoading: boolean;
  selectedText: string;
}

const AIInterface: React.FC<AIInterfaceProps> = ({
  context,
  onSubmit,
  isLoading,
  selectedText
}) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onSubmit('custom', customPrompt);
      setCustomPrompt('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-2 block">Custom Instructions</label>
        <Textarea
          placeholder="Tell the AI what you want to do with the text..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
      
      <Button 
        type="submit"
        disabled={isLoading || !customPrompt.trim()}
        className="w-full"
      >
        {isLoading ? 'Processing...' : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Process with AI
          </>
        )}
      </Button>
    </form>
  );
};

export default AIInterface;