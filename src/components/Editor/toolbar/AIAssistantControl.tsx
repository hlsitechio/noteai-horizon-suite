
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

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
          className="h-8 px-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all"
        >
          <RocketLaunchIcon className="w-4 h-4 mr-1" />
          AI Assistant
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3 dark:bg-slate-800 dark:border-slate-600">
        <div className="space-y-2">
          <p className="text-sm font-medium dark:text-slate-200">AI Writing Assistant</p>
          <p className="text-xs text-gray-600 dark:text-slate-400">
            {selectedText ? `Selected: "${selectedText.slice(0, 50)}..."` : 'Select text to get AI suggestions'}
          </p>
          <Button 
            size="sm" 
            onClick={onAIClick}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Open AI Assistant
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AIAssistantControl;
