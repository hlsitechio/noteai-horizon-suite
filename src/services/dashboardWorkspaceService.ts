import { supabase } from "@/integrations/supabase/client";

export interface DashboardWorkspace {
  id: string;
  user_id: string;
  workspace_name: string;
  is_default: boolean;
  
  // Layout Settings
  dashboard_layout: Record<string, any>;
  sidebar_layout: Record<string, any>;
  panel_sizes: Record<string, number>;
  
  // Banner Settings
  selected_banner_url: string | null;
  selected_banner_type: 'image' | 'video' | null;
  banner_settings: Record<string, any>;
  
  // UI Settings
  glowing_effects_enabled: boolean;
  theme_settings: Record<string, any>;
  
  // Weather Settings
  weather_location: string;
  weather_enabled: boolean;
  weather_units: 'celsius' | 'fahrenheit';
  
  // Edit Mode Settings
  dashboard_edit_mode: boolean;
  sidebar_edit_mode: boolean;
  edit_mode_expires_at: string | null;
  
  // Additional Settings
  custom_settings: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

export class DashboardWorkspaceService {
  static async getUserWorkspace(userId: string): Promise<DashboardWorkspace | null> {
    try {
      const { data, error } = await supabase
        .from('dashboard_workspaces')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create default workspace if none exists
        return await this.createDefaultWorkspace(userId);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        workspace_name: data.workspace_name,
        is_default: data.is_default,
        dashboard_layout: (data.dashboard_layout as Record<string, any>) || {},
        sidebar_layout: (data.sidebar_layout as Record<string, any>) || {},
        panel_sizes: (data.panel_sizes as Record<string, number>) || {},
        selected_banner_url: data.selected_banner_url,
        selected_banner_type: data.selected_banner_type as 'image' | 'video' | null,
        banner_settings: (data.banner_settings as Record<string, any>) || {},
        glowing_effects_enabled: data.glowing_effects_enabled ?? true,
        theme_settings: (data.theme_settings as Record<string, any>) || {},
        weather_location: data.weather_location || 'New York',
        weather_enabled: data.weather_enabled ?? true,
        weather_units: (data.weather_units as 'celsius' | 'fahrenheit') || 'celsius',
        dashboard_edit_mode: data.dashboard_edit_mode || false,
        sidebar_edit_mode: data.sidebar_edit_mode || false,
        edit_mode_expires_at: data.edit_mode_expires_at,
        custom_settings: (data.custom_settings as Record<string, any>) || {},
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching user workspace:', error);
      return null;
    }
  }

  static async createDefaultWorkspace(userId: string): Promise<DashboardWorkspace | null> {
    try {
      const { data, error } = await supabase
        .from('dashboard_workspaces')
        .insert({
          user_id: userId,
          workspace_name: 'Main Dashboard',
          is_default: true,
          dashboard_layout: {},
          sidebar_layout: {},
          panel_sizes: {},
          banner_settings: {},
          glowing_effects_enabled: true,
          theme_settings: {},
          weather_location: 'New York',
          weather_enabled: true,
          weather_units: 'celsius',
          dashboard_edit_mode: false,
          sidebar_edit_mode: false,
          custom_settings: {}
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_id: data.user_id,
        workspace_name: data.workspace_name,
        is_default: data.is_default,
        dashboard_layout: (data.dashboard_layout as Record<string, any>) || {},
        sidebar_layout: (data.sidebar_layout as Record<string, any>) || {},
        panel_sizes: (data.panel_sizes as Record<string, number>) || {},
        selected_banner_url: data.selected_banner_url,
        selected_banner_type: data.selected_banner_type as 'image' | 'video' | null,
        banner_settings: (data.banner_settings as Record<string, any>) || {},
        glowing_effects_enabled: data.glowing_effects_enabled ?? true,
        theme_settings: (data.theme_settings as Record<string, any>) || {},
        weather_location: data.weather_location || 'New York',
        weather_enabled: data.weather_enabled ?? true,
        weather_units: (data.weather_units as 'celsius' | 'fahrenheit') || 'celsius',
        dashboard_edit_mode: data.dashboard_edit_mode || false,
        sidebar_edit_mode: data.sidebar_edit_mode || false,
        edit_mode_expires_at: data.edit_mode_expires_at,
        custom_settings: (data.custom_settings as Record<string, any>) || {},
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating default workspace:', error);
      return null;
    }
  }

  static async updateWorkspace(
    userId: string,
    updates: Partial<Omit<DashboardWorkspace, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dashboard_workspaces')
        .update(updates)
        .eq('user_id', userId)
        .eq('is_default', true);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating workspace:', error);
      return false;
    }
  }

  // Specific update methods for different settings
  static async updateBannerSettings(
    userId: string,
    bannerUrl: string | null,
    bannerType: 'image' | 'video' | null
  ): Promise<boolean> {
    return this.updateWorkspace(userId, {
      selected_banner_url: bannerUrl,
      selected_banner_type: bannerType
    });
  }

  static async updatePanelSizes(
    userId: string,
    panelSizes: Record<string, number>
  ): Promise<boolean> {
    return this.updateWorkspace(userId, { panel_sizes: panelSizes });
  }

  static async updateWeatherSettings(
    userId: string,
    location: string,
    enabled: boolean,
    units: 'celsius' | 'fahrenheit'
  ): Promise<boolean> {
    return this.updateWorkspace(userId, {
      weather_location: location,
      weather_enabled: enabled,
      weather_units: units
    });
  }

  static async updateLayoutSettings(
    userId: string,
    dashboardLayout: Record<string, any>,
    sidebarLayout: Record<string, any>
  ): Promise<boolean> {
    return this.updateWorkspace(userId, {
      dashboard_layout: dashboardLayout,
      sidebar_layout: sidebarLayout
    });
  }

  static async updateUISettings(
    userId: string,
    glowingEffects: boolean,
    themeSettings: Record<string, any>
  ): Promise<boolean> {
    return this.updateWorkspace(userId, {
      glowing_effects_enabled: glowingEffects,
      theme_settings: themeSettings
    });
  }

  static async updateEditModes(
    userId: string,
    dashboardEditMode: boolean,
    sidebarEditMode: boolean
  ): Promise<boolean> {
    const expiresAt = dashboardEditMode || sidebarEditMode 
      ? new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
      : null;

    return this.updateWorkspace(userId, {
      dashboard_edit_mode: dashboardEditMode,
      sidebar_edit_mode: sidebarEditMode,
      edit_mode_expires_at: expiresAt
    });
  }

  // Ensure workspace exists for user
  static async ensureWorkspaceExists(userId: string): Promise<boolean> {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('dashboard_workspaces')
        .select('id')
        .eq('user_id', userId)
        .eq('is_default', true)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (!existing) {
        const created = await this.createDefaultWorkspace(userId);
        return created !== null;
      }

      return true;
    } catch (error) {
      console.error('Error ensuring workspace exists:', error);
      return false;
    }
  }
}