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
    <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 border-t border-gray-400/30 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
              <p className="text-sm text-gray-400">Pro</p>
            </div>
          </div>
        </div>

        <AIQuickActions
          onAction={onAction}
          isLoading={isLoading}
          mode="bar"
          selectedText={selectedText}
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

        {/* Processing State */}
        {isLoading && (
          <div className="mt-6 flex items-center justify-center py-6 bg-gray-800/30 rounded-xl border border-gray-600/30">
            <div className="flex items-center gap-3 text-gray-300">
              <Bot className="w-5 h-5 animate-pulse text-blue-400" />
              <span className="font-medium">AI is processing your request...</span>
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
    </div>
  );
};

export default AIAssistantBar;