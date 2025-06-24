
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
import { SafeDroppableWrapper } from './SafeDroppableWrapper';
import { SafeDraggableWrapper } from './SafeDraggableWrapper';

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
  const renderFavoriteNotes = (provided?: any, snapshot?: any) => (
    <SidebarMenu
      ref={provided?.innerRef}
      {...(provided?.droppableProps || {})}
      className={snapshot?.isDraggingOver ? 'bg-accent/20 rounded-md' : ''}
    >
      {favoriteNotes.length > 0 ? (
        favoriteNotes.map((note, index) => {
          const fallbackContent = (
            <SidebarMenuItem key={note.id}>
              <SidebarMenuButton asChild>
                <Link to={`/app/notes?note=${note.id}`} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Star className="h-3 w-3 mr-2 flex-shrink-0 text-accent fill-current" />
                  <span className="truncate text-xs">{note.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );

          return (
            <SafeDraggableWrapper
              key={note.id}
              draggableId={`sidebar-favorite-note-${note.id}`}
              index={index}
              fallbackChildren={fallbackContent}
            >
              {(provided) => (
                <SidebarMenuItem
                  ref={provided?.innerRef}
                  {...(provided?.draggableProps || {})}
                  {...(provided?.dragHandleProps || {})}
                >
                  <SidebarMenuButton asChild>
                    <Link to={`/app/notes?note=${note.id}`} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Star className="h-3 w-3 mr-2 flex-shrink-0 text-accent fill-current" />
                      <span className="truncate text-xs">{note.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SafeDraggableWrapper>
          );
        })
      ) : (
        <SidebarMenuItem>
          <SidebarMenuButton disabled>
            <span className="text-xs text-sidebar-foreground/40">
              {snapshot?.isDraggingOver ? 'Drop note here to add to favorites' : 'No favorites yet'}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      {provided?.placeholder}
    </SidebarMenu>
  );

  const fallbackContent = (
    <SidebarMenu>
      {favoriteNotes.length > 0 ? (
        favoriteNotes.map((note) => (
          <SidebarMenuItem key={note.id}>
            <SidebarMenuButton asChild>
              <Link to={`/app/notes?note=${note.id}`} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors">
                <Star className="h-3 w-3 mr-2 flex-shrink-0 text-accent fill-current" />
                <span className="truncate text-xs">{note.title}</span>
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
  );

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
              <SafeDroppableWrapper
                droppableId="sidebar-favorites"
                children={renderFavoriteNotes}
                fallbackChildren={fallbackContent}
              />
            </SidebarGroupContent>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarGroup>
  );
}
