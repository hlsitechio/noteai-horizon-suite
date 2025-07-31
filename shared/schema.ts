import { pgTable, text, serial, integer, boolean, timestamp, uuid, jsonb, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main users table (keeping existing structure for now)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// User profiles table
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  website: text("website"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documents table
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  fileUrl: text("file_url").notNull(),
  storagePath: text("storage_path").notNull(),
  folderId: uuid("folder_id"),
  description: text("description"),
  tags: text("tags").array(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Folders table
export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  parentFolderId: uuid("parent_folder_id"),
  path: text("path"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dashboard workspaces table
export const dashboardWorkspaces = pgTable("dashboard_workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  workspaceName: text("workspace_name").default("Default Workspace"),
  isDefault: boolean("is_default").default(false),
  dashboardLayout: jsonb("dashboard_layout"),
  sidebarLayout: jsonb("sidebar_layout"),
  panelSizes: jsonb("panel_sizes"),
  dashboardEditMode: boolean("dashboard_edit_mode").default(false),
  sidebarEditMode: boolean("sidebar_edit_mode").default(false),
  editModeExpiresAt: timestamp("edit_mode_expires_at"),
  selectedBannerType: text("selected_banner_type"),
  selectedBannerUrl: text("selected_banner_url"),
  bannerSettings: jsonb("banner_settings"),
  themeSettings: jsonb("theme_settings"),
  customSettings: jsonb("custom_settings"),
  weatherEnabled: boolean("weather_enabled").default(false),
  weatherLocation: text("weather_location"),
  weatherUnits: text("weather_units"),
  glowingEffectsEnabled: boolean("glowing_effects_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dashboard settings table
export const dashboardSettings = pgTable("dashboard_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  settings: jsonb("settings").default({}),
  dashboardEditMode: boolean("dashboard_edit_mode").default(false),
  sidebarEditMode: boolean("sidebar_edit_mode").default(false),
  editModeExpiresAt: timestamp("edit_mode_expires_at"),
  selectedBannerType: text("selected_banner_type"),
  selectedBannerUrl: text("selected_banner_url"),
  sidebarPanelSizes: jsonb("sidebar_panel_sizes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calendar events table
export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isAllDay: boolean("is_all_day").default(false),
  location: text("location"),
  reminderMinutes: integer("reminder_minutes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").default(false),
  priority: text("priority").default("medium"),
  dueDate: timestamp("due_date"),
  reminderAt: timestamp("reminder_at"),
  category: text("category"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  theme: text("theme").default("light"),
  language: text("language").default("en"),
  timezone: text("timezone").default("UTC"),
  notifications: jsonb("notifications").default({}),
  dashboardPreferences: jsonb("dashboard_preferences").default({}),
  privacySettings: jsonb("privacy_settings").default({}),
  accessibilitySettings: jsonb("accessibility_settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API keys table
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  keyHash: text("key_hash").notNull(),
  permissions: jsonb("permissions"),
  isActive: boolean("is_active").default(true),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User activities table
export const userActivities = pgTable("user_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  action: text("action").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFolderSchema = createInsertSchema(folders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDashboardWorkspaceSchema = createInsertSchema(dashboardWorkspaces).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Folder = typeof folders.$inferSelect;
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type DashboardWorkspace = typeof dashboardWorkspaces.$inferSelect;
export type InsertDashboardWorkspace = z.infer<typeof insertDashboardWorkspaceSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type UserActivity = typeof userActivities.$inferSelect;
