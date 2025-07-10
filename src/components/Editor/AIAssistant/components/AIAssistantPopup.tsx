import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { X } from 'lucide-react';
import AIQuickActions from './AIQuickActions';
import AITranslationSelector from './AITranslationSelector';
import AICustomPrompt from './AICustomPrompt';
import AIResultDisplay from './AIResultDisplay';
import { AIAction } from '../types';
import { CopilotResponse } from '@/hooks/useAICopilot';

interface AIAssistantPopupProps {
  selectedText: string;
  position?: { x: number; y: number };
  onClose: () => void;
  activeAction: AIAction | null;
  targetLanguage: string;
  customPrompt: string;
  result: string;
  response: CopilotResponse | null;
  copied: boolean;
  isLoading: boolean;
  onAction: (action: AIAction) => void;
  onLanguageChange: (language: string) => void;
  onPromptChange: (prompt: string) => void;
  onTranslate: () => void;
  onCustomProcess: () => void;
  onCopy: () => void;
  onInsert: () => void;
  onReplace: () => void;
  onFeedback: (rating: number) => void;
  onBack: () => void;
}

const AIAssistantPopup: React.FC<AIAssistantPopupProps> = ({
  selectedText,
  position,
  onClose,
  activeAction,
  targetLanguage,
  customPrompt,
  result,
  response,
  copied,
  isLoading,
  onAction,
  onLanguageChange,
  onPromptChange,
  onTranslate,
  onCustomProcess,
  onCopy,
  onInsert,
  onReplace,
  onFeedback,
  onBack
}) => {
  return (
    <div 
      className="fixed z-50 w-96 animate-scale-in"
      style={{ 
        left: position?.x || '50%',
        top: position?.y || '50%',
        transform: position ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)'
      }}
    >
      <Card className="shadow-large border-2 bg-background/95 backdrop-blur-sm max-h-[80vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" />
              AI Assistant
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {selectedText && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md mt-2">
              Selected: "{selectedText.slice(0, 50)}{selectedText.length > 50 ? '...' : ''}"
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Actions */}
          {!activeAction && (
            <AIQuickActions
              onAction={onAction}
              isLoading={isLoading}
              mode="popup"
            />
          )}

          {/* Translation Options */}
          {activeAction === 'translate' && !result && (
            <AITranslationSelector
              targetLanguage={targetLanguage}
              onLanguageChange={onLanguageChange}
              onTranslate={onTranslate}
              isLoading={isLoading}
            />
          )}

          {/* Custom Prompt */}
          {activeAction === 'custom' && !result && (
            <AICustomPrompt
              customPrompt={customPrompt}
              onPromptChange={onPromptChange}
              onProcess={onCustomProcess}
              isLoading={isLoading}
              mode="popup"
            />
          )}

          {/* Processing State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="w-4 h-4 animate-pulse" />
                <span>AI is processing...</span>
              </div>
            </div>
          )}

          {/* Result */}
          <AIResultDisplay
            result={result}
            response={response}
            copied={copied}
            selectedText={selectedText}
            onCopy={onCopy}
            onInsert={onInsert}
            onReplace={onReplace}
            onFeedback={onFeedback}
            mode="popup"
          />

          {/* Back Button */}
          {activeAction && !isLoading && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="w-full"
            >
              ← Back to Actions
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantPopup;