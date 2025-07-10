
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronRight, 
  ChevronDown,
  Star,
  Plus,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Note } from '../../../types/note';
import { useOptimizedNotes } from '../../../contexts/OptimizedNotesContext';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { DroppableContainer } from './DroppableContainer';
import { DraggableNote } from './DraggableNote';
import DesktopPopOutButton from '../../FloatingNotes/DesktopPopOutButton';

interface FavoritesListSectionProps {
  notes: Note[];
  isExpanded: boolean;
  onToggle: () => void;
  onCreateNote: () => void;
  isMobile: boolean;
}

export function FavoritesListSection({ 
  notes, 
  isExpanded, 
  onToggle,
  onCreateNote,
  isMobile
}: FavoritesListSectionProps) {
  const { setCurrentNote, deleteNote } = useOptimizedNotes();
  const { confirmDelete, ConfirmDialog } = useConfirmDialog();
  const navigate = useNavigate();
  const location = useLocation();

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
                <Star className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="font-medium">Favorites</p>
              <p className="text-xs text-muted-foreground">{notes.length} favorites</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div 
              className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors p-1 h-auto flex-1"
              onClick={onToggle}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 mr-1" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-1" />
              )}
              <Star className="h-3 w-3 mr-1" />
              Favorites
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-sidebar-foreground/70">({notes.length})</span>
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateNote();
                  }}
                  title="Create Favorite Note"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
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
            <DroppableContainer id="favorites-container" className="min-h-[2rem]">
              <div className="space-y-1 px-2">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <DraggableNote key={note.id} note={note}>
                    <div className="flex items-center w-full group">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start h-auto p-1 ${isNoteActive(note.id) ? 'bg-accent text-accent-foreground' : ''}`}
                        onClick={() => handleNoteClick(note)}
                      >
                        <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate text-xs text-left flex-1">{note.title}</span>
                        <Star className="h-3 w-3 ml-1 text-accent fill-current flex-shrink-0" />
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
                  </DraggableNote>
                ))
              ) : (
                <Button variant="ghost" size="sm" disabled className="w-full justify-start h-auto p-1">
                  <span className="text-xs text-sidebar-foreground/40">No favorites yet</span>
                </Button>
              )}
            </div>
            </DroppableContainer>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ConfirmDialog />
    </div>
  );
}
