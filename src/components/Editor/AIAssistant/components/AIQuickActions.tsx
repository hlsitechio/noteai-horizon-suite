import React from 'react';
import { Button } from '@/components/ui/button';
import { SparklesIcon, LanguageIcon, DocumentTextIcon, PlusIcon, MinusIcon, ChatBubbleLeftIcon, PaintBrushIcon, ClipboardDocumentIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { aiActions, AIAction } from '../types';

interface AIQuickActionsProps {
  onAction: (action: AIAction) => void;
  isLoading: boolean;
  mode?: 'bar' | 'popup';
  selectedText?: string;
}

const iconMap = {
  SparklesIcon,
  LanguageIcon, 
  DocumentTextIcon,
  PlusIcon,
  MinusIcon,
  ChatBubbleLeftIcon,
  PaintBrushIcon,
  ClipboardIcon: ClipboardDocumentIcon,
  ArrowRightIcon,
};

const AIQuickActions: React.FC<AIQuickActionsProps> = ({
  onAction,
  isLoading,
  mode = 'popup',
  selectedText
}) => {
  if (mode === 'bar') {
    // Group actions by category for organized display
    const primaryActions = aiActions.filter(action => action.category === 'primary');
    const styleActions = aiActions.filter(action => action.category === 'style');
    const lengthActions = aiActions.filter(action => action.category === 'length');
    const utilityActions = aiActions.filter(action => action.category === 'utility');
    const advancedActions = aiActions.filter(action => action.category === 'advanced');

    return (
      <div className="space-y-3">
        {/* Primary Actions - Most commonly used */}
        <div className="flex flex-wrap gap-2">
          {primaryActions.map(({ id, label, icon, color }) => {
            const Icon = iconMap[icon as keyof typeof iconMap];
            return (
              <Button
                key={id}
                variant="default"
                size="sm"
                onClick={() => onAction(id as AIAction)}
                disabled={isLoading}
                className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            );
          })}
        </div>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Style Actions */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Style</div>
            <div className="space-y-2">
              {styleActions.map(({ id, label, icon }) => {
                const Icon = iconMap[icon as keyof typeof iconMap];
                return (
                  <Button
                    key={id}
                    variant="outline"
                    size="sm"
                    onClick={() => onAction(id as AIAction)}
                    disabled={isLoading}
                    className="w-full h-8 justify-start text-xs hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="w-3 h-3 mr-2" />
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Length Actions */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Length</div>
            <div className="space-y-2">
              {lengthActions.map(({ id, label, icon }) => {
                const Icon = iconMap[icon as keyof typeof iconMap];
                return (
                  <Button
                    key={id}
                    variant="outline"
                    size="sm"
                    onClick={() => onAction(id as AIAction)}
                    disabled={isLoading}
                    className="w-full h-8 justify-start text-xs hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="w-3 h-3 mr-2" />
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Utility & Advanced Actions - Compact row */}
        {(utilityActions.length > 0 || advancedActions.length > 0) && (
          <div className="pt-2 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {[...utilityActions, ...advancedActions].map(({ id, label, icon }) => {
                const Icon = iconMap[icon as keyof typeof iconMap];
                return (
                  <Button
                    key={id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onAction(id as AIAction)}
                    disabled={isLoading}
                    className="h-7 px-3 text-xs hover:bg-muted"
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {aiActions.map(({ id, label, icon }) => {
        const Icon = iconMap[icon as keyof typeof iconMap];
        return (
          <Button 
            key={id}
            variant="outline" 
            size="sm" 
            onClick={() => onAction(id as AIAction)}
            className="h-auto p-3 flex flex-col items-center gap-1"
            disabled={isLoading}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs">{label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default AIQuickActions;