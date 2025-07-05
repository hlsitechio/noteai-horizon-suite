import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import OptimizedAIQuickActions from '../components/OptimizedAIQuickActions';
import AIInterface from './AIInterface';
import OptimizedAIResponse from '../components/OptimizedAIResponse';
import AIModelSelector from '../components/AIModelSelector';
import { AIAssistantMode, AIAction, AIResponse as AIResponseType } from '../types/ai';

interface AIAssistantContentProps {
  selectedText: string;
  mode: AIAssistantMode;
  currentModel: string;
  currentResponse: AIResponseType | null;
  sessionHistory: any[];
  isLoading: boolean;
  showModelSelector: boolean;
  showHistory: boolean;
  context: any;
  onQuickAction: (action: string, customPrompt?: string) => void;
  onTextInsert: (text: string) => void;
  onTextReplace: (text: string) => void;
  onModelChange: (modelId: string) => void;
  onRateResponse: (interactionId: string, rating: number) => void;
}

const AIAssistantContent: React.FC<AIAssistantContentProps> = ({
  selectedText,
  mode,
  currentModel,
  currentResponse,
  sessionHistory,
  isLoading,
  showModelSelector,
  showHistory,
  context,
  onQuickAction,
  onTextInsert,
  onTextReplace,
  onModelChange,
  onRateResponse,
}) => {
  return (
    <>
      {/* Model Selector */}
      {showModelSelector && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <AIModelSelector
            currentModel={currentModel}
            onModelChange={onModelChange}
          />
          <Separator className="my-3" />
        </motion.div>
      )}

      {/* Selected Text Preview */}
      {selectedText && (
        <div className="p-3 bg-muted/50 rounded-lg border">
          <div className="text-xs text-muted-foreground mb-1 font-medium">SELECTED TEXT</div>
          <div className="text-sm text-foreground">
            "{selectedText.slice(0, 150)}{selectedText.length > 150 ? '...' : ''}"
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <OptimizedAIQuickActions
        selectedText={selectedText}
        onAction={onQuickAction}
        isLoading={isLoading}
        mode={mode}
      />

      {/* Main AI Interface */}
      <AIInterface
        context={context}
        onSubmit={onQuickAction}
        isLoading={isLoading}
        selectedText={selectedText}
      />

      {/* AI Response */}
      {currentResponse && (
        <OptimizedAIResponse
          response={currentResponse}
          onInsert={() => onTextInsert(currentResponse.result)}
          onReplace={() => onTextReplace(currentResponse.result)}
          onRate={onRateResponse}
          showActions={!!selectedText}
        />
      )}

      {/* Session History */}
      {showHistory && sessionHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="max-h-32 overflow-y-auto"
        >
          <Separator className="mb-3" />
          <div className="text-xs text-muted-foreground mb-2">RECENT INTERACTIONS</div>
          <div className="space-y-2">
            {sessionHistory.slice(-3).map((item, idx) => (
              <div key={idx} className="p-2 bg-muted/30 rounded text-xs">
                <div className="font-medium">{item.request.action}</div>
                <div className="text-muted-foreground">{item.response.result.slice(0, 60)}...</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default React.memo(AIAssistantContent);