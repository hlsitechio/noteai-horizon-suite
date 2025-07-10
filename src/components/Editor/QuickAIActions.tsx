import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  Wand2, 
  FileText, 
  CheckCircle, 
  Lightbulb,
  Loader2
} from 'lucide-react';
import { useAIWritingAssistant } from '@/hooks/useAIWritingAssistant';

interface QuickAIActionsProps {
  content: string;
  selectedText: string;
  onTextInsert: (text: string) => void;
  onTextReplace: (text: string) => void;
  className?: string;
}

const QuickAIActions: React.FC<QuickAIActionsProps> = ({
  content,
  selectedText,
  onTextInsert,
  onTextReplace,
  className = ''
}) => {
  const { 
    continueWriting, 
    enhanceText, 
    summarizeContent, 
    checkGrammar, 
    getSuggestions,
    isLoading 
  } = useAIWritingAssistant();

  const quickActions = [
    {
      id: 'continue',
      label: 'Continue',
      icon: Brain,
      action: () => continueWriting(content).then(onTextInsert),
      disabled: !content,
      color: 'text-blue-600 hover:bg-blue-50'
    },
    {
      id: 'enhance',
      label: 'Enhance',
      icon: Wand2,
      action: () => enhanceText(selectedText).then(onTextReplace),
      disabled: !selectedText,
      color: 'text-purple-600 hover:bg-purple-50'
    },
    {
      id: 'summarize',
      label: 'Summarize',
      icon: FileText,
      action: () => summarizeContent(content).then(onTextInsert),
      disabled: !content,
      color: 'text-green-600 hover:bg-green-50'
    },
    {
      id: 'grammar',
      label: 'Grammar',
      icon: CheckCircle,
      action: () => checkGrammar(content).then((result) => onTextReplace(result)),
      disabled: !content,
      color: 'text-emerald-600 hover:bg-emerald-50'
    },
    {
      id: 'suggest',
      label: 'Suggest',
      icon: Lightbulb,
      action: () => getSuggestions(content).then(onTextInsert),
      disabled: !content,
      color: 'text-yellow-600 hover:bg-yellow-50'
    }
  ];

  return (
    <Card className={`p-2 ${className}`}>
      <div className="flex gap-1 flex-wrap">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            onClick={action.action}
            disabled={action.disabled || isLoading}
            className={`flex items-center gap-1 ${action.color}`}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <action.icon className="h-3 w-3" />
            )}
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickAIActions;