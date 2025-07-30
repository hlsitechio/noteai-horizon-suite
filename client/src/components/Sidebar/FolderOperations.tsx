import { useState } from 'react';
import { Folder as FolderType } from '../../types/folder';
import { Note } from '../../types/note';
import { colors } from './ColorPalette';

interface FolderOperationsProps {
  folders: FolderType[];
  notes: Note[];
  updateFolder: (id: string, updates: Partial<Omit<FolderType, 'id' | 'createdAt'>>) => Promise<FolderType | null>;
  createFolder: (folder: Omit<FolderType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FolderType>;
  deleteFolder: (id: string) => Promise<boolean>;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<Note | null>;
  confirmDelete?: (name: string) => Promise<boolean>;
}

export const useFolderOperations = ({
  folders,
  notes,
  updateFolder,
  createFolder,
  deleteFolder,
  updateNote,
  confirmDelete,
}: FolderOperationsProps) => {
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  const handleEditFolder = (folder: FolderType) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
  };

  const handleSaveFolder = async () => {
    if (editingFolder && newFolderName.trim()) {
      await updateFolder(editingFolder.id, { name: newFolderName.trim() });
      setEditingFolder(null);
      setNewFolderName('');
    }
  };

  const handleCreateFolder = async (name: string) => {
    await createFolder({
      name,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  };

  const handleDeleteFolder = async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    let confirmed = false;
    
    if (confirmDelete) {
      confirmed = await confirmDelete(folder?.name || 'this folder');
    } else {
      confirmed = window.confirm('Are you sure you want to delete this folder? Notes inside will be moved to unorganized.');
    }
    
    if (confirmed) {
      // Move notes from folder to unorganized
      const folderNotes = notes.filter(n => n.folder_id === folderId);
      for (const note of folderNotes) {
        await updateNote(note.id, { folder_id: null });
      }
      await deleteFolder(folderId);
    }
  };

  const handleChangeColor = async (id: string, color: string, type: 'folder' | 'note') => {
    if (type === 'folder') {
      await updateFolder(id, { color });
    }
    // Note: color property will be handled when we add it to Note interface
  };

  return {
    editingFolder,
    newFolderName,
    setNewFolderName,
    setEditingFolder,
    handleEditFolder,
    handleSaveFolder,
    handleCreateFolder,
    handleDeleteFolder,
    handleChangeColor,
  };
};