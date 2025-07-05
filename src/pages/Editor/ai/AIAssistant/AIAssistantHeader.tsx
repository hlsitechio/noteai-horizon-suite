import React from 'react';
import { Bot, X, Settings, History } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIAssistantMode } from '../types/ai';

interface AIAssistantHeaderProps {
  mode: AIAssistantMode;
  currentModel: string;
  showModelSelector: boolean;
  showHistory: boolean;
  onClose: () => void;
  onToggleModelSelector: () => void;
  onToggleHistory: () => void;
}

const AIAssistantHeader: React.FC<AIAssistantHeaderProps> = ({
  mode,
  currentModel,
  showModelSelector,
  showHistory,
  onClose,
  onToggleModelSelector,
  onToggleHistory,
}) => {
  const getModeLabel = () => {
    switch (mode) {
      case 'contextmenu': return 'Context Mode';
      case 'command': return 'Command Mode';
      case 'sidebar': return 'Sidebar Mode';
      default: return 'Editor Mode';
    }
  };

  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-primary to-primary/70 rounded-lg">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Assistant</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {getModeLabel()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {currentModel}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleModelSelector}
            className="h-8 w-8 p-0"
            aria-label="Model Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleHistory}
            className="h-8 w-8 p-0"
            aria-label="Session History"
          >
            <History className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            aria-label="Close AI Assistant"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default React.memo(AIAssistantHeader);