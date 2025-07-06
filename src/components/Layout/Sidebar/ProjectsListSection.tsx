
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
          Projects
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
              {activeProjects.map((project) => (
                <Button key={project.id} variant="ghost" size="sm" asChild className="w-full justify-start h-auto p-1">
                  <Link 
                    to={`/app/projects?project=${project.id}`} 
                    className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Folder className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate text-xs">{project.title}</span>
                  </Link>
                </Button>
              ))}
              <Button variant="ghost" size="sm" asChild className="w-full justify-start h-auto p-1">
                <Link to="/app/projects" className="text-xs text-sidebar-foreground/60 hover:bg-accent hover:text-accent-foreground transition-colors">
                  View all projects →
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
