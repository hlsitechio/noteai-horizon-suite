
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronRight, 
  ChevronDown,
  Star,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Note } from '../../../types/note';

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
                    onCreateNote();
                  }}
                  title="Create Favorite Note"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 mr-1" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-1" />
              )}
              <Star className="h-3 w-3 mr-1" />
              Favorites
            </div>
            <span className="text-xs">({notes.length})</span>
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
              {notes.length > 0 ? (
                notes.map((note) => (
                  <Button key={note.id} variant="ghost" size="sm" asChild className="w-full justify-start h-auto p-1">
                    <Link 
                      to={`/app/notes?note=${note.id}`} 
                      className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors w-full"
                    >
                      <Star className="h-3 w-3 mr-2 flex-shrink-0 text-accent fill-current" />
                      <span className="truncate text-xs flex-1">{note.title}</span>
                    </Link>
                  </Button>
                ))
              ) : (
                <Button variant="ghost" size="sm" disabled className="w-full justify-start h-auto p-1">
                  <span className="text-xs text-sidebar-foreground/40">No favorites yet</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
