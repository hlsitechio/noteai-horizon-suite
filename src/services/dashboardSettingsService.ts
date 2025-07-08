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

      const settings = data.settings as any || {};
      return {
        id: data.id,
        user_id: data.user_id,
        selected_banner_url: settings.selected_banner_url || null,
        selected_banner_type: settings.selected_banner_type || null,
        sidebar_panel_sizes: settings.sidebar_panel_sizes || {},
        dashboard_edit_mode: settings.dashboard_edit_mode || false,
        sidebar_edit_mode: settings.sidebar_edit_mode || false,
        edit_mode_expires_at: settings.edit_mode_expires_at || null,
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
      const defaultSettings = {
        selected_banner_url: null,
        selected_banner_type: null,
        sidebar_panel_sizes: {},
        dashboard_edit_mode: false,
        sidebar_edit_mode: false,
        edit_mode_expires_at: null
      };

      const { data, error } = await supabase
        .from('dashboard_settings')
        .insert({
          user_id: userId,
          settings: defaultSettings
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_id: data.user_id,
        selected_banner_url: null,
        selected_banner_type: null,
        sidebar_panel_sizes: {},
        dashboard_edit_mode: false,
        sidebar_edit_mode: false,
        edit_mode_expires_at: null,
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
      return await this.updateSettings(userId, {
        selected_banner_url: bannerUrl,
        selected_banner_type: bannerType
      });
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
      return await this.updateSettings(userId, {
        sidebar_panel_sizes: panelSizes
      });
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

      return await this.updateSettings(userId, {
        dashboard_edit_mode: dashboardEditMode,
        sidebar_edit_mode: sidebarEditMode,
        edit_mode_expires_at: expiresAt
      });
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
        return await this.updateSettings(userId, {
          dashboard_edit_mode: false,
          sidebar_edit_mode: false,
          edit_mode_expires_at: null
        });
      }

      return false;
    } catch (error) {
      console.error('Error checking expired edit modes:', error);
      return false;
    }
  }

  static async updateSettings(
    userId: string,
    updates: Partial<Pick<DashboardSettings, 'selected_banner_url' | 'selected_banner_type' | 'sidebar_panel_sizes' | 'dashboard_edit_mode' | 'sidebar_edit_mode' | 'edit_mode_expires_at'>>
  ): Promise<boolean> {
    try {
      // Get current settings
      const { data: currentData, error: fetchError } = await supabase
        .from('dashboard_settings')
        .select('settings')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const currentSettings = currentData?.settings as any || {};
      const newSettings = { ...currentSettings, ...updates };

      if (!currentData) {
        // Insert new settings if none exist
        const { error: insertError } = await supabase
          .from('dashboard_settings')
          .insert({
            user_id: userId,
            settings: newSettings
          });

        if (insertError) throw insertError;
      } else {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('dashboard_settings')
          .update({ settings: newSettings })
          .eq('user_id', userId);

        if (updateError) throw updateError;
      }

      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }
}