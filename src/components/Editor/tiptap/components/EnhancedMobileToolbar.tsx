import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline, Code, Heading1, Heading2, 
  List, ListOrdered, Quote, Highlighter, Table, Palette 
} from 'lucide-react';
import { executeCommand, isCommandActive } from '../utils/editorUtils';

interface EnhancedMobileToolbarProps {
  editor: Editor | null;
}

const EnhancedMobileToolbar: React.FC<EnhancedMobileToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const formatButtons = [
    { command: 'bold' as const, icon: Bold, label: 'Bold' },
    { command: 'italic' as const, icon: Italic, label: 'Italic' },
    { command: 'underline' as const, icon: Underline, label: 'Underline' },
    { command: 'code' as const, icon: Code, label: 'Code' },
    { command: 'highlight' as const, icon: Highlighter, label: 'Highlight' },
  ];

  const blockButtons = [
    { command: 'heading1' as const, icon: Heading1, label: 'Heading 1' },
    { command: 'heading2' as const, icon: Heading2, label: 'Heading 2' },
    { command: 'bulletList' as const, icon: List, label: 'Bullet List' },
    { command: 'orderedList' as const, icon: ListOrdered, label: 'Numbered List' },
    { command: 'blockquote' as const, icon: Quote, label: 'Quote' },
    { command: 'insertTable' as const, icon: Table, label: 'Insert Table' },
  ];

  return (
    <div className="bg-background border-t border-border p-3 flex-shrink-0">
      {/* Text Formatting Row */}
      <div className="flex items-center justify-around mb-2 pb-2 border-b border-border">
        {formatButtons.map(({ command, icon: Icon, label }) => (
          <Button
            key={command}
            variant="ghost"
            size="sm"
            onClick={() => executeCommand(editor, command)}
            className={`h-10 w-10 p-0 transition-all duration-200 ${
              isCommandActive(editor, command)
                ? 'bg-primary text-primary-foreground shadow-md scale-95' 
                : 'hover:bg-accent hover:text-accent-foreground hover:scale-105'
            }`}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      {/* Block Formatting Row */}
      <div className="flex items-center justify-around">
        {blockButtons.map(({ command, icon: Icon, label }) => (
          <Button
            key={command}
            variant="ghost"
            size="sm"
            onClick={() => executeCommand(editor, command)}
            className={`h-10 w-10 p-0 transition-all duration-200 ${
              isCommandActive(editor, command)
                ? 'bg-primary text-primary-foreground shadow-md scale-95' 
                : 'hover:bg-accent hover:text-accent-foreground hover:scale-105'
            }`}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EnhancedMobileToolbar;