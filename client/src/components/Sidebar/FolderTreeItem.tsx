
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Folder as FolderType } from '../../types/folder';

interface FolderTreeItemProps {
  folder: FolderType;
  level: number;
  isExpanded: boolean;
  hasChildren: boolean;
  onToggleFolder: (folderId: string) => void;
  onEditFolder: (folder: FolderType) => void;
  onDeleteFolder: (folderId: string) => void;
  onChangeColor: (id: string, color: string, type: 'folder' | 'note') => void;
}

export const FolderTreeItem: React.FC<FolderTreeItemProps> = ({
  folder,
  level,
  isExpanded,
  hasChildren,
  onToggleFolder,
}) => {
  const paddingLeft = level * 20;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 py-1.5 px-2 hover:bg-accent/50 rounded-sm group"
      style={{ paddingLeft: `${paddingLeft}px` }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="p-0 h-4 w-4 flex-shrink-0"
        onClick={() => onToggleFolder(folder.id)}
      >
        {hasChildren ? (
          isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
        ) : (
          <div className="h-3 w-3" />
        )}
      </Button>
      
      <div 
        className="w-2 h-2 rounded-full flex-shrink-0" 
        style={{ backgroundColor: folder.color }}
      />
      
      {isExpanded ? (
        <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      ) : (
        <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
      
      <span className="text-sm truncate flex-1 text-foreground">
        {folder.name}
      </span>
    </motion.div>
  );
};
