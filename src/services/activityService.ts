import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_title: string;
  activity_description?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  metadata?: Json;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityData {
  activity_type: string;
  activity_title: string;
  activity_description?: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Json;
}

export class ActivityService {
  /**
   * Log a user activity
   */
  static async logActivity(activityData: CreateActivityData): Promise<UserActivity | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_activities')
        .insert([
          {
            user_id: user.id,
            ...activityData
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error logging activity:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error logging activity:', error);
      return null;
    }
  }

  /**
   * Get user activities with pagination
   */
  static async getUserActivities(
    limit: number = 50,
    offset: number = 0
  ): Promise<{ activities: UserActivity[]; count: number }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { activities: [], count: 0 };

      const { data, error, count } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching activities:', error);
        return { activities: [], count: 0 };
      }

      return { activities: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error fetching activities:', error);
      return { activities: [], count: 0 };
    }
  }

  /**
   * Get recent activities (last 10)
   */
  static async getRecentActivities(): Promise<UserActivity[]> {
    const { activities } = await this.getUserActivities(10, 0);
    return activities;
  }

  /**
   * Delete activity
   */
  static async deleteActivity(activityId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_activities')
        .delete()
        .eq('id', activityId);

      if (error) {
        console.error('Error deleting activity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
  }

  /**
   * Common activity types
   */
  static readonly ActivityTypes = {
    NOTE_CREATED: 'note_created',
    NOTE_UPDATED: 'note_updated', 
    NOTE_DELETED: 'note_deleted',
    NOTE_FAVORITED: 'note_favorited',
    NOTE_UNFAVORITED: 'note_unfavorited',
    FOLDER_CREATED: 'folder_created',
    FOLDER_UPDATED: 'folder_updated',
    FOLDER_DELETED: 'folder_deleted',
    EXPORT_NOTES: 'export_notes',
    IMPORT_NOTES: 'import_notes',
    DASHBOARD_VIEWED: 'dashboard_viewed',
    SETTINGS_UPDATED: 'settings_updated'
  } as const;
}