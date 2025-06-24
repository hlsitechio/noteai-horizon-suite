
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droppable } from 'react-beautiful-dnd';
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
  Folder
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectRealm } from '../../../types/project';

interface ProjectsListSectionProps {
  projects: ProjectRealm[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function ProjectsListSection({ 
  projects, 
  isExpanded, 
  onToggle 
}: ProjectsListSectionProps) {
  const activeProjects = projects.filter(project => project.status === 'active').slice(0, 3);

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
          Projects
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
                {activeProjects.map((project) => (
                  <Droppable key={project.id} droppableId={`sidebar-project-${project.id}`}>
                    {(provided, snapshot) => (
                      <SidebarMenuItem
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <SidebarMenuButton asChild>
                          <Link 
                            to={`/app/projects?project=${project.id}`} 
                            className={`flex items-center hover:bg-accent hover:text-accent-foreground transition-colors ${
                              snapshot.isDraggingOver ? 'bg-accent/50' : ''
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
  );
}
