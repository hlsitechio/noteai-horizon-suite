
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkIcon } from '@heroicons/react/24/outline';

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
      className="h-8 px-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
    >
      <BookmarkIcon className="w-4 h-4 mr-1" />
      {isSaving ? 'Saving...' : 'Save'}
    </Button>
  );
};

export default SaveButton;
