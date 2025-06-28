
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateFolderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  onFolderNameChange: (name: string) => void;
  onCreateFolder: () => void;
}

export function CreateFolderDialog({
  isOpen,
  onOpenChange,
  folderName,
  onFolderNameChange,
  onCreateFolder
}: CreateFolderDialogProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCreateFolder();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={onCreateFolder}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
