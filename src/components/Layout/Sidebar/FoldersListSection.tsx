
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useFolders } from '../../../contexts/FoldersContext';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { Note } from '../../../types/note';
import { Folder as FolderType } from '../../../types/folder';
import { FoldersListHeader } from './FoldersListHeader';
import { FolderItem } from './FolderItem';

interface FoldersListSectionProps {
  folders: FolderType[];
  notes: Note[];
  isExpanded: boolean;
  onToggle: () => void;
  onCreateFolder: () => Promise<void>;
  onMoveToFolder: (noteId: string, folderId: string | null) => void;
  isMobile: boolean;
}

export function FoldersListSection({ 
  folders, 
  notes,
  isExpanded, 
  onToggle,
  onCreateFolder,
  onMoveToFolder,
  isMobile
}: FoldersListSectionProps) {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());
  const { deleteFolder } = useFolders();
  const { confirmDelete, ConfirmDialog } = useConfirmDialog();
  const navigate = useNavigate();

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleEditFolder = (folder: FolderType, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/app/folders/${folder.id}?edit=true`);
  };

  const handleDeleteFolder = async (folderId: string, folderName: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const confirmed = await confirmDelete(folderName);
    
    if (confirmed) {
      await deleteFolder(folderId);
    }
  };

  return (
    <div className="space-y-2">
      <FoldersListHeader
        isExpanded={isExpanded}
        onToggle={onToggle}
        onCreateFolder={onCreateFolder}
        foldersCount={folders.length}
        isMobile={isMobile}
      />
      
      <AnimatePresence>
        {isExpanded && !isMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-1 px-2">
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <FolderItem
                    key={folder.id}
                    folder={folder}
                    notes={notes}
                    isExpanded={expandedFolders.has(folder.id)}
                    onToggle={toggleFolder}
                    onEdit={handleEditFolder}
                    onDelete={handleDeleteFolder}
                  />
                ))
              ) : (
                <Button variant="ghost" size="sm" disabled className="w-full justify-start h-auto p-1">
                  <span className="text-xs text-sidebar-foreground/40">No folders yet</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ConfirmDialog />
    </div>
  );
}
