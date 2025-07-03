
import React from 'react';
import { Button } from '@/components/ui/button';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface SaveButtonProps {
  onSave: () => void;
  canSave: boolean;
  isSaving: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, canSave, isSaving }) => {
  return (
    <Button
      onClick={onSave}
      disabled={!canSave || isSaving}
      size="sm"
      className="h-8 px-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border border-emerald-400/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <CloudArrowUpIcon className="w-4 h-4 mr-1.5" />
      {isSaving ? 'Saving...' : 'Save'}
    </Button>
  );
};

export default SaveButton;
