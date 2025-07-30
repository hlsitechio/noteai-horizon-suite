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
    <div className="bg-card/95 border-t border-border backdrop-blur-sm">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">AI Assistant</span>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">Pro</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {/* Selected Text Display */}
          {selectedText && (
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Selected Text</div>
              <div className="text-sm text-foreground font-medium leading-relaxed">
                "{selectedText.slice(0, 120)}{selectedText.length > 120 ? '...' : ''}"
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3">
            <AIQuickActions
              onAction={onAction}
              isLoading={isLoading}
              mode="bar"
              selectedText={selectedText}
            />
          </div>

          {/* Custom Prompt Section */}
          <div className="border-t border-border pt-3">
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
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Bot className="w-5 h-5 animate-pulse text-primary" />
                <span className="font-medium">AI is processing your request...</span>
                <div className="flex gap-1 ml-auto">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
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
    </div>
  );
};

export default AIAssistantBar;