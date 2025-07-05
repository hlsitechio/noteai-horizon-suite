import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Settings, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAIAssistant } from '../hooks/useAIAssistant';
import { useAIContext } from '../hooks/useAIContext';
import AIInterface from './AIInterface';
import AIContextMenu from './AIContextMenu';
import AIQuickActions from '../components/AIQuickActions';
import AIResponse from '../components/AIResponse';
import AIPromptInput from '../components/AIPromptInput';
import AIModelSelector from '../components/AIModelSelector';
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

  const getAssistantPosition = () => {
    if (mode === 'contextmenu' && position) {
      return {
        position: 'fixed' as const,
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999
      };
    }
    
    if (mode === 'sidebar') {
      return {
        position: 'relative' as const,
        width: '100%',
        height: '100%'
      };
    }
    
    // Command palette - center of screen
    return {
      position: 'fixed' as const,
      left: '50%',
      top: '30%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999
    };
  };

  const getAssistantSize = () => {
    switch (mode) {
      case 'contextmenu':
        return 'w-80';
      case 'sidebar':
        return 'w-full h-full';
      case 'command':
        return 'w-[600px] max-h-[80vh]';
      default:
        return 'w-96 max-h-[600px]';
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop for command palette */}
      {mode === 'command' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
          onClick={onClose}
        />
      )}

      <AnimatePresence>
        <motion.div
          style={getAssistantPosition()}
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={getAssistantSize()}
        >
          <Card className="border-2 border-primary/20 shadow-2xl bg-background/95 backdrop-blur-xl">
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
                        {mode === 'contextmenu' ? 'Context Mode' : mode === 'command' ? 'Command Mode' : 'Editor Mode'}
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
                    onClick={() => setShowModelSelector(!showModelSelector)}
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    className="h-8 w-8 p-0"
                  >
                    <History className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Model Selector */}
              {showModelSelector && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AIModelSelector
                    currentModel={currentModel}
                    onModelChange={switchModel}
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
              <AIQuickActions
                selectedText={selectedText}
                onAction={handleQuickAction}
                isLoading={isLoading}
                mode={mode}
              />

              {/* Main AI Interface */}
              <AIInterface
                context={context}
                onSubmit={handleQuickAction}
                isLoading={isLoading}
                selectedText={selectedText}
              />

              {/* AI Response */}
              {currentResponse && (
                <AIResponse
                  response={currentResponse}
                  onInsert={() => onTextInsert(currentResponse.result)}
                  onReplace={() => onTextReplace(currentResponse.result)}
                  onRate={rateResponse}
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
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;