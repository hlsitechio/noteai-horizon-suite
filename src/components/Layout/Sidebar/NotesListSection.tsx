
import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Note } from '../../../types/note';
import { useOptimizedNotes } from '../../../contexts/OptimizedNotesContext';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import DesktopPopOutButton from '../../FloatingNotes/DesktopPopOutButton';

interface NotesListSectionProps {
  notes: Note[];
  isExpanded: boolean;
  onToggle: () => void;
  onCreateNote: () => void;
  onCreateFolder: () => void;
  isMobile: boolean;
}

export function NotesListSection({ 
  notes, 
  isExpanded, 
  onToggle, 
  onCreateNote, 
  onCreateFolder,
  isMobile
}: NotesListSectionProps) {
  const { setCurrentNote, deleteNote } = useOptimizedNotes();
  const { confirmDelete, ConfirmDialog } = useConfirmDialog();
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
    navigate(`/app/editor/${note.id}`);
  };

  const handleDeleteNote = async (noteId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const note = notes.find(n => n.id === noteId);
    const confirmed = await confirmDelete(note?.title || 'this note');
    
    if (confirmed) {
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
      <div key={note.id} className="flex items-center w-full group">
        <Button 
          variant="ghost"
          size="sm"
          className={`flex-1 justify-start h-auto p-1 ${isActive ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleNoteClick(note)}
        >
          <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
          <span className="truncate text-xs flex-1">{note.title}</span>
          {note.isFavorite && (
            <Star className="h-3 w-3 ml-1 text-accent fill-current flex-shrink-0" />
          )}
        </Button>
        
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
                <FileText className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="font-medium">Notes</p>
              <p className="text-xs text-muted-foreground">{notes.length} notes</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors p-1 h-auto"
            onClick={onToggle}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}
            Notes ({notes.length})
          </Button>
        )}
        {!isMobile && (
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
              {displayNotes.map((note, index) => renderNoteItem(note, index))}
              {displayNotes.length === 0 && (
                <Button variant="ghost" size="sm" disabled className="w-full justify-start h-auto p-1">
                  <span className="text-xs text-sidebar-foreground/40">No notes yet</span>
                </Button>
              )}
              {allNotes.length > displayNotes.length && (
                <Button variant="ghost" size="sm" asChild className="w-full justify-start h-auto p-1">
                  <Link to="/app/notes" className="text-xs text-sidebar-foreground/60 hover:bg-accent hover:text-accent-foreground transition-colors">
                    View all {allNotes.length} notes →
                  </Link>
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
