
import { supabase } from '@/integrations/supabase/client';

export interface NotificationPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  phone_number?: string;
  email_address?: string;
}

export class NotificationPreferencesService {
  static async getNotificationPreferences(): Promise<NotificationPreferences | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_user_notification_preferences', {
        user_uuid: user.user.id
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return null;
    }
  }

  static async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }
}
