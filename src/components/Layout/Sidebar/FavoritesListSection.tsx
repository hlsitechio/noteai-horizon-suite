
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Draggable, Droppable } from 'react-beautiful-dnd';
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
  favoriteNotes: Note[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function FavoritesListSection({ 
  favoriteNotes, 
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
              <Droppable droppableId="sidebar-favorites">
                {(provided, snapshot) => (
                  <SidebarMenu
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={snapshot.isDraggingOver ? 'bg-accent/20 rounded-md' : ''}
                  >
                    {favoriteNotes.length > 0 ? (
                      favoriteNotes.map((note, index) => (
                        <Draggable key={note.id} draggableId={`sidebar-favorite-note-${note.id}`} index={index}>
                          {(provided) => (
                            <SidebarMenuItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <SidebarMenuButton asChild>
                                <Link to={`/app/notes?note=${note.id}`} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors">
                                  <Star className="h-3 w-3 mr-2 flex-shrink-0 text-accent fill-current" />
                                  <span className="truncate text-xs">{note.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <SidebarMenuItem>
                        <SidebarMenuButton disabled>
                          <span className="text-xs text-sidebar-foreground/40">
                            {snapshot.isDraggingOver ? 'Drop note here to add to favorites' : 'No favorites yet'}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {provided.placeholder}
                  </SidebarMenu>
                )}
              </Droppable>
            </SidebarGroupContent>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarGroup>
  );
}
