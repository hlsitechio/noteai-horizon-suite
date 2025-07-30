
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface AIAssistantControlProps {
  selectedText: string;
  onAIClick: () => void;
}

const AIAssistantControl: React.FC<AIAssistantControlProps> = ({
  selectedText,
  onAIClick
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white border border-purple-400/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-medium"
        >
          <SparklesIcon className="w-4 h-4 mr-1.5" />
          AI Assistant
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-black border border-gray-400/30 shadow-2xl">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-200">AI Writing Assistant</p>
          <p className="text-xs text-gray-400">
            {selectedText ? `Selected: "${selectedText.slice(0, 50)}..."` : 'Select text to get AI suggestions'}
          </p>
          <Button 
            size="sm" 
            onClick={onAIClick}
            className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 border border-purple-400/30 shadow-lg"
          >
            Open AI Assistant
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AIAssistantControl;
