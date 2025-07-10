import React from 'react';
import { Button } from '@/components/ui/button';
import { EyeIcon, SparklesIcon } from '@heroicons/react/24/outline';
import SaveButton from './SaveButton';

interface ToolbarActionsGroupProps {
  onAIClick: () => void;
  onFocusModeToggle?: () => void;
  onSave: () => void;
  canSave?: boolean;
  isSaving?: boolean;
}

const ToolbarActionsGroup: React.FC<ToolbarActionsGroupProps> = ({
  onAIClick,
  onFocusModeToggle,
  onSave,
  canSave = true,
  isSaving = false
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* AI Assistant Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onAIClick}
        className="h-8 px-3 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white border border-purple-400/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-medium"
        title="Open AI Assistant"
      >
        <SparklesIcon className="w-4 h-4 mr-1.5" />
        AI Assistant
      </Button>

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