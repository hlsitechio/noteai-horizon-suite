import React from 'react';
import { Save, Eye, Star, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorActionsProps {
  onSave: () => void;
  onFocusModeToggle: () => void;
  onCollapseAllBars: () => void;
  isSaving: boolean;
  canSave: boolean;
}

const EditorActions: React.FC<EditorActionsProps> = ({
  onSave,
  onFocusModeToggle,
  onCollapseAllBars,
  isSaving,
  canSave,
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
      
      <Button
        onClick={onSave}
        disabled={isSaving || !canSave}
        className="bg-primary hover:bg-primary/90"
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? 'Saving...' : 'Save Note'}
      </Button>
    </div>
  );
};

export default EditorActions;