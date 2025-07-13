import React from 'react';
import { Eye, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorActionsProps {
  onFocusModeToggle: () => void;
  onCollapseAllBars: () => void;
}

const EditorActions: React.FC<EditorActionsProps> = ({
  onFocusModeToggle,
  onCollapseAllBars,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onFocusModeToggle}
        className="text-purple-600 hover:text-purple-700"
      >
        <Eye className="w-4 h-4 mr-2" />
        Focus Mode
      </Button>
      
      <Button
        variant="ghost"
        size="sm" 
        onClick={onCollapseAllBars}
        className="text-muted-foreground hover:text-foreground"
      >
        <Minimize2 className="w-4 h-4 mr-2" />
        Minimize
      </Button>
    </div>
  );
};

export default EditorActions;