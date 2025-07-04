
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  ChevronRight, 
  ChevronDown,
  Folder,
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
}

export function FoldersListSection({ 
  folders, 
  notes,
  isExpanded, 
  onToggle,
  onCreateFolder
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
        <SidebarMenuItem>
          <div className="flex items-center w-full">
            <SidebarMenuButton 
              onClick={() => toggleFolder(folder.id)}
              className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors p-1 min-w-0 h-6 w-6 flex-shrink-0"
            >
              {isFolderExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </SidebarMenuButton>
            <SidebarMenuButton asChild className="flex-1">
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
            </SidebarMenuButton>
          </div>
        </SidebarMenuItem>
        
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
              <SidebarMenuItem key={note.id}>
                <div className="flex items-center w-full">
                  <SidebarMenuButton asChild className="flex-1">
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
                  </SidebarMenuButton>
                  <DesktopPopOutButton 
                    note={note} 
                    size="sm" 
                    className="ml-1 h-6 w-6 p-0 flex-shrink-0" 
                  />
                </div>
              </SidebarMenuItem>
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
    <SidebarGroup>
      <div className="flex items-center justify-between px-2">
        <SidebarGroupLabel 
          className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors"
          onClick={onToggle}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 mr-1" />
          ) : (
            <ChevronRight className="h-3 w-3 mr-1" />
          )}
          Folders
        </SidebarGroupLabel>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SidebarGroupContent>
              <SidebarMenu>
                {folders.length > 0 ? (
                  folders.map(renderFolder)
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled>
                      <span className="text-xs text-sidebar-foreground/40">No folders yet</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarGroup>
  );
}
