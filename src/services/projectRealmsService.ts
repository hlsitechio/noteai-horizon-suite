// Project Realms service - DISABLED
// The project_realms table doesn't exist in the current database schema

import { ProjectRealm, ProjectAgent, ProjectFilters } from '../types/project';

export class ProjectRealmsService {
  static async getAllProjects(): Promise<ProjectRealm[]> {
    console.warn('Project Realms service disabled - project_realms table missing from database schema');
    return [];
  }

  static async createProject(project: Omit<ProjectRealm, 'id' | 'created_at' | 'updated_at' | 'last_activity_at' | 'creator_id'>): Promise<ProjectRealm | null> {
    console.warn('Project Realms service disabled - project_realms table missing from database schema');
    return null;
  }

  static async updateProject(id: string, updates: Partial<ProjectRealm>): Promise<ProjectRealm | null> {
    console.warn('Project Realms service disabled - project_realms table missing from database schema');
    return null;
  }

  static async deleteProject(id: string): Promise<boolean> {
    console.warn('Project Realms service disabled - project_realms table missing from database schema');
    return false;
  }

  static async getProjectAgents(projectId: string): Promise<ProjectAgent[]> {
    console.warn('Project Realms service disabled - project_agents table missing from database schema');
    return [];
  }

  static async createAgent(agent: Omit<ProjectAgent, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectAgent | null> {
    console.warn('Project Realms service disabled - project_agents table missing from database schema');
    return null;
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