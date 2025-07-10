import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAICopilot, CopilotRequest, CopilotResponse } from '@/hooks/useAICopilot';
import { AIAction } from '../types';

export const useAIAssistantState = () => {
  const [activeAction, setActiveAction] = useState<AIAction | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [customPrompt, setCustomPrompt] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  const { processText, rateFeedback, isLoading, currentSession } = useAICopilot();

  const handleAction = useCallback(async (action: AIAction, selectedText: string, noteId?: string) => {
    if (!selectedText.trim() && action !== 'custom') {
      toast.error('Please select some text first');
      return;
    }

    setActiveAction(action);
    setResult('');
    setResponse(null);

    // Handle special cases for translation and custom
    if (action === 'translate' && !result) {
      return; // Show language selector first
    }

    if (action === 'custom' && !customPrompt.trim()) {
      setShowCustom(true);
      return;
    }

    try {
      const request: CopilotRequest = {
        action,
        text: selectedText || 'No text selected',
        noteId,
        targetLanguage: action === 'translate' ? targetLanguage : undefined,
        customPrompt: action === 'custom' ? customPrompt : undefined,
      };

      const aiResponse = await processText(request);
      setResult(aiResponse.result);
      setResponse(aiResponse);
      
      toast.success(`AI processing completed in ${aiResponse.processingTime}ms!`);
    } catch (error) {
      console.error('AI processing failed:', error);
    }
  }, [processText, targetLanguage, customPrompt, result]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  }, [result]);

  const handleFeedback = useCallback(async (rating: number) => {
    if (currentSession) {
      await rateFeedback(currentSession, rating);
    }
  }, [currentSession, rateFeedback]);

  const resetView = useCallback(() => {
    setActiveAction(null);
    setResult('');
    setResponse(null);
    setCustomPrompt('');
    setShowCustom(false);
  }, []);

  return {
    // State
    activeAction,
    targetLanguage,
    customPrompt,
    result,
    copied,
    response,
    showCustom,
    isLoading,
    
    // Setters
    setTargetLanguage,
    setCustomPrompt,
    setShowCustom,
    
    // Actions
    handleAction,
    handleCopy,
    handleFeedback,
    resetView,
  };
};