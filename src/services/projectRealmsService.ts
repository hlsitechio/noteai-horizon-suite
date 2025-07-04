
import { supabase } from '@/integrations/supabase/client';
import { ProjectRealm, ProjectAgent, ProjectFilters } from '../types/project';

export class ProjectRealmsService {
  static async getAllProjects(): Promise<ProjectRealm[]> {
    try {
      // Wait for the auth state to be ready with a timeout
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('ProjectRealmsService: Authentication error', {
          error: userError,
          errorMessage: userError.message,
          errorCode: userError.message
        });
        throw new Error(`Authentication failed: ${userError.message}`);
      }

      if (!user) {
        console.warn('ProjectRealmsService: No authenticated user found');
        // Return empty array instead of throwing error for better UX
        return [];
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('ProjectRealmsService: Loading projects for user:', user.id);
      }

      const { data, error } = await supabase
        .from('project_realms')
        .select('*')
        .eq('creator_id', user.id)
        .order('last_activity_at', { ascending: false });

      if (error) {
        console.error('ProjectRealmsService: Supabase query error', {
          error: error,
          errorMessage: error.message,
          errorCode: error.code,
          errorDetails: error.details,
          errorHint: error.hint,
          userId: user.id
        });
        throw new Error(`Failed to load projects: ${error.message} (Code: ${error.code})`);
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('ProjectRealmsService: Successfully loaded projects:', {
          count: data?.length || 0,
          userId: user.id,
          projectIds: data?.map(p => p.id) || []
        });
      }
      
      return (data || []) as ProjectRealm[];
    } catch (error) {
      const errorDetails = {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'UnknownError',
        originalError: error
      };
      
      console.error('ProjectRealmsService: Error in getAllProjects:', errorDetails);
      
      // Don't throw error if user is not authenticated - just return empty array
      if (errorDetails.message.includes('not authenticated') || errorDetails.message.includes('Authentication failed')) {
        console.warn('ProjectRealmsService: User not authenticated, returning empty projects array');
        return [];
      }
      
      // Re-throw with enhanced error information for other errors
      const enhancedError = new Error(`Project loading failed: ${errorDetails.message}`);
      enhancedError.name = 'ProjectLoadingError';
      enhancedError.stack = errorDetails.stack;
      throw enhancedError;
    }
  }

  static async createProject(project: Omit<ProjectRealm, 'id' | 'created_at' | 'updated_at' | 'last_activity_at' | 'creator_id'>): Promise<ProjectRealm | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Creating project for user:', user.id, project);

      const { data, error } = await supabase
        .from('project_realms')
        .insert({
          ...project,
          creator_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }
      
      console.log('Created project:', data);
      return data as ProjectRealm;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  static async updateProject(id: string, updates: Partial<ProjectRealm>): Promise<ProjectRealm | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_realms')
        .update(updates)
        .eq('id', id)
        .eq('creator_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }
      
      return data as ProjectRealm;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  static async deleteProject(id: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('project_realms')
        .delete()
        .eq('id', id)
        .eq('creator_id', user.id);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  static async getProjectAgents(projectId: string): Promise<ProjectAgent[]> {
    try {
      const { data, error } = await supabase
        .from('project_agents' as any)
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as ProjectAgent[];
    } catch (error) {
      console.error('Error loading project agents:', error);
      return [];
    }
  }

  static async createAgent(agent: Omit<ProjectAgent, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectAgent | null> {
    try {
      const { data, error } = await supabase
        .from('project_agents' as any)
        .insert(agent)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ProjectAgent;
    } catch (error) {
      console.error('Error creating agent:', error);
      return null;
    }
  }

  static filterProjects(projects: ProjectRealm[], filters: ProjectFilters): ProjectRealm[] {
    return projects.filter(project => {
      if (filters.status && project.status !== filters.status) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(searchLower);
        const matchesDescription = project.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }
      return true;
    });
  }
}
