import { supabase } from '@/integrations/supabase/client';

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
    const { data, error } = await supabase
      .from('dashboard_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching dashboard settings:', error);
      return null;
    }

    return data ? {
      ...data,
      selected_banner_type: data.selected_banner_type as 'image' | 'video' | null,
      sidebar_panel_sizes: data.sidebar_panel_sizes as Record<string, number>,
      dashboard_edit_mode: data.dashboard_edit_mode || false,
      sidebar_edit_mode: data.sidebar_edit_mode || false,
      edit_mode_expires_at: data.edit_mode_expires_at
    } : null;
  }

  static async createDefaultSettings(): Promise<DashboardSettings | null> {
    // No longer create default settings automatically
    return null;
  }

  static async updateSelectedBanner(
    userId: string,
    bannerUrl: string | null,
    bannerType: 'image' | 'video' | null
  ): Promise<boolean> {
    // First try to update existing settings
    const { data: existingSettings } = await supabase
      .from('dashboard_settings')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingSettings) {
      const { error } = await supabase
        .from('dashboard_settings')
        .update({
          selected_banner_url: bannerUrl,
          selected_banner_type: bannerType,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating banner settings:', error);
        return false;
      }
    } else {
      // Create new settings if none exist
      const { error } = await supabase
        .from('dashboard_settings')
        .insert({
          user_id: userId,
          selected_banner_url: bannerUrl,
          selected_banner_type: bannerType,
          sidebar_panel_sizes: {}
        });

      if (error) {
        console.error('Error creating banner settings:', error);
        return false;
      }
    }

    return true;
  }

  static async updateSidebarPanelSizes(
    userId: string,
    panelSizes: Record<string, number>
  ): Promise<boolean> {
    // First try to update existing settings
    const { data: existingSettings } = await supabase
      .from('dashboard_settings')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingSettings) {
      const { error } = await supabase
        .from('dashboard_settings')
        .update({
          sidebar_panel_sizes: panelSizes,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating sidebar panel sizes:', error);
        return false;
      }
    } else {
      // Create new settings if none exist
      const { error } = await supabase
        .from('dashboard_settings')
        .insert({
          user_id: userId,
          selected_banner_url: null,
          selected_banner_type: null,
          sidebar_panel_sizes: panelSizes
        });

      if (error) {
        console.error('Error creating sidebar settings:', error);
        return false;
      }
    }

    return true;
  }

  static async updateEditModes(
    userId: string,
    dashboardEditMode: boolean,
    sidebarEditMode: boolean
  ): Promise<boolean> {
    const expiresAt = (dashboardEditMode || sidebarEditMode) 
      ? new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
      : null;

    return this.updateSettings(userId, {
      dashboard_edit_mode: dashboardEditMode,
      sidebar_edit_mode: sidebarEditMode,
      edit_mode_expires_at: expiresAt
    });
  }

  static async checkAndClearExpiredEditModes(userId: string): Promise<boolean> {
    const settings = await this.getUserSettings(userId);
    
    if (!settings?.edit_mode_expires_at) return false;
    
    const isExpired = new Date(settings.edit_mode_expires_at) <= new Date();
    
    if (isExpired && (settings.dashboard_edit_mode || settings.sidebar_edit_mode)) {
      await this.updateEditModes(userId, false, false);
      return true; // Indicates modes were cleared
    }
    
    return false;
  }

  static async updateSettings(
    userId: string,
    updates: Partial<Pick<DashboardSettings, 'selected_banner_url' | 'selected_banner_type' | 'sidebar_panel_sizes' | 'dashboard_edit_mode' | 'sidebar_edit_mode' | 'edit_mode_expires_at'>>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dashboard_settings')
        .upsert({
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating dashboard settings:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error updating dashboard settings:', err);
      return false;
    }
  }
}