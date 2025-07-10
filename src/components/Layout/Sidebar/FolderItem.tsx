import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  ChevronDown,
  Folder,
  Edit,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Note } from '../../../types/note';
import { Folder as FolderType } from '../../../types/folder';
import { DroppableContainer } from './DroppableContainer';
import { FolderNotesList } from './FolderNotesList';

interface FolderItemProps {
  folder: FolderType;
  notes: Note[];
  isExpanded: boolean;
  onToggle: (folderId: string) => void;
  onEdit: (folder: FolderType, event: React.MouseEvent) => void;
  onDelete: (folderId: string, folderName: string, event: React.MouseEvent) => void;
}

export function FolderItem({ 
  folder, 
  notes, 
  isExpanded, 
  onToggle, 
  onEdit, 
  onDelete 
}: FolderItemProps) {
  const folderNotes = notes.filter(note => note.folder_id === folder.id);

  return (
    <DroppableContainer
      id={`folder-${folder.id}`}
      className="space-y-1"
    >
      <div className="flex items-center w-full group">
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => onToggle(folder.id)}
          className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors p-1 min-w-0 h-6 w-6 flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
        <Button variant="ghost" size="sm" asChild className="flex-1 h-auto p-1">
          <Link 
            to={`/app/folders/${folder.id}`}
            className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors w-full"
          >
            <div 
              className="w-2 h-2 rounded-full mr-2 flex-shrink-0" 
              style={{ backgroundColor: folder.color }}
            />
            <Folder className="h-3 w-3 mr-2 flex-shrink-0" />
            <span className="truncate text-xs flex-1">{folder.name}</span>
            <span className="text-xs text-sidebar-foreground/40 ml-2">
              {folderNotes.length}
            </span>
          </Link>
        </Button>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground"
            onClick={(e) => onEdit(folder, e)}
            title="Edit folder"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={(e) => onDelete(folder.id, folder.name, e)}
            title="Delete folder"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Folder Notes */}
      {isExpanded && folderNotes.length > 0 && (
        <FolderNotesList notes={folderNotes} />
      )}
    </DroppableContainer>
  );
}