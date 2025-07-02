
import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Type, Heading1, Heading2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileEditorToolbarProps {
  onFormatClick?: (formatId: string, event: React.MouseEvent) => void;
  activeFormats?: Set<string>;
}

const MobileEditorToolbar: React.FC<MobileEditorToolbarProps> = ({
  onFormatClick,
  activeFormats = new Set()
}) => {
  const handleFormatClick = (formatId: string) => (event: React.MouseEvent) => {
    if (onFormatClick) {
      onFormatClick(formatId, event);
    }
  };

  const formatButtons = [
    { id: 'bold', icon: Bold, title: 'Bold' },
    { id: 'italic', icon: Italic, title: 'Italic' },
    { id: 'underline', icon: Underline, title: 'Underline' },
    { id: 'heading-one', icon: Heading1, title: 'Heading 1' },
    { id: 'heading-two', icon: Heading2, title: 'Heading 2' },
    { id: 'bulleted-list', icon: List, title: 'Bullet List' },
    { id: 'numbered-list', icon: ListOrdered, title: 'Numbered List' },
  ];

  return (
    <div className="bg-background border-t border-border p-2 flex-shrink-0">
      <div className="flex items-center justify-around">
        {formatButtons.map(({ id, icon: Icon, title }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={handleFormatClick(id)}
            className={`h-10 w-10 p-0 transition-all duration-200 ${
              activeFormats.has(id) 
                ? 'bg-primary text-primary-foreground shadow-md scale-95' 
                : 'hover:bg-accent hover:text-accent-foreground hover:scale-105'
            }`}
            title={title}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileEditorToolbar;
