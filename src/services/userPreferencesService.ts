import { supabase } from '@/integrations/supabase/client';

export interface UserPreferences {
  id: string;
  user_id: string;
  ai_suggestions_enabled: boolean;
  auto_save_enabled: boolean;
  default_note_category: string;
  ai_model: string;
  smart_formatting_enabled: boolean;
  context_awareness_enabled: boolean;
  backup_to_cloud_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdatePreferencesData {
  ai_suggestions_enabled?: boolean;
  auto_save_enabled?: boolean;
  default_note_category?: string;
  ai_model?: string;
  smart_formatting_enabled?: boolean;
  context_awareness_enabled?: boolean;
  backup_to_cloud_enabled?: boolean;
}

export class UserPreferencesService {
  /**
   * Get user preferences
   */
  static async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No preferences found, create default
          return await this.createDefaultPreferences();
        }
        console.error('Error fetching user preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }

  /**
   * Create default preferences for new user
   */
  static async createDefaultPreferences(): Promise<UserPreferences | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const defaultPrefs = {
        user_id: user.id,
        ai_suggestions_enabled: true,
        auto_save_enabled: true,
        default_note_category: 'general',
        ai_model: 'gpt-3.5',
        smart_formatting_enabled: true,
        context_awareness_enabled: true,
        backup_to_cloud_enabled: true,
      };

      const { data, error } = await supabase
        .from('user_preferences')
        .insert([defaultPrefs])
        .select()
        .single();

      if (error) {
        console.error('Error creating default preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating default preferences:', error);
      return null;
    }
  }

  /**
   * Update user preferences
   */
  static async updateUserPreferences(updates: UpdatePreferencesData): Promise<UserPreferences | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...updates
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating user preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }
  }

  /**
   * Update layout settings in dashboard_settings table
   */
  static async updateLayoutSettings(editMode: boolean): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('dashboard_settings')
        .upsert({
          user_id: user.id,
          dashboard_edit_mode: editMode
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating layout settings:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating layout settings:', error);
      return false;
    }
  }

  /**
   * Get layout settings from dashboard_settings table
   */
  static async getLayoutSettings(): Promise<{ dashboard_edit_mode: boolean } | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('dashboard_settings')
        .select('dashboard_edit_mode')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, return default
          return { dashboard_edit_mode: false };
        }
        console.error('Error fetching layout settings:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching layout settings:', error);
      return null;
    }
  }
}