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
    // Group actions by category for better organization
    const primaryActions = aiActions.filter(action => action.category === 'primary');
    const styleActions = aiActions.filter(action => action.category === 'style');
    const lengthActions = aiActions.filter(action => action.category === 'length');
    const utilityActions = aiActions.filter(action => action.category === 'utility');
    const advancedActions = aiActions.filter(action => action.category === 'advanced');

    return (
      <div className="space-y-3">
        {/* Selected text display */}
        {selectedText && (
          <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">SELECTED TEXT</div>
            <div className="text-sm text-gray-200 font-medium">
              "{selectedText.slice(0, 80)}{selectedText.length > 80 ? '...' : ''}"
            </div>
          </div>
        )}

        {/* Primary Actions */}
        <div className="flex items-center gap-3">
          {primaryActions.map(({ id, label, icon, color }) => {
            const Icon = iconMap[icon as keyof typeof iconMap];
            return (
              <Button
                key={id}
                variant="ghost"
                size="lg"
                onClick={() => onAction(id as AIAction)}
                disabled={isLoading}
                className={`h-12 px-6 bg-gradient-to-r ${color} hover:opacity-90 text-white border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl font-medium`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </Button>
            );
          })}
        </div>

        {/* Style and Length Actions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-medium">STYLE</div>
            <div className="flex gap-2">
              {styleActions.map(({ id, label, icon, color }) => {
                const Icon = iconMap[icon as keyof typeof iconMap];
                return (
                  <Button
                    key={id}
                    variant="outline"
                    size="sm"
                    onClick={() => onAction(id as AIAction)}
                    disabled={isLoading}
                    className={`flex-1 h-10 bg-gradient-to-r ${color} hover:opacity-90 text-white border border-white/10 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg`}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-medium">LENGTH</div>
            <div className="flex gap-2">
              {lengthActions.map(({ id, label, icon, color }) => {
                const Icon = iconMap[icon as keyof typeof iconMap];
                return (
                  <Button
                    key={id}
                    variant="outline"
                    size="sm"
                    onClick={() => onAction(id as AIAction)}
                    disabled={isLoading}
                    className={`flex-1 h-10 bg-gradient-to-r ${color} hover:opacity-90 text-white border border-white/10 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg`}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Utility and Advanced Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-600/30">
          {utilityActions.map(({ id, label, icon, color }) => {
            const Icon = iconMap[icon as keyof typeof iconMap];
            return (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                onClick={() => onAction(id as AIAction)}
                disabled={isLoading}
                className={`h-9 px-4 bg-gradient-to-r ${color} hover:opacity-90 text-white border border-white/10 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg`}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {label}
              </Button>
            );
          })}
          
          {advancedActions.map(({ id, label, icon, color }) => {
            const Icon = iconMap[icon as keyof typeof iconMap];
            return (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                onClick={() => onAction(id as AIAction)}
                disabled={isLoading}
                className={`h-9 px-4 bg-gradient-to-r ${color} hover:opacity-90 text-white border border-white/10 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg`}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {label}
              </Button>
            );
          })}
        </div>
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