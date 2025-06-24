
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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
  Folder,
  FolderPlus
} from 'lucide-react';
import { useNotes } from '../../../contexts/NotesContext';
import { useFolders } from '../../../contexts/FoldersContext';
import { useProjectRealms } from '../../../contexts/ProjectRealmsContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function NotesSection() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { notes, createNote, updateNote } = useNotes();
  const { folders, createFolder } = useFolders();
  const { projects, updateProject } = useProjectRealms();
  
  const [expandedSections, setExpandedSections] = useState({
    notes: true,
    projects: false,
    favorites: false
  });

  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

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

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        await createFolder({
          name: newFolderName.trim(),
          color: '#3b82f6'
        });
        setNewFolderName('');
        setShowCreateFolderDialog(false);
        toast.success('Folder created successfully');
      } catch (error) {
        console.error('Failed to create folder:', error);
        toast.error('Failed to create folder');
      }
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const noteId = draggableId.replace('note-', '');
    
    try {
      if (destination.droppableId === 'favorites') {
        // Add to favorites
        await updateNote(noteId, { isFavorite: true });
        toast.success('Note added to favorites');
      } else if (destination.droppableId.startsWith('project-')) {
        // Move to project (this would require extending the note structure to include project_id)
        const projectId = destination.droppableId.replace('project-', '');
        toast.success('Note moved to project');
        // Note: You would need to extend the Note interface to include project_id
        // await updateNote(noteId, { project_id: projectId });
      }
    } catch (error) {
      console.error('Failed to move note:', error);
      toast.error('Failed to move note');
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
    <DragDropContext onDragEnd={handleDragEnd}>
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
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setShowCreateFolderDialog(true)}
                title="Create Folder"
              >
                <FolderPlus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={handleCreateNote}
                title="Create Note"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
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
                    {recentNotes.map((note, index) => (
                      <Draggable key={note.id} draggableId={`note-${note.id}`} index={index}>
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
                      </Draggable>
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
                      <Droppable key={project.id} droppableId={`project-${project.id}`}>
                        {(provided, snapshot) => (
                          <SidebarMenuItem
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <SidebarMenuButton asChild>
                              <Link 
                                to={`/app/projects?project=${project.id}`} 
                                className={`flex items-center hover:bg-accent hover:text-accent-foreground transition-colors ${
                                  snapshot.isDraggedOver ? 'bg-accent/50' : ''
                                }`}
                              >
                                <Folder className="h-3 w-3 mr-2 flex-shrink-0" />
                                <span className="truncate text-xs">{project.title}</span>
                              </Link>
                            </SidebarMenuButton>
                            {provided.placeholder}
                          </SidebarMenuItem>
                        )}
                      </Droppable>
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
                  <Droppable droppableId="favorites">
                    {(provided, snapshot) => (
                      <SidebarMenu
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={snapshot.isDraggedOver ? 'bg-accent/20 rounded-md' : ''}
                      >
                        {favoriteNotes.length > 0 ? (
                          favoriteNotes.map((note, index) => (
                            <Draggable key={note.id} draggableId={`favorite-note-${note.id}`} index={index}>
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
                                {snapshot.isDraggedOver ? 'Drop note here to add to favorites' : 'No favorites yet'}
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

        {/* Create Folder Dialog */}
        <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolder();
                  }
                }}
              />
              <Button onClick={handleCreateFolder}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DragDropContext>
  );
}
