import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  Code,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Save,
  Focus
} from 'lucide-react';
import { TiptapToolbarProps } from '../types';
import { useTiptapFormatting } from '../hooks/useTiptapFormatting';

const TiptapToolbar: React.FC<TiptapToolbarProps> = ({
  editor,
  onSave,
  canSave,
  isSaving,
  onFocusModeToggle,
}) => {
  const { handleFormatClick, getActiveFormats } = useTiptapFormatting(editor);
  const activeFormats = getActiveFormats();

  if (!editor) return null;

  const formatButtons = [
    { command: 'bold' as const, icon: Bold, tooltip: 'Bold (Ctrl+B)' },
    { command: 'italic' as const, icon: Italic, tooltip: 'Italic (Ctrl+I)' },
    { command: 'underline' as const, icon: Underline, tooltip: 'Underline (Ctrl+U)' },
    { command: 'code' as const, icon: Code, tooltip: 'Code (Ctrl+`)' },
  ];

  const blockButtons = [
    { command: 'heading1' as const, icon: Heading1, tooltip: 'Heading 1 (Ctrl+Shift+1)' },
    { command: 'heading2' as const, icon: Heading2, tooltip: 'Heading 2 (Ctrl+Shift+2)' },
    { command: 'blockquote' as const, icon: Quote, tooltip: 'Quote (Ctrl+Q)' },
    { command: 'bulletList' as const, icon: List, tooltip: 'Bullet List' },
    { command: 'orderedList' as const, icon: ListOrdered, tooltip: 'Numbered List' },
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        {formatButtons.map(({ command, icon: Icon, tooltip }) => (
          <Button
            key={command}
            variant={activeFormats.has(command) ? "default" : "ghost"}
            size="sm"
            onClick={(e) => handleFormatClick(command, e)}
            title={tooltip}
            className="h-8 w-8 p-0"
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="mx-2 h-6" />

      {/* Block Formatting */}
      <div className="flex items-center gap-1">
        {blockButtons.map(({ command, icon: Icon, tooltip }) => (
          <Button
            key={command}
            variant={activeFormats.has(command) ? "default" : "ghost"}
            size="sm"
            onClick={(e) => handleFormatClick(command, e)}
            title={tooltip}
            className="h-8 w-8 p-0"
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        {onFocusModeToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFocusModeToggle}
            title="Focus Mode"
            className="h-8 w-8 p-0"
          >
            <Focus className="h-4 w-4" />
          </Button>
        )}
        
        {onSave && (
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            disabled={!canSave || isSaving}
            className="h-8"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TiptapToolbar;