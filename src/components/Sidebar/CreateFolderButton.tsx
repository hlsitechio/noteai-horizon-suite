
import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CreateFolderButtonProps {
  onCreateFolder: (name: string) => Promise<void>;
}

const CreateFolderButton: React.FC<CreateFolderButtonProps> = ({ onCreateFolder }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = async () => {
    if (folderName.trim()) {
      await onCreateFolder(folderName.trim());
      setFolderName('');
      setShowDialog(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateFolder();
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 h-4 w-4">
          <PlusIcon className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleCreateFolder}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderButton;
