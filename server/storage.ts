import { 
  users, 
  userProfiles,
  documents,
  folders,
  dashboardWorkspaces,
  dashboardSettings,
  calendarEvents,
  tasks,
  userPreferences,
  apiKeys,
  userActivities,
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
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

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
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // User profiles
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db.insert(userProfiles).values(profile).returning();
    return newProfile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const [updated] = await db
      .update(userProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updated;
  }

  // Documents
  async getDocuments(userId: string, folderId?: string): Promise<Document[]> {
    const query = db.select().from(documents).where(eq(documents.userId, userId));
    if (folderId) {
      return await query.where(eq(documents.folderId, folderId)).orderBy(desc(documents.createdAt));
    }
    return await query.orderBy(desc(documents.createdAt));
  }

  async getDocument(id: string, userId: string): Promise<Document | undefined> {
    const [document] = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)));
    return document || undefined;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }

  async updateDocument(id: string, userId: string, updates: Partial<Document>): Promise<Document> {
    const [updated] = await db
      .update(documents)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(documents.id, id), eq(documents.userId, userId)))
      .returning();
    return updated;
  }

  async deleteDocument(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)));
    return result.rowCount > 0;
  }

  // Folders
  async getFolders(userId: string, parentId?: string): Promise<Folder[]> {
    const query = db.select().from(folders).where(eq(folders.userId, userId));
    if (parentId) {
      return await query.where(eq(folders.parentFolderId, parentId)).orderBy(asc(folders.name));
    }
    return await query.orderBy(asc(folders.name));
  }

  async getFolder(id: string, userId: string): Promise<Folder | undefined> {
    const [folder] = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, id), eq(folders.userId, userId)));
    return folder || undefined;
  }

  async createFolder(folder: InsertFolder): Promise<Folder> {
    const [newFolder] = await db.insert(folders).values(folder).returning();
    return newFolder;
  }

  async updateFolder(id: string, userId: string, updates: Partial<Folder>): Promise<Folder> {
    const [updated] = await db
      .update(folders)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(folders.id, id), eq(folders.userId, userId)))
      .returning();
    return updated;
  }

  async deleteFolder(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(folders)
      .where(and(eq(folders.id, id), eq(folders.userId, userId)));
    return result.rowCount > 0;
  }

  // Dashboard workspaces
  async getDashboardWorkspaces(userId: string): Promise<DashboardWorkspace[]> {
    return await db
      .select()
      .from(dashboardWorkspaces)
      .where(eq(dashboardWorkspaces.userId, userId))
      .orderBy(desc(dashboardWorkspaces.isDefault), asc(dashboardWorkspaces.workspaceName));
  }

  async getDefaultWorkspace(userId: string): Promise<DashboardWorkspace | undefined> {
    const [workspace] = await db
      .select()
      .from(dashboardWorkspaces)
      .where(and(eq(dashboardWorkspaces.userId, userId), eq(dashboardWorkspaces.isDefault, true)));
    return workspace || undefined;
  }

  async createWorkspace(workspace: InsertDashboardWorkspace): Promise<DashboardWorkspace> {
    const [newWorkspace] = await db.insert(dashboardWorkspaces).values(workspace).returning();
    return newWorkspace;
  }

  async updateWorkspace(id: string, userId: string, updates: Partial<DashboardWorkspace>): Promise<DashboardWorkspace> {
    const [updated] = await db
      .update(dashboardWorkspaces)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(dashboardWorkspaces.id, id), eq(dashboardWorkspaces.userId, userId)))
      .returning();
    return updated;
  }

  // Calendar events
  async getCalendarEvents(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    const query = db.select().from(calendarEvents).where(eq(calendarEvents.userId, userId));
    // Add date filtering if provided
    return await query.orderBy(asc(calendarEvents.startDate));
  }

  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const [newEvent] = await db.insert(calendarEvents).values(event).returning();
    return newEvent;
  }

  async updateCalendarEvent(id: string, userId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const [updated] = await db
      .update(calendarEvents)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)))
      .returning();
    return updated;
  }

  async deleteCalendarEvent(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(calendarEvents)
      .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)));
    return result.rowCount > 0;
  }

  // Tasks
  async getTasks(userId: string, isCompleted?: boolean): Promise<Task[]> {
    const query = db.select().from(tasks).where(eq(tasks.userId, userId));
    if (isCompleted !== undefined) {
      return await query.where(eq(tasks.isCompleted, isCompleted)).orderBy(desc(tasks.createdAt));
    }
    return await query.orderBy(desc(tasks.createdAt));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: string, userId: string, updates: Partial<Task>): Promise<Task> {
    const [updated] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return updated;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return result.rowCount > 0;
  }

  // User preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences || undefined;
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [newPreferences] = await db.insert(userPreferences).values(preferences).returning();
    return newPreferences;
  }

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const [updated] = await db
      .update(userPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId))
      .returning();
    return updated;
  }

  // User activities
  async logUserActivity(activity: { 
    userId: string; 
    action: string; 
    description?: string; 
    metadata?: any; 
    ipAddress?: string; 
    userAgent?: string 
  }): Promise<UserActivity> {
    const [newActivity] = await db.insert(userActivities).values(activity).returning();
    return newActivity;
  }

  async getUserActivities(userId: string, limit: number = 50): Promise<UserActivity[]> {
    return await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId))
      .orderBy(desc(userActivities.timestamp))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
