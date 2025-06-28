
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectRealm, ProjectAgent, ProjectFilters } from '../types/project';
import { ProjectRealmsService } from '../services/projectRealmsService';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

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
  const { user, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectRealm[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectRealm | null>(null);
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  const refreshProjects = async () => {
    // Only load projects if user is authenticated
    if (!user) {
      console.log('ProjectRealms: User not authenticated, skipping project load');
      setProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log('ProjectRealms: Loading projects for authenticated user');
      const loadedProjects = await ProjectRealmsService.getAllProjects();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      // Only show error toast if user is authenticated
      if (user) {
        toast.error('Failed to load projects');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth to be resolved before attempting to load projects
    if (!authLoading) {
      refreshProjects();
    }
  }, [user, authLoading]);

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
