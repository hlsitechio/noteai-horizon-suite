import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAIAssistant } from '../hooks/useAIAssistant';
import { useAIContext } from '../hooks/useAIContext';
import AIAssistantHeader from './AIAssistantHeader';
import AIAssistantContent from './AIAssistantContent';
import AIAssistantLayout from './AIAssistantLayout';
import AIErrorBoundary from '../components/AIErrorBoundary';
import { AIAssistantMode, AIRequest, AIAction } from '../types/ai';

interface AIAssistantProps {
  selectedText: string;
  onTextInsert: (text: string) => void;
  onTextReplace: (text: string) => void;
  isVisible: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
  noteId?: string;
  mode?: AIAssistantMode;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  selectedText,
  onTextInsert,
  onTextReplace,
  isVisible,
  onClose,
  position,
  noteId,
  mode = 'inline'
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  
  const {
    // AI State
    isLoading,
    currentResponse,
    sessionHistory,
    currentModel,
    
    // AI Actions
    processRequest,
    clearSession,
    switchModel,
    rateResponse,
  } = useAIAssistant({ noteId });

  const {
    context,
    updateContext,
    getRelevantContext,
  } = useAIContext({ selectedText, noteId });

  const handleQuickAction = useCallback(async (action: string, customPrompt?: string) => {
    const request: AIRequest = {
      action: action as AIAction,
      text: selectedText,
      noteId,
      customPrompt,
      context: getRelevantContext(),
    };

    const response = await processRequest(request);
    if (response) {
      // Handle response based on action type
      if (action === 'replace' && selectedText) {
        onTextReplace(response.result);
      } else {
        onTextInsert(response.result);
      }
    }
  }, [selectedText, noteId, processRequest, onTextInsert, onTextReplace, getRelevantContext]);

  if (!isVisible) return null;

  return (
    <AIErrorBoundary>
      <AIAssistantLayout
        isVisible={isVisible}
        mode={mode}
        position={position}
        onClose={onClose}
      >
        <Card className="border-2 border-primary/20 shadow-2xl bg-background/95 backdrop-blur-xl">
          <AIAssistantHeader
            mode={mode}
            currentModel={currentModel}
            showModelSelector={showModelSelector}
            showHistory={showHistory}
            onClose={onClose}
            onToggleModelSelector={() => setShowModelSelector(!showModelSelector)}
            onToggleHistory={() => setShowHistory(!showHistory)}
          />

          <CardContent className="space-y-4">
            <AIAssistantContent
              selectedText={selectedText}
              mode={mode}
              currentModel={currentModel}
              currentResponse={currentResponse}
              sessionHistory={sessionHistory}
              isLoading={isLoading}
              showModelSelector={showModelSelector}
              showHistory={showHistory}
              context={context}
              onQuickAction={handleQuickAction}
              onTextInsert={onTextInsert}
              onTextReplace={onTextReplace}
              onModelChange={switchModel}
              onRateResponse={rateResponse}
            />
          </CardContent>
        </Card>
      </AIAssistantLayout>
    </AIErrorBoundary>
  );
};

export default AIAssistant;