
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
          Favorites
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
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <SidebarMenuItem key={note.id}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={`/app/notes?note=${note.id}`} 
                          className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors w-full"
                        >
                          <Star className="h-3 w-3 mr-2 flex-shrink-0 text-accent fill-current" />
                          <span className="truncate text-xs flex-1">{note.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled>
                      <span className="text-xs text-sidebar-foreground/40">No favorites yet</span>
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
