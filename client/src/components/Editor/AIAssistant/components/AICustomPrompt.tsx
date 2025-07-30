import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SparklesIcon, PencilIcon } from '@heroicons/react/24/outline';

interface AICustomPromptProps {
  customPrompt: string;
  onPromptChange: (prompt: string) => void;
  onProcess: () => void;
  isLoading: boolean;
  mode?: 'bar' | 'popup';
  showCustom?: boolean;
  onToggleCustom?: () => void;
}

const AICustomPrompt: React.FC<AICustomPromptProps> = ({
  customPrompt,
  onPromptChange,
  onProcess,
  isLoading,
  mode = 'popup',
  showCustom = false,
  onToggleCustom
}) => {
  if (mode === 'bar') {
    return (
      <div className="space-y-3">
        {/* Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleCustom}
          className="h-8 px-3 text-xs hover:bg-accent hover:text-accent-foreground"
        >
          <PencilIcon className="w-3 h-3 mr-1.5" />
          Custom Instructions
        </Button>
        
        {/* Custom Prompt Input */}
        {showCustom && (
          <div className="space-y-3 p-3 bg-muted/30 border border-border rounded-lg animate-fade-in">
            <div className="space-y-2">
              <Textarea
                value={customPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="Describe what you want the AI to do with your text..."
                className="min-h-[80px] text-sm resize-none border-border bg-background"
              />
              <Button
                onClick={onProcess}
                disabled={!customPrompt.trim() || isLoading}
                size="sm"
                className="w-full h-9"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                {isLoading ? 'Processing...' : 'Apply Custom Instructions'}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-2 block">Custom Instructions</label>
        <Textarea
          placeholder="Tell the AI what you want to do with the text..."
          value={customPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
      <Button onClick={onProcess} disabled={isLoading || !customPrompt.trim()} className="w-full">
        {isLoading ? 'Processing...' : 'Process Text'}
      </Button>
    </div>
  );
};

export default AICustomPrompt;