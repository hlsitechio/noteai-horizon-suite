import React from 'react';
import { Button } from '@/components/ui/button';
import { SparklesIcon, LanguageIcon, DocumentTextIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { aiActions, AIAction } from '../types';

interface AIQuickActionsProps {
  onAction: (action: AIAction) => void;
  isLoading: boolean;
  mode?: 'bar' | 'popup';
}

const iconMap = {
  SparklesIcon,
  LanguageIcon, 
  DocumentTextIcon,
  PlusIcon,
  MinusIcon,
};

const AIQuickActions: React.FC<AIQuickActionsProps> = ({
  onAction,
  isLoading,
  mode = 'popup'
}) => {
  if (mode === 'bar') {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {aiActions.map(({ id, label, icon, color }) => {
          const Icon = iconMap[icon as keyof typeof iconMap];
          return (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              onClick={() => onAction(id as AIAction)}
              disabled={isLoading}
              className={`h-8 px-3 bg-gradient-to-r ${color} hover:opacity-90 text-white border border-white/20 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
            >
              <Icon className="w-3 h-3 mr-1.5" />
              {label}
            </Button>
          );
        })}
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