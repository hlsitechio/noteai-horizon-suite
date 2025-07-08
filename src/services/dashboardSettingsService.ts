// Dashboard settings service - DISABLED
// The dashboard_settings table doesn't exist in the current database schema

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
    console.warn('Dashboard settings service disabled - dashboard_settings table missing from database schema');
    
    // Return mock settings for compatibility
    return {
      id: 'mock-settings',
      user_id: userId,
      selected_banner_url: null,
      selected_banner_type: null,
      sidebar_panel_sizes: {},
      dashboard_edit_mode: false,
      sidebar_edit_mode: false,
      edit_mode_expires_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  static async createDefaultSettings(): Promise<DashboardSettings | null> {
    console.warn('Dashboard settings service disabled - dashboard_settings table missing from database schema');
    return null;
  }

  static async updateSelectedBanner(
    userId: string,
    bannerUrl: string | null,
    bannerType: 'image' | 'video' | null
  ): Promise<boolean> {
    console.warn('Dashboard settings service disabled - dashboard_settings table missing from database schema');
    return false;
  }

  static async updateSidebarPanelSizes(
    userId: string,
    panelSizes: Record<string, number>
  ): Promise<boolean> {
    console.warn('Dashboard settings service disabled - dashboard_settings table missing from database schema');
    return false;
  }

  static async updateEditModes(
    userId: string,
    dashboardEditMode: boolean,
    sidebarEditMode: boolean
  ): Promise<boolean> {
    console.warn('Dashboard settings service disabled - dashboard_settings table missing from database schema');
    return false;
  }

  static async checkAndClearExpiredEditModes(userId: string): Promise<boolean> {
    console.warn('Dashboard settings service disabled - dashboard_settings table missing from database schema');
    return false;
  }

  static async updateSettings(
    userId: string,
    updates: Partial<Pick<DashboardSettings, 'selected_banner_url' | 'selected_banner_type' | 'sidebar_panel_sizes' | 'dashboard_edit_mode' | 'sidebar_edit_mode' | 'edit_mode_expires_at'>>
  ): Promise<boolean> {
    console.warn('Dashboard settings service disabled - dashboard_settings table missing from database schema');
    return false;
  }
}