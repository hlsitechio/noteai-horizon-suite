import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Edit, FileText } from 'lucide-react';
import { AIAction } from '../types/ai';

interface AIContextMenuProps {
  selectedText: string;
  onAction: (action: AIAction) => void;
  position: { x: number; y: number };
}

const AIContextMenu: React.FC<AIContextMenuProps> = ({
  selectedText,
  onAction,
  position
}) => {
  const contextActions = [
    { action: 'improve' as AIAction, label: 'Improve', icon: Wand2 },
    { action: 'fix_grammar' as AIAction, label: 'Fix Grammar', icon: Edit },
    { action: 'summarize' as AIAction, label: 'Summarize', icon: FileText },
  ];

  return (
    <div 
      className="bg-background border rounded-lg shadow-lg p-2 space-y-1"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 10000
      }}
    >
      {contextActions.map(({ action, label, icon: Icon }) => (
        <Button
          key={action}
          variant="ghost"
          size="sm"
          onClick={() => onAction(action)}
          className="w-full justify-start h-8"
        >
          <Icon className="w-3 h-3 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
};

export default AIContextMenu;