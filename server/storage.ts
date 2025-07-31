import { 
  type User, 
  type InsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Document,
  type InsertDocument,
  type Folder,
  type InsertFolder,
  type DashboardWorkspace,
  type InsertDashboardWorkspace,
  type CalendarEvent,
  type InsertCalendarEvent,
  type Task,
  type InsertTask,
  type UserPreferences,
  type InsertUserPreferences,
  type ApiKey,
  type UserActivity
} from "@shared/schema";
import { supabase } from "./supabase";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  
  // Documents
  getDocuments(userId: string, folderId?: string): Promise<Document[]>;
  getDocument(id: string, userId: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, userId: string, updates: Partial<Document>): Promise<Document>;
  deleteDocument(id: string, userId: string): Promise<boolean>;
  
  // Folders
  getFolders(userId: string, parentId?: string): Promise<Folder[]>;
  getFolder(id: string, userId: string): Promise<Folder | undefined>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  updateFolder(id: string, userId: string, updates: Partial<Folder>): Promise<Folder>;
  deleteFolder(id: string, userId: string): Promise<boolean>;
  
  // Dashboard workspaces
  getDashboardWorkspaces(userId: string): Promise<DashboardWorkspace[]>;
  getDefaultWorkspace(userId: string): Promise<DashboardWorkspace | undefined>;
  createWorkspace(workspace: InsertDashboardWorkspace): Promise<DashboardWorkspace>;
  updateWorkspace(id: string, userId: string, updates: Partial<DashboardWorkspace>): Promise<DashboardWorkspace>;
  
  // Calendar events
  getCalendarEvents(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]>;
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  updateCalendarEvent(id: string, userId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent>;
  deleteCalendarEvent(id: string, userId: string): Promise<boolean>;
  
  // Tasks
  getTasks(userId: string, isCompleted?: boolean): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string, userId: string): Promise<boolean>;
  
  // User preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences>;
  
  // User activities
  logUserActivity(activity: { userId: string; action: string; description?: string; metadata?: any; ipAddress?: string; userAgent?: string }): Promise<UserActivity>;
  getUserActivities(userId: string, limit?: number): Promise<UserActivity[]>;
  
  // Onboarding status
  getUserOnboardingStatus(userId: string): Promise<{ onboarding_completed: boolean } | undefined>;
  updateUserOnboardingStatus(userId: string, completed: boolean): Promise<void>;
}

export class SupabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to create user: ${error?.message}`);
    return data as User;
  }

  // User profiles
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as UserProfile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to create profile: ${error?.message}`);
    return data as UserProfile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to update profile: ${error?.message}`);
    return data as UserProfile;
  }

  // Documents
  async getDocuments(userId: string, folderId?: string): Promise<Document[]> {
    let query = supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId);
    
    if (folderId) {
      query = query.eq('folder_id', folderId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch documents: ${error.message}`);
    return (data || []) as Document[];
  }

  async getDocument(id: string, userId: string): Promise<Document | undefined> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as Document;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to create document: ${error?.message}`);
    return data as Document;
  }

  async updateDocument(id: string, userId: string, updates: Partial<Document>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to update document: ${error?.message}`);
    return data as Document;
  }

  async deleteDocument(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    return !error;
  }

  // Folders
  async getFolders(userId: string, parentId?: string): Promise<Folder[]> {
    let query = supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId);
    
    if (parentId) {
      query = query.eq('parent_folder_id', parentId);
    }
    
    const { data, error } = await query.order('name', { ascending: true });
    
    if (error) throw new Error(`Failed to fetch folders: ${error.message}`);
    return (data || []) as Folder[];
  }

  async getFolder(id: string, userId: string): Promise<Folder | undefined> {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as Folder;
  }

  async createFolder(folder: InsertFolder): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .insert(folder)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to create folder: ${error?.message}`);
    return data as Folder;
  }

  async updateFolder(id: string, userId: string, updates: Partial<Folder>): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to update folder: ${error?.message}`);
    return data as Folder;
  }

  async deleteFolder(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    return !error;
  }

  // Dashboard workspaces
  async getDashboardWorkspaces(userId: string): Promise<DashboardWorkspace[]> {
    const { data, error } = await supabase
      .from('dashboard_workspaces')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('workspace_name', { ascending: true });
    
    if (error) throw new Error(`Failed to fetch workspaces: ${error.message}`);
    return (data || []) as DashboardWorkspace[];
  }

  async getDefaultWorkspace(userId: string): Promise<DashboardWorkspace | undefined> {
    const { data, error } = await supabase
      .from('dashboard_workspaces')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();
    
    if (error || !data) return undefined;
    return data as DashboardWorkspace;
  }

  async createWorkspace(workspace: InsertDashboardWorkspace): Promise<DashboardWorkspace> {
    const { data, error } = await supabase
      .from('dashboard_workspaces')
      .insert(workspace)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to create workspace: ${error?.message}`);
    return data as DashboardWorkspace;
  }

  async updateWorkspace(id: string, userId: string, updates: Partial<DashboardWorkspace>): Promise<DashboardWorkspace> {
    const { data, error } = await supabase
      .from('dashboard_workspaces')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to update workspace: ${error?.message}`);
    return data as DashboardWorkspace;
  }

  // Calendar events
  async getCalendarEvents(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId);
    
    if (startDate) {
      query = query.gte('start_time', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('end_time', endDate.toISOString());
    }
    
    const { data, error } = await query.order('start_time', { ascending: true });
    
    if (error) throw new Error(`Failed to fetch calendar events: ${error.message}`);
    return (data || []) as CalendarEvent[];
  }

  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert(event)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to create calendar event: ${error?.message}`);
    return data as CalendarEvent;
  }

  async updateCalendarEvent(id: string, userId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const { data, error } = await supabase
      .from('calendar_events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to update calendar event: ${error?.message}`);
    return data as CalendarEvent;
  }

  async deleteCalendarEvent(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    return !error;
  }

  // Tasks
  async getTasks(userId: string, isCompleted?: boolean): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (typeof isCompleted === 'boolean') {
      query = query.eq('completed', isCompleted);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch tasks: ${error.message}`);
    return (data || []) as Task[];
  }

  async createTask(task: InsertTask): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to create task: ${error?.message}`);
    return data as Task;
  }

  async updateTask(id: string, userId: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to update task: ${error?.message}`);
    return data as Task;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    return !error;
  }

  // User preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as UserPreferences;
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const { data, error } = await supabase
      .from('user_preferences')
      .insert(preferences)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to create preferences: ${error?.message}`);
    return data as UserPreferences;
  }

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const { data, error } = await supabase
      .from('user_preferences')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to update preferences: ${error?.message}`);
    return data as UserPreferences;
  }

  // User activities
  async logUserActivity(activity: { userId: string; action: string; description?: string; metadata?: any; ipAddress?: string; userAgent?: string }): Promise<UserActivity> {
    const { data, error } = await supabase
      .from('user_activities')
      .insert({
        user_id: activity.userId,
        action: activity.action,
        description: activity.description,
        metadata: activity.metadata,
        ip_address: activity.ipAddress,
        user_agent: activity.userAgent,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error || !data) throw new Error(`Failed to log activity: ${error?.message}`);
    return data as UserActivity;
  }

  async getUserActivities(userId: string, limit: number = 50): Promise<UserActivity[]> {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw new Error(`Failed to fetch activities: ${error.message}`);
    return (data || []) as UserActivity[];
  }

  // Onboarding status
  async getUserOnboardingStatus(userId: string): Promise<{ onboarding_completed: boolean } | undefined> {
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('onboarding_completed')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return { onboarding_completed: data.onboarding_completed };
  }

  async updateUserOnboardingStatus(userId: string, completed: boolean): Promise<void> {
    // Try to update existing record first
    const { error: updateError } = await supabase
      .from('user_onboarding')
      .update({ 
        onboarding_completed: completed,
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', userId);

    // If no record exists, create one
    if (updateError) {
      const { error: insertError } = await supabase
        .from('user_onboarding')
        .insert({
          user_id: userId,
          onboarding_completed: completed,
          onboarding_enabled: true,
          current_step: completed ? -1 : 0,
          completed_steps: completed ? ['welcome'] : [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error(`Failed to create onboarding status: ${insertError.message}`);
      }
    }
  }
}

export const storage = new SupabaseStorage();