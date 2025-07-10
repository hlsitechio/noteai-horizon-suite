import React from 'react';
import { Button } from '@/components/ui/button';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { X } from 'lucide-react';
import { Bot } from 'lucide-react';
import AIQuickActions from './AIQuickActions';
import AICustomPrompt from './AICustomPrompt';
import AIResultDisplay from './AIResultDisplay';
import { AIAction } from '../types';
import { CopilotResponse } from '@/hooks/useAICopilot';

interface AIAssistantBarProps {
  selectedText: string;
  onClose: () => void;
  activeAction: AIAction | null;
  result: string;
  response: CopilotResponse | null;
  copied: boolean;
  customPrompt: string;
  showCustom: boolean;
  isLoading: boolean;
  onAction: (action: AIAction) => void;
  onPromptChange: (prompt: string) => void;
  onToggleCustom: () => void;
  onCustomProcess: () => void;
  onCopy: () => void;
  onInsert: () => void;
  onReplace: () => void;
  onFeedback: (rating: number) => void;
}

const AIAssistantBar: React.FC<AIAssistantBarProps> = ({
  selectedText,
  onClose,
  activeAction,
  result,
  response,
  copied,
  customPrompt,
  showCustom,
  isLoading,
  onAction,
  onPromptChange,
  onToggleCustom,
  onCustomProcess,
  onCopy,
  onInsert,
  onReplace,
  onFeedback
}) => {
  return (
    <div className="bg-gray-900/95 border-t border-gray-400/30 p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-gray-200">AI Assistant</span>
          {selectedText && (
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              "{selectedText.slice(0, 30)}..."
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <AIQuickActions
          onAction={onAction}
          isLoading={isLoading}
          mode="bar"
        />
        
        <AICustomPrompt
          customPrompt={customPrompt}
          onPromptChange={onPromptChange}
          onProcess={onCustomProcess}
          isLoading={isLoading}
          mode="bar"
          showCustom={showCustom}
          onToggleCustom={onToggleCustom}
        />
      </div>

      {/* Processing State */}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Bot className="w-4 h-4 animate-pulse" />
            <span>AI is processing...</span>
          </div>
        </div>
      )}

      {/* Results section for bar mode */}
      <AIResultDisplay
        result={result}
        response={response}
        copied={copied}
        selectedText={selectedText}
        onCopy={onCopy}
        onInsert={onInsert}
        onReplace={onReplace}
        onFeedback={onFeedback}
        mode="bar"
      />
    </div>
  );
};

export default AIAssistantBar;