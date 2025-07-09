import { supabase } from "@/integrations/supabase/client";

export interface DashboardSettings {
  id: string;
  user_id: string;
  selected_banner_url: string | null;
  selected_banner_type: 'image' | 'video' | null;
  sidebar_panel_sizes: Record<string, number>;
  dashboard_edit_mode: boolean;
  sidebar_edit_mode: boolean;
  edit_mode_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export class DashboardSettingsService {
  static async getUserSettings(userId: string): Promise<DashboardSettings | null> {
    try {
      const { data, error } = await supabase
        .from('dashboard_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create default settings if none exist
        return await this.createDefaultSettings(userId);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        selected_banner_url: data.selected_banner_url || null,
        selected_banner_type: (data.selected_banner_type as 'image' | 'video') || null,
        sidebar_panel_sizes: (data.sidebar_panel_sizes as Record<string, number>) || {},
        dashboard_edit_mode: data.dashboard_edit_mode || false,
        sidebar_edit_mode: data.sidebar_edit_mode || false,
        edit_mode_expires_at: data.edit_mode_expires_at || null,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching user settings:', error);
      return null;
    }
  }

  static async createDefaultSettings(userId: string): Promise<DashboardSettings | null> {
    try {
      const { data, error } = await supabase
        .from('dashboard_settings')
        .insert({
          user_id: userId,
          selected_banner_url: null,
          selected_banner_type: null,
          sidebar_panel_sizes: {},
          dashboard_edit_mode: false,
          sidebar_edit_mode: false,
          edit_mode_expires_at: null,
          settings: {}
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_id: data.user_id,
        selected_banner_url: data.selected_banner_url,
        selected_banner_type: data.selected_banner_type as 'image' | 'video',
        sidebar_panel_sizes: (data.sidebar_panel_sizes as Record<string, number>) || {},
        dashboard_edit_mode: data.dashboard_edit_mode,
        sidebar_edit_mode: data.sidebar_edit_mode,
        edit_mode_expires_at: data.edit_mode_expires_at,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating default settings:', error);
      return null;
    }
  }

  static async updateSelectedBanner(
    userId: string,
    bannerUrl: string | null,
    bannerType: 'image' | 'video' | null
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dashboard_settings')
        .update({
          selected_banner_url: bannerUrl,
          selected_banner_type: bannerType
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating selected banner:', error);
      return false;
    }
  }

  static async updateSidebarPanelSizes(
    userId: string,
    panelSizes: Record<string, number>
  ): Promise<boolean> {
    try {
      console.log('Updating sidebar panel sizes in database:', panelSizes);
      
      const { error } = await supabase
        .from('dashboard_settings')
        .update({
          sidebar_panel_sizes: panelSizes
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Database error updating panel sizes:', error);
        throw error;
      }
      
      console.log('Panel sizes updated successfully in database');
      return true;
    } catch (error) {
      console.error('Error updating sidebar panel sizes:', error);
      return false;
    }
  }

  static async updateEditModes(
    userId: string,
    dashboardEditMode: boolean,
    sidebarEditMode: boolean
  ): Promise<boolean> {
    try {
      const expiresAt = dashboardEditMode || sidebarEditMode 
        ? new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
        : null;

      const { error } = await supabase
        .from('dashboard_settings')
        .update({
          dashboard_edit_mode: dashboardEditMode,
          sidebar_edit_mode: sidebarEditMode,
          edit_mode_expires_at: expiresAt
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating edit modes:', error);
      return false;
    }
  }

  static async checkAndClearExpiredEditModes(userId: string): Promise<boolean> {
    try {
      const settings = await this.getUserSettings(userId);
      if (!settings || !settings.edit_mode_expires_at) return false;

      const expiresAt = new Date(settings.edit_mode_expires_at);
      const now = new Date();

      if (now > expiresAt) {
        const { error } = await supabase
          .from('dashboard_settings')
          .update({
            dashboard_edit_mode: false,
            sidebar_edit_mode: false,
            edit_mode_expires_at: null
          })
          .eq('user_id', userId);

        if (error) throw error;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking expired edit modes:', error);
      return false;
    }
  }

  // Create default settings row if none exists
  static async ensureSettingsExist(userId: string): Promise<boolean> {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('dashboard_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (!existing) {
        const { error: insertError } = await supabase
          .from('dashboard_settings')
          .insert({
            user_id: userId,
            selected_banner_url: null,
            selected_banner_type: null,
            sidebar_panel_sizes: {},
            dashboard_edit_mode: false,
            sidebar_edit_mode: false,
            edit_mode_expires_at: null,
            settings: {}
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('Error ensuring settings exist:', error);
      return false;
    }
  }
}