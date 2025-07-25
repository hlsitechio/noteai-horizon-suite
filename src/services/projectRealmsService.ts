import { supabase } from '@/integrations/supabase/client';
import { ProjectRealm, ProjectAgent, ProjectFilters } from '../types/project';

export class ProjectRealmsService {
  static async getAllProjects(): Promise<ProjectRealm[]> {
    try {
      const { data, error } = await supabase
        .from('project_realms')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as ProjectRealm[];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  static async createProject(project: Omit<ProjectRealm, 'id' | 'created_at' | 'updated_at' | 'last_activity_at' | 'creator_id'>): Promise<ProjectRealm | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_realms')
        .insert({
          ...project,
          user_id: user.id,
          creator_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ProjectRealm;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  static async updateProject(id: string, updates: Partial<ProjectRealm>): Promise<ProjectRealm | null> {
    try {
      const { data, error } = await supabase
        .from('project_realms')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ProjectRealm;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  static async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('project_realms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  static async getProjectAgents(projectId: string): Promise<ProjectAgent[]> {
    try {
      const { data, error } = await supabase
        .from('project_agents')
        .select('id, project_id, agent_type, name, prompt_template, config, is_active, created_at, updated_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as ProjectAgent[];
    } catch (error) {
      console.error('Error fetching project agents:', error);
      return [];
    }
  }

  static async createAgent(agent: Omit<ProjectAgent, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectAgent | null> {
    try {
      const { data, error } = await supabase
        .from('project_agents')
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