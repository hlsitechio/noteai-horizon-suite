
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={onSave}>
            {title.includes('Create') ? 'Create' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderDialog;
