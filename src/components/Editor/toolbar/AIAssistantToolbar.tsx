
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Brain, Sparkles, Wand2, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIAssistantToolbarProps {
  selectedText: string;
  onAIAction: (action: string) => void;
  isLoading?: boolean;
}

const AIAssistantToolbar: React.FC<AIAssistantToolbarProps> = ({
  selectedText,
  onAIAction,
  isLoading = false
}) => {
  const quickActions = [
    { 
      id: 'improve', 
      label: 'Improve', 
      icon: Wand2, 
      description: 'Enhance clarity and flow',
      color: 'from-blue-500 to-purple-500'
    },
    { 
      id: 'summarize', 
      label: 'Summarize', 
      icon: MessageSquare, 
      description: 'Create concise summary',
      color: 'from-green-500 to-teal-500'
    },
    { 
      id: 'expand', 
      label: 'Expand', 
      icon: Sparkles, 
      description: 'Add more detail',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-lg transition-all"
          disabled={isLoading}
        >
          <Brain className="w-4 h-4 mr-1" />
          AI Assistant
          {isLoading && <Sparkles className="w-3 h-3 ml-1 animate-spin" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">AI Writing Assistant</h3>
          </div>
          
          {selectedText && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 mb-2">
                Selected Text
              </Badge>
              <div className="text-sm text-gray-700 bg-white/80 rounded p-2 border border-blue-200/50 max-h-24 overflow-y-auto">
                "{selectedText.slice(0, 100)}{selectedText.length > 100 ? '...' : ''}"
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Quick Actions</h4>
            <div className="grid gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onAIAction(action.id)}
                  disabled={isLoading || !selectedText}
                  className="justify-start h-auto p-3 hover:bg-gradient-to-r hover:text-white transition-all"
                  style={{ '--tw-gradient-from': action.color.split(' ')[1], '--tw-gradient-to': action.color.split(' ')[3] } as any}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs opacity-75">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {!selectedText && (
            <div className="text-center text-sm text-gray-500 py-4">
              Select some text to use AI assistance
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AIAssistantToolbar;
