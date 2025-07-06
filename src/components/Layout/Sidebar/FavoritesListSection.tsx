
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  ChevronDown,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Note } from '../../../types/note';

interface FavoritesListSectionProps {
  notes: Note[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function FavoritesListSection({ 
  notes, 
  isExpanded, 
  onToggle 
}: FavoritesListSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
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
          Favorites
        </Button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
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
