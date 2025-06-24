
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar 
} from '@/components/ui/sidebar';
import { 
  FileText, 
  Plus, 
  ChevronRight, 
  ChevronDown,
  FolderOpen,
  Star,
  Folder
} from 'lucide-react';
import { useNotes } from '../../../contexts/NotesContext';
import { useFolders } from '../../../contexts/FoldersContext';
import { useProjectRealms } from '../../../contexts/ProjectRealmsContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function NotesSection() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { notes, createNote } = useNotes();
  const { folders } = useFolders();
  const { projects } = useProjectRealms();
  
  const [expandedSections, setExpandedSections] = useState({
    notes: true,
    projects: false,
    favorites: false
  });

  const favoriteNotes = notes.filter(note => note.isFavorite);
  const recentNotes = notes.slice(0, 5);
  const activeProjects = projects.filter(project => project.status === 'active').slice(0, 3);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCreateNote = async () => {
    try {
      await createNote({
        title: 'New Note',
        content: '',
        category: 'general',
        tags: [],
        isFavorite: false,
        folder_id: null
      });
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  if (isCollapsed) {
    return (
      <div className="px-2 space-y-1">
        <SidebarMenuButton asChild tooltip="Notes">
          <Link to="/app/notes" className="hover:bg-accent hover:text-accent-foreground">
            <FileText className="h-4 w-4" />
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton asChild tooltip="Projects">
          <Link to="/app/projects" className="hover:bg-accent hover:text-accent-foreground">
            <FolderOpen className="h-4 w-4" />
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton asChild tooltip="Favorites">
          <button onClick={() => {}} className="hover:bg-accent hover:text-accent-foreground">
            <Star className="h-4 w-4" />
          </button>
        </SidebarMenuButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Notes Section */}
      <SidebarGroup>
        <div className="flex items-center justify-between px-2">
          <SidebarGroupLabel 
            className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors"
            onClick={() => toggleSection('notes')}
          >
            {expandedSections.notes ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}
            Notes
          </SidebarGroupLabel>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={handleCreateNote}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <AnimatePresence>
          {expandedSections.notes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarGroupContent>
                <SidebarMenu>
                  {recentNotes.map((note) => (
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
                  ))}
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

      {/* Projects Section */}
      <SidebarGroup>
        <div className="flex items-center justify-between px-2">
          <SidebarGroupLabel 
            className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors"
            onClick={() => toggleSection('projects')}
          >
            {expandedSections.projects ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}
            Projects
          </SidebarGroupLabel>
        </div>
        
        <AnimatePresence>
          {expandedSections.projects && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarGroupContent>
                <SidebarMenu>
                  {activeProjects.map((project) => (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton asChild>
                        <Link to={`/app/projects?project=${project.id}`} className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors">
                          <Folder className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="truncate text-xs">{project.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/app/projects" className="text-xs text-sidebar-foreground/60 hover:bg-accent hover:text-accent-foreground transition-colors">
                        View all projects →
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarGroup>

      {/* Favorites Section */}
      <SidebarGroup>
        <div className="flex items-center justify-between px-2">
          <SidebarGroupLabel 
            className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors"
            onClick={() => toggleSection('favorites')}
          >
            {expandedSections.favorites ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}
            Favorites
          </SidebarGroupLabel>
        </div>
        
        <AnimatePresence>
          {expandedSections.favorites && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarGroupContent>
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
              </SidebarGroupContent>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarGroup>
    </div>
  );
}
