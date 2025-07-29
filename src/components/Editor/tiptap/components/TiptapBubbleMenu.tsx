import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Code, Highlighter } from 'lucide-react';
import { executeCommand, isCommandActive } from '../utils/editorUtils';

interface TiptapBubbleMenuProps {
  editor: Editor | null;
}

const TiptapBubbleMenu: React.FC<TiptapBubbleMenuProps> = ({ editor }) => {
  if (!editor) return null;

  const formatButtons = [
    { command: 'bold' as const, icon: Bold, label: 'Bold' },
    { command: 'italic' as const, icon: Italic, label: 'Italic' },
    { command: 'underline' as const, icon: Underline, label: 'Underline' },
    { command: 'code' as const, icon: Code, label: 'Code' },
    { command: 'highlight' as const, icon: Highlighter, label: 'Highlight' },
  ];

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-2 flex items-center gap-1">
      {formatButtons.map(({ command, icon: Icon, label }) => (
        <Button
          key={command}
          variant="ghost"
          size="sm"
          onClick={() => executeCommand(editor, command)}
          className={`h-8 w-8 p-0 ${
            isCommandActive(editor, command)
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
};

export default TiptapBubbleMenu;