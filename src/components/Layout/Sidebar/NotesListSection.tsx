
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
  Star,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Note } from '../../../types/note';
import { useNotes } from '../../../contexts/NotesContext';
import DesktopPopOutButton from '../../FloatingNotes/DesktopPopOutButton';

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
  const { setCurrentNote, deleteNote } = useNotes();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get all notes sorted by most recent
  const allNotes = notes.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Show more notes when expanded, fewer when collapsed
  const displayNotes = isExpanded ? allNotes.slice(0, 10) : allNotes.slice(0, 5);

  const handleNoteClick = (note: Note) => {
    setCurrentNote(note);
    navigate(`/app/notes?note=${note.id}`);
  };

  const handleEditNote = (note: Note, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentNote(note);
    navigate('/app/editor');
  };

  const handleDeleteNote = async (noteId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const isNoteActive = (noteId: string) => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('note') === noteId;
  };

  const renderNoteItem = (note: Note, index: number) => {
    const isActive = isNoteActive(note.id);
    
    return (
      <SidebarMenuItem key={note.id}>
        <div className="flex items-center w-full group">
          <SidebarMenuButton 
            asChild 
            className={`flex-1 ${isActive ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <button
              onClick={() => handleNoteClick(note)}
              className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left"
            >
              <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="truncate text-xs flex-1">{note.title}</span>
              {note.isFavorite && (
                <Star className="h-3 w-3 ml-1 text-accent fill-current flex-shrink-0" />
              )}
            </button>
          </SidebarMenuButton>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground"
              onClick={(e) => handleEditNote(note, e)}
              title="Edit note"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={(e) => handleDeleteNote(note.id, e)}
              title="Delete note"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <DesktopPopOutButton 
              note={note} 
              size="sm" 
              className="h-6 w-6 p-0 flex-shrink-0" 
            />
          </div>
        </div>
      </SidebarMenuItem>
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
          Notes ({notes.length})
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
                {displayNotes.map((note, index) => renderNoteItem(note, index))}
                {displayNotes.length === 0 && (
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled>
                      <span className="text-xs text-sidebar-foreground/40">No notes yet</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {allNotes.length > displayNotes.length && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/app/notes" className="text-xs text-sidebar-foreground/60 hover:bg-accent hover:text-accent-foreground transition-colors">
                        View all {allNotes.length} notes →
                      </Link>
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
