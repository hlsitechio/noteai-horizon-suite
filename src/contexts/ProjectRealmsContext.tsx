import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectRealm, ProjectAgent, ProjectFilters } from '../types/project';
import { ProjectRealmsService } from '../services/projectRealmsService';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';

interface ProjectRealmsContextType {
  projects: ProjectRealm[];
  filteredProjects: ProjectRealm[];
  currentProject: ProjectRealm | null;
  filters: ProjectFilters;
  isLoading: boolean;
  createProject: (project: Omit<ProjectRealm, 'id' | 'created_at' | 'updated_at' | 'last_activity_at' | 'creator_id'>) => Promise<ProjectRealm | null>;
  updateProject: (id: string, updates: Partial<ProjectRealm>) => Promise<ProjectRealm | null>;
  deleteProject: (id: string) => Promise<boolean>;
  setCurrentProject: (project: ProjectRealm | null) => void;
  setFilters: (filters: ProjectFilters) => void;
  refreshProjects: () => void;
  getProjectAgents: (projectId: string) => Promise<ProjectAgent[]>;
  createAgent: (agent: Omit<ProjectAgent, 'id' | 'created_at' | 'updated_at'>) => Promise<ProjectAgent | null>;
}

const ProjectRealmsContext = createContext<ProjectRealmsContextType | undefined>(undefined);

export const useProjectRealms = () => {
  const context = useContext(ProjectRealmsContext);
  if (!context) {
    throw new Error('useProjectRealms must be used within a ProjectRealmsProvider');
  }
  return context;
};

export const ProjectRealmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectRealm[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectRealm | null>(null);
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  const refreshProjects = async () => {
    // Don't try to load projects if auth is still loading or user is not authenticated
    if (authLoading || !isAuthenticated || !user) {
      logger.projects.debug('Skipping project refresh - auth not ready', {
        authLoading,
        isAuthenticated,
        hasUser: !!user
      });
      setProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      logger.projects.debug('Starting project refresh for authenticated user...');
      const loadedProjects = await ProjectRealmsService.getAllProjects();
      logger.projects.debug('Projects loaded successfully:', {
        count: loadedProjects.length,
        projects: loadedProjects.map(p => ({ id: p.id, title: p.title }))
      });
      setProjects(loadedProjects);
    } catch (error) {
      const errorInfo = {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'UnknownError',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      };
      
      logger.projects.error('Failed to load projects', errorInfo);
      toast.error(`Failed to load projects: ${errorInfo.message}`);
      
      // Set empty array on error to prevent app crashes
      setProjects([]);
    } finally {
      setIsLoading(false);
      logger.projects.debug('Project refresh completed');
    }
  };

  // Only refresh projects when authentication state changes to authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      logger.projects.debug('User authenticated, refreshing projects...');
      refreshProjects();
    } else if (!authLoading && !isAuthenticated) {
      logger.projects.debug('User not authenticated, clearing projects...');
      setProjects([]);
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, user?.id]);

  const createProject = async (projectData: Omit<ProjectRealm, 'id' | 'created_at' | 'updated_at' | 'last_activity_at' | 'creator_id'>): Promise<ProjectRealm | null> => {
    try {
      const newProject = await ProjectRealmsService.createProject(projectData);
      if (newProject) {
        setProjects(prev => [newProject, ...prev]);
        toast.success('Project created successfully');
      }
      return newProject;
    } catch (error) {
      toast.error('Failed to create project');
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<ProjectRealm>): Promise<ProjectRealm | null> => {
    try {
      const updatedProject = await ProjectRealmsService.updateProject(id, updates);
      if (updatedProject) {
        setProjects(prev => prev.map(project => project.id === id ? updatedProject : project));
        if (currentProject?.id === id) {
          setCurrentProject(updatedProject);
        }
        toast.success('Project updated successfully');
      }
      return updatedProject;
    } catch (error) {
      toast.error('Failed to update project');
      throw error;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const success = await ProjectRealmsService.deleteProject(id);
      if (success) {
        setProjects(prev => prev.filter(project => project.id !== id));
        if (currentProject?.id === id) {
          setCurrentProject(null);
        }
        toast.success('Project deleted successfully');
      }
      return success;
    } catch (error) {
      toast.error('Failed to delete project');
      throw error;
    }
  };

  const getProjectAgents = async (projectId: string): Promise<ProjectAgent[]> => {
    return await ProjectRealmsService.getProjectAgents(projectId);
  };

  const createAgent = async (agentData: Omit<ProjectAgent, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectAgent | null> => {
    try {
      const newAgent = await ProjectRealmsService.createAgent(agentData);
      if (newAgent) {
        toast.success('Agent created successfully');
      }
      return newAgent;
    } catch (error) {
      toast.error('Failed to create agent');
      throw error;
    }
  };

  // Filter projects based on current filters
  const filteredProjects = ProjectRealmsService.filterProjects(projects, filters);

  return (
    <ProjectRealmsContext.Provider
      value={{
        projects,
        filteredProjects,
        currentProject,
        filters,
        isLoading,
        createProject,
        updateProject,
        deleteProject,
        setCurrentProject,
        setFilters,
        refreshProjects,
        getProjectAgents,
        createAgent,
      }}
    >
      {children}
    </ProjectRealmsContext.Provider>
  );
};

// Export the context itself for use in App.tsx
export { ProjectRealmsContext };
