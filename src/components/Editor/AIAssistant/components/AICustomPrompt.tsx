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
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCustom}
          className="h-8 px-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white border border-gray-400/30"
        >
          <PencilIcon className="w-3 h-3 mr-1.5" />
          Custom
        </Button>
        
        {showCustom && (
          <div className="mt-3 animate-fade-in">
            <div className="flex gap-2">
              <Textarea
                value={customPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="Tell the AI what you want to do with the text..."
                className="flex-1 h-20 text-sm bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 resize-none"
              />
              <Button
                onClick={onProcess}
                disabled={!customPrompt.trim() || isLoading}
                className="h-20 px-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 border border-purple-400/30"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Process
              </Button>
            </div>
          </div>
        )}
      </>
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