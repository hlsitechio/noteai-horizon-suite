import React from 'react';
import { Button } from '@/components/ui/button';
import { EyeIcon } from '@heroicons/react/24/outline';
import AIAssistantControl from './AIAssistantControl';
import SaveButton from './SaveButton';

interface ToolbarActionsGroupProps {
  selectedText?: string;
  onAIClick: () => void;
  onFocusModeToggle?: () => void;
  onSave: () => void;
  canSave?: boolean;
  isSaving?: boolean;
}

const ToolbarActionsGroup: React.FC<ToolbarActionsGroupProps> = ({
  selectedText,
  onAIClick,
  onFocusModeToggle,
  onSave,
  canSave = true,
  isSaving = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <AIAssistantControl
        selectedText={selectedText}
        onAIClick={onAIClick}
      />

      {/* Focus Mode Button */}
      {onFocusModeToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onFocusModeToggle}
          className="h-8 px-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white border border-gray-400/30 shadow-md hover:shadow-lg transition-all"
          title="Enter Focus Mode (F11)"
        >
          <EyeIcon className="w-4 h-4 mr-1" />
          Focus
        </Button>
      )}

      {/* Save Note Button */}
      <SaveButton
        onSave={onSave}
        canSave={canSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default ToolbarActionsGroup;