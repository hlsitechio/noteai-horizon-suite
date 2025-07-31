import { useState, useCallback, useMemo } from 'react';
import { AIContext } from '../types/ai';

interface UseAIContextProps {
  selectedText?: string;
  noteId?: string;
}

export const useAIContext = ({ selectedText, noteId }: UseAIContextProps = {}) => {
  const [context, setContext] = useState<AIContext>({
    selectedText,
  });

  const updateContext = useCallback((newContext: Partial<AIContext>) => {
    setContext(prev => ({ ...prev, ...newContext }));
  }, []);

  const getRelevantContext = useCallback(() => {
    return {
      ...context,
      selectedText,
      timestamp: new Date().toISOString(),
    };
  }, [context, selectedText]);

  const contextSummary = useMemo(() => {
    const items = [];
    if (context.currentNote) items.push(`Note: ${context.currentNote.title}`);
    if (selectedText) items.push(`Selected: ${selectedText.length} chars`);
    if (context.recentNotes?.length) items.push(`${context.recentNotes.length} recent notes`);
    return items.join(' • ');
  }, [context, selectedText]);

  return {
    context,
    updateContext,
    getRelevantContext,
    contextSummary,
  };
};