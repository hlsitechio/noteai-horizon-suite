
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronRight, 
  ChevronDown,
  Folder,
  FolderPlus,
  FileText,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Note } from '../../../types/note';
import { Folder as FolderType } from '../../../types/folder';
import DesktopPopOutButton from '../../FloatingNotes/DesktopPopOutButton';

interface FoldersListSectionProps {
  folders: FolderType[];
  notes: Note[];
  isExpanded: boolean;
  onToggle: () => void;
  onCreateFolder: () => Promise<void>;
  isMobile: boolean;
}

export function FoldersListSection({ 
  folders, 
  notes,
  isExpanded, 
  onToggle,
  onCreateFolder,
  isMobile
}: FoldersListSectionProps) {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: FolderType) => {
    const folderNotes = notes.filter(note => note.folder_id === folder.id);
    const isFolderExpanded = expandedFolders.has(folder.id);

    return (
      <div key={folder.id} className="space-y-1">
        <div className="flex items-center w-full">
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => toggleFolder(folder.id)}
            className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors p-1 min-w-0 h-6 w-6 flex-shrink-0"
          >
            {isFolderExpanded ? (
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
        </div>
        
        {/* Folder Notes */}
        {isFolderExpanded && folderNotes.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 space-y-1"
          >
            {folderNotes.slice(0, 5).map((note) => (
              <div key={note.id} className="flex items-center w-full">
                <Button variant="ghost" size="sm" asChild className="flex-1 h-auto p-1">
                  <Link 
                    to={`/app/notes?note=${note.id}`} 
                    className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors w-full"
                  >
                    <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate text-xs flex-1">{note.title}</span>
                    {note.isFavorite && (
                      <Star className="h-3 w-3 ml-auto text-accent fill-current" />
                    )}
                  </Link>
                </Button>
                <DesktopPopOutButton 
                  note={note} 
                  size="sm" 
                  className="ml-1 h-6 w-6 p-0 flex-shrink-0" 
                />
              </div>
            ))}
            {folderNotes.length > 5 && (
              <div className="text-xs text-sidebar-foreground/40 px-2 ml-4">
                +{folderNotes.length - 5} more notes
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        {isMobile ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors p-1 h-auto justify-center w-8"
                onClick={onToggle}
              >
                <Folder className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="font-medium">Folders</p>
              <p className="text-xs text-muted-foreground">{folders.length} folders</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors p-1 h-auto w-full justify-between"
            onClick={onToggle}
          >
            <div className="flex items-center">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-accent hover:text-accent-foreground transition-colors mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFolder();
                  }}
                  title="Create Folder"
                >
                  <FolderPlus className="h-3 w-3" />
                </Button>
              )}
              <Folder className="h-3 w-3 mr-1" />
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 mr-1" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-1" />
              )}
              Folders
            </div>
            <span className="text-xs">({folders.length})</span>
          </Button>
        )}
      </div>
      
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
                folders.map(renderFolder)
              ) : (
                <Button variant="ghost" size="sm" disabled className="w-full justify-start h-auto p-1">
                  <span className="text-xs text-sidebar-foreground/40">No folders yet</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
