import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFolders } from '@/contexts/FoldersContext';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreateItemDialog } from './CreateItemDialog';
import { Folder as FolderType } from '@/types/folder';

interface FolderTreeNode extends FolderType {
  children: FolderTreeNode[];
  noteCount: number;
  level: number;
}

interface FolderTreeProps {
  onFolderSelect?: (folderId: string | null) => void;
  selectedFolderId?: string | null;
}

export const FolderTree: React.FC<FolderTreeProps> = ({ onFolderSelect, selectedFolderId }) => {
  const { folders } = useFolders();
  const { notes } = useOptimizedNotes();
  const navigate = useNavigate();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Build folder tree structure
  const folderTree = useMemo(() => {
    const folderMap = new Map<string, FolderTreeNode>();
    const rootFolders: FolderTreeNode[] = [];

    // Initialize all folders as nodes
    folders.forEach(folder => {
      const noteCount = notes.filter(note => note.folder_id === folder.id).length;
      folderMap.set(folder.id, {
        ...folder,
        children: [],
        noteCount,
        level: 0
      });
    });

    // Build tree structure
    folders.forEach(folder => {
      const node = folderMap.get(folder.id)!;
      if (folder.parentId && folderMap.has(folder.parentId)) {
        const parent = folderMap.get(folder.parentId)!;
        parent.children.push(node);
        node.level = parent.level + 1;
      } else {
        rootFolders.push(node);
      }
    });

    // Sort folders alphabetically
    const sortFolders = (folders: FolderTreeNode[]) => {
      folders.sort((a, b) => a.name.localeCompare(b.name));
      folders.forEach(folder => sortFolders(folder.children));
    };
    sortFolders(rootFolders);

    return rootFolders;
  }, [folders, notes]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleFolderClick = (folder: FolderTreeNode) => {
    onFolderSelect?.(folder.id);
    navigate(`/app/folders/${folder.id}`);
  };

  const handleFolderDoubleClick = (folder: FolderTreeNode) => {
    toggleFolder(folder.id);
  };

  const renderFolderNode = (folder: FolderTreeNode) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const hasChildren = folder.children.length > 0;
    const indentLevel = folder.level * 16; // 16px per level

    return (
      <div key={folder.id} className="select-none">
        <div
          className={cn(
            "group flex items-center py-1.5 pr-2 text-sm rounded-md cursor-pointer transition-all duration-150",
            "hover:bg-accent/60 active:bg-accent/80",
            isSelected && "bg-accent text-accent-foreground"
          )}
          style={{ paddingLeft: `${8 + indentLevel}px` }}
          onClick={() => handleFolderClick(folder)}
          onDoubleClick={() => handleFolderDoubleClick(folder)}
        >
          {/* Expand/Collapse button */}
          <div className="w-4 h-4 flex items-center justify-center mr-1">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
                className="w-4 h-4 flex items-center justify-center hover:bg-accent/60 rounded-sm transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
          </div>

          {/* Folder icon */}
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            {isExpanded ? (
              <FolderOpen className="w-4 h-4" style={{ color: folder.color }} />
            ) : (
              <Folder className="w-4 h-4" style={{ color: folder.color }} />
            )}
          </div>

          {/* Folder name */}
          <span className="flex-1 truncate font-medium">
            {folder.name}
          </span>

          {/* Note count */}
          {folder.noteCount > 0 && (
            <span className="text-xs text-muted-foreground ml-1 px-1.5 py-0.5 bg-muted rounded-full">
              {folder.noteCount}
            </span>
          )}

          {/* Actions menu */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 hover:bg-accent/60"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => navigate(`/app/folders/${folder.id}`)}>
                  Open Folder
                </DropdownMenuItem>
                <CreateItemDialog type="note" onSuccess={() => {}}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Add Note
                  </DropdownMenuItem>
                </CreateItemDialog>
                <CreateItemDialog type="folder" onSuccess={() => {}}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Add Subfolder
                  </DropdownMenuItem>
                </CreateItemDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Render children */}
        {hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {folder.children.map(childFolder => renderFolderNode(childFolder))}
          </div>
        )}
      </div>
    );
  };

  const unorganizedNotes = notes.filter(note => !note.folder_id);

  return (
    <div className="h-full flex flex-col bg-card/30 border-r">
      {/* Header */}
      <div className="p-3 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Folders</h3>
          <CreateItemDialog type="folder">
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </CreateItemDialog>
        </div>
      </div>

      {/* Tree content */}
      <div className="flex-1 overflow-auto py-2">
        <div className="space-y-0.5 px-2">
          {/* All Notes (root level) */}
          <div
            className={cn(
              "flex items-center py-1.5 px-2 text-sm rounded-md cursor-pointer transition-colors",
              "hover:bg-accent/60 active:bg-accent/80",
              selectedFolderId === null && "bg-accent text-accent-foreground"
            )}
            onClick={() => {
              onFolderSelect?.(null);
              navigate('/app/explorer');
            }}
          >
            <div className="w-4 h-4 mr-2 flex items-center justify-center">
              <Folder className="w-4 h-4 text-blue-500" />
            </div>
            <span className="flex-1 font-medium">All Notes</span>
            <span className="text-xs text-muted-foreground ml-1 px-1.5 py-0.5 bg-muted rounded-full">
              {notes.length}
            </span>
          </div>

          {/* Unorganized Notes */}
          {unorganizedNotes.length > 0 && (
            <div
              className={cn(
                "flex items-center py-1.5 px-2 text-sm rounded-md cursor-pointer transition-colors",
                "hover:bg-accent/60 active:bg-accent/80 ml-4"
              )}
              onClick={() => {
                onFolderSelect?.('unorganized');
                // Could navigate to a filtered view of unorganized notes
              }}
            >
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                <Folder className="w-4 h-4 text-gray-400" />
              </div>
              <span className="flex-1 font-medium text-muted-foreground">Unorganized</span>
              <span className="text-xs text-muted-foreground ml-1 px-1.5 py-0.5 bg-muted rounded-full">
                {unorganizedNotes.length}
              </span>
            </div>
          )}

          {/* Folder tree */}
          {folderTree.map(folder => renderFolderNode(folder))}

          {/* Empty state */}
          {folders.length === 0 && (
            <div className="text-center py-8 px-4">
              <Folder className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">No folders yet</p>
              <CreateItemDialog type="folder">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Folder
                </Button>
              </CreateItemDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};