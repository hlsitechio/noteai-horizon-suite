
import React, { useState } from 'react';
import { PlusIcon, FolderPlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CreateButtonProps {
  onCreateFolder: (name: string) => Promise<void>;
  onCreateNote: (title: string) => Promise<void>;
}

const CreateButton: React.FC<CreateButtonProps> = ({ onCreateFolder, onCreateNote }) => {
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [noteTitle, setNoteTitle] = useState('');

  const handleCreateFolder = async () => {
    if (folderName.trim()) {
      await onCreateFolder(folderName.trim());
      setFolderName('');
      setShowFolderDialog(false);
    }
  };

  const handleCreateNote = async () => {
    if (noteTitle.trim()) {
      await onCreateNote(noteTitle.trim());
      setNoteTitle('');
      setShowNoteDialog(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'folder' | 'note') => {
    if (e.key === 'Enter') {
      if (type === 'folder') {
        handleCreateFolder();
      } else {
        handleCreateNote();
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 h-4 w-4">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowFolderDialog(true)}>
            <FolderPlusIcon className="mr-2 h-4 w-4" />
            Create Folder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowNoteDialog(true)}>
            <DocumentTextIcon className="mr-2 h-4 w-4" />
            Create Note
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Folder Dialog */}
      <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'folder')}
            />
            <Button onClick={handleCreateFolder}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Note title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'note')}
            />
            <Button onClick={handleCreateNote}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateButton;
