import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Heading1, Heading2, List, ListOrdered, Quote, Table } from 'lucide-react';
import { executeCommand } from '../utils/editorUtils';

interface TiptapFloatingMenuProps {
  editor: Editor | null;
}

const TiptapFloatingMenu: React.FC<TiptapFloatingMenuProps> = ({ editor }) => {
  if (!editor) return null;

  const blockButtons = [
    { command: 'heading1' as const, icon: Heading1, label: 'Heading 1' },
    { command: 'heading2' as const, icon: Heading2, label: 'Heading 2' },
    { command: 'bulletList' as const, icon: List, label: 'Bullet List' },
    { command: 'orderedList' as const, icon: ListOrdered, label: 'Numbered List' },
    { command: 'blockquote' as const, icon: Quote, label: 'Quote' },
    { command: 'insertTable' as const, icon: Table, label: 'Insert Table' },
  ];

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-2 flex items-center gap-1">
      <div className="text-sm text-muted-foreground mr-2">Add:</div>
      {blockButtons.map(({ command, icon: Icon, label }) => (
        <Button
          key={command}
          variant="ghost"
          size="sm"
          onClick={() => executeCommand(editor, command)}
          className="h-8 w-8 p-0 hover:bg-accent"
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
};

export default TiptapFloatingMenu;