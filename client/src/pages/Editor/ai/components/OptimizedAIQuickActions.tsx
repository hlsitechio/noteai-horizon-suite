import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Languages, FileText, Plus, Minus, Edit3 } from 'lucide-react';
import { AIAssistantMode, AIAction } from '../types/ai';

interface OptimizedAIQuickActionsProps {
  selectedText: string;
  onAction: (action: AIAction, customPrompt?: string) => void;
  isLoading: boolean;
  mode: AIAssistantMode;
}

const quickActions = [
  { action: 'improve' as AIAction, label: 'Improve', icon: Wand2, color: 'text-blue-600' },
  { action: 'translate' as AIAction, label: 'Translate', icon: Languages, color: 'text-green-600' },
  { action: 'summarize' as AIAction, label: 'Summarize', icon: FileText, color: 'text-purple-600' },
  { action: 'expand' as AIAction, label: 'Expand', icon: Plus, color: 'text-orange-600' },
  { action: 'simplify' as AIAction, label: 'Simplify', icon: Minus, color: 'text-pink-600' },
  { action: 'fix_grammar' as AIAction, label: 'Fix Grammar', icon: Edit3, color: 'text-red-600' },
];

const OptimizedAIQuickActions: React.FC<OptimizedAIQuickActionsProps> = ({
  selectedText,
  onAction,
  isLoading,
  mode
}) => {
  // Early return with memoization check
  const shouldShow = useMemo(() => {
    return !(mode === 'contextmenu' && !selectedText);
  }, [mode, selectedText]);

  const gridCols = useMemo(() => {
    return mode === 'contextmenu' ? 'grid-cols-2' : 'grid-cols-3';
  }, [mode]);

  const isActionDisabled = useMemo(() => {
    return (action: AIAction) => isLoading || (!selectedText && action !== 'custom');
  }, [isLoading, selectedText]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`grid ${gridCols} gap-2`}>
      {quickActions.map(({ action, label, icon: Icon, color }) => (
        <Button
          key={action}
          variant="outline"
          size="sm"
          onClick={() => onAction(action)}
          disabled={isActionDisabled(action)}
          className="h-auto p-3 flex flex-col items-center gap-1 hover:bg-muted/50 transition-colors duration-200"
          aria-label={`${label} selected text`}
        >
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-xs">{label}</span>
        </Button>
      ))}
    </div>
  );
};

export default React.memo(OptimizedAIQuickActions);