
import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileEditorToolbar: React.FC = () => {
  const formatText = (command: string) => {
    document.execCommand(command, false);
  };

  return (
    <div className="bg-background border-t border-border p-2 flex-shrink-0">
      <div className="flex items-center justify-around">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          className="h-10 w-10 p-0"
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          className="h-10 w-10 p-0"
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('underline')}
          className="h-10 w-10 p-0"
        >
          <Underline className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertUnorderedList')}
          className="h-10 w-10 p-0"
        >
          <List className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertOrderedList')}
          className="h-10 w-10 p-0"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MobileEditorToolbar;
