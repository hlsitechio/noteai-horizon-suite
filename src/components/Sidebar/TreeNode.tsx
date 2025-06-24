
import React from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  MoreHorizontal,
  Edit3,
  Trash2
} from 'lucide-react';
import { Droppable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Note } from '../../types/note';
import { Folder as FolderType } from '../../types/folder';
import { NoteTreeItem } from './NoteTreeItem';
import { FolderTreeItem } from './FolderTreeItem';
import ColorPalette from './ColorPalette';

interface TreeNodeProps {
  folder: FolderType;
  notes: Note[];
  folders: FolderType[];
  level: number;
  expandedFolders: Set<string>;
  onToggleFolder: (folderId: string) => void;
  onEditFolder: (folder: FolderType) => void;
  onDeleteFolder: (folderId: string) => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onChangeColor: (id: string, color: string, type: 'folder' | 'note') => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  folder,
  notes,
  folders,
  level,
  expandedFolders,
  onToggleFolder,
  onEditFolder,
  onDeleteFolder,
  onEditNote,
  onDeleteNote,
  onChangeColor,
}) => {
  const isExpanded = expandedFolders.has(folder.id);
  const childFolders = folders.filter(f => f.parentId === folder.id);
  const folderNotes = notes.filter(n => n.folderId === folder.id);
  const hasChildren = childFolders.length > 0 || folderNotes.length > 0;
  
  const paddingLeft = level * 20;

  return (
    <div>
      {/* Folder Node - Droppable */}
      <Droppable droppableId={`folder-${folder.id}`} type="NOTE">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${
              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            } transition-colors rounded-sm`}
          >
            <div
              className="flex items-center gap-1 py-1 hover:bg-accent/50 rounded-sm group"
              style={{ paddingLeft: `${paddingLeft}px` }}
            >
              {/* Tree Lines */}
              {level > 0 && (
                <div className="absolute left-2 h-full border-l border-border/30" 
                     style={{ left: `${(level - 1) * 20 + 8}px` }} />
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-4 w-4"
                onClick={() => onToggleFolder(folder.id)}
              >
                {hasChildren ? (
                  isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
                ) : (
                  <div className="h-3 w-3" />
                )}
              </Button>
              
              <div 
                className="w-2 h-2 rounded-full mr-1" 
                style={{ backgroundColor: folder.color }}
              />
              
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Folder className="h-4 w-4 text-muted-foreground" />
              )}
              
              <span className="text-sm truncate flex-1">{folder.name}</span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-4 w-4 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditFolder(folder)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ColorPalette onColorSelect={(color) => onChangeColor(folder.id, color, 'folder')} />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDeleteFolder(folder.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Child Items - Notes in this folder */}
            {isExpanded && folderNotes.length > 0 && (
              <div>
                {folderNotes.map((note, index) => (
                  <div key={note.id} style={{ paddingLeft: `${(level + 1) * 20}px` }}>
                    <NoteTreeItem
                      note={note}
                      index={index}
                      level={level + 1}
                      onEditNote={onEditNote}
                      onDeleteNote={onDeleteNote}
                      onChangeColor={onChangeColor}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Child Folders */}
      {isExpanded && childFolders.length > 0 && (
        <div>
          {childFolders.map((childFolder) => (
            <TreeNode
              key={childFolder.id}
              folder={childFolder}
              notes={notes}
              folders={folders}
              level={level + 1}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onEditFolder={onEditFolder}
              onDeleteFolder={onDeleteFolder}
              onEditNote={onEditNote}
              onDeleteNote={onDeleteNote}
              onChangeColor={onChangeColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
