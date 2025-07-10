import React from 'react';
import { toast } from 'sonner';
import { useAIAssistantState } from './hooks/useAIAssistantState';
import AIAssistantBar from './components/AIAssistantBar';
import { AIAssistantProps, AIAction } from './types';

const UnifiedAIAssistant: React.FC<AIAssistantProps> = ({
  selectedText,
  onTextInsert,
  onTextReplace,
  isVisible,
  onClose,
  position,
  noteId,
  mode = 'popup'
}) => {
  const {
    activeAction,
    targetLanguage,
    customPrompt,
    result,
    copied,
    response,
    showCustom,
    isLoading,
    setTargetLanguage,
    setCustomPrompt,
    setShowCustom,
    handleAction,
    handleCopy,
    handleFeedback,
    resetView,
  } = useAIAssistantState();

  const onAction = (action: AIAction) => {
    handleAction(action, selectedText, noteId);
  };

  const handleInsert = () => {
    onTextInsert(result);
    toast.success('Text inserted!');
    resetView();
  };

  const handleReplace = () => {
    onTextReplace(result);
    toast.success('Text replaced!');
    resetView();
  };

  const handleCustomProcess = () => {
    if (customPrompt.trim()) {
      handleAction('custom', selectedText, noteId);
      setShowCustom(false);
    }
  };

  const handleTranslate = () => {
    handleAction('translate', selectedText, noteId);
  };

  const handleBack = () => {
    resetView();
    if (mode === 'popup') {
      // Keep popup open for navigation
    }
  };

  if (!isVisible) return null;

  // Always render as bar since AI Assistant is now always visible
  return (
    <AIAssistantBar
      selectedText={selectedText}
      onClose={onClose}
      activeAction={activeAction}
      result={result}
      response={response}
      copied={copied}
      customPrompt={customPrompt}
      showCustom={showCustom}
      isLoading={isLoading}
      onAction={onAction}
      onPromptChange={setCustomPrompt}
      onToggleCustom={() => setShowCustom(!showCustom)}
      onCustomProcess={handleCustomProcess}
      onCopy={handleCopy}
      onInsert={handleInsert}
      onReplace={handleReplace}
      onFeedback={handleFeedback}
    />
  );
};

export default UnifiedAIAssistant;
