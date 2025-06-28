
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface FolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  folderName: string;
  onFolderNameChange: (name: string) => void;
  onSave: () => void;
}

const FolderDialog: React.FC<FolderDialogProps> = ({
  isOpen,
  onClose,
  title,
  folderName,
  onFolderNameChange,
  onSave,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave();
    }
  };

  const isCreating = title.includes('Create');
  const description = isCreating 
    ? 'Enter a name for your new folder to organize your notes.'
    : 'Enter a new name for this folder.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <Button onClick={onSave} disabled={!folderName.trim()}>
            {isCreating ? 'Create' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderDialog;
