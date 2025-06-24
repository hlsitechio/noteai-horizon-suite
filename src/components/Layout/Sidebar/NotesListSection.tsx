
import React, { useContext } from 'react';
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
  FileText, 
  Plus, 
  ChevronRight, 
  ChevronDown,
  FolderPlus,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Note } from '../../../types/note';
import { SafeDraggableWrapper } from './SafeDraggableWrapper';

interface NotesListSectionProps {
  notes: Note[];
  isExpanded: boolean;
  onToggle: () => void;
  onCreateNote: () => void;
  onCreateFolder: () => void;
}

export function NotesListSection({ 
  notes, 
  isExpanded, 
  onToggle, 
  onCreateNote, 
  onCreateFolder 
}: NotesListSectionProps) {
  const recentNotes = notes.slice(0, 5);

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
          Notes
        </SidebarGroupLabel>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={onCreateFolder}
            title="Create Folder"
          >
            <FolderPlus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={onCreateNote}
            title="Create Note"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
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
                {recentNotes.map((note, index) => {
                  const fallbackContent = (
                    <SidebarMenuItem key={note.id}>
                      <SidebarMenuButton asChild>
                        <Link to={`/app/notes?note=${note.id}`} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors">
                          <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="truncate text-xs">{note.title}</span>
                          {note.isFavorite && (
                            <Star className="h-3 w-3 ml-auto text-accent fill-current" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );

                  return (
                    <SafeDraggableWrapper
                      key={note.id}
                      draggableId={`sidebar-note-${note.id}`}
                      index={index}
                      fallbackChildren={fallbackContent}
                    >
                      {(provided) => (
                        <SidebarMenuItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <SidebarMenuButton asChild>
                            <Link to={`/app/notes?note=${note.id}`} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors">
                              <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span className="truncate text-xs">{note.title}</span>
                              {note.isFavorite && (
                                <Star className="h-3 w-3 ml-auto text-accent fill-current" />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </SafeDraggableWrapper>
                  );
                })}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/app/notes" className="text-xs text-sidebar-foreground/60 hover:bg-accent hover:text-accent-foreground transition-colors">
                      View all notes →
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarGroup>
  );
}
