
import { supabase } from '@/integrations/supabase/client';
import { Reminder } from '../types/note';

export class ReminderService {
  static async createReminder(noteId: string, reminderDate: Date, frequency: 'once' | 'daily' | 'weekly' | 'monthly' = 'once'): Promise<Reminder | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('reminders')
        .insert({
          user_id: user.user.id,
          note_id: noteId,
          reminder_date: reminderDate.toISOString(),
          frequency,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Also update the note's reminder fields
      await supabase
        .from('notes_v2')
        .update({
          reminder_date: reminderDate.toISOString(),
          reminder_status: 'pending',
          reminder_frequency: frequency,
          reminder_enabled: true
        })
        .eq('id', noteId);

      return {
        id: data.id,
        user_id: data.user_id,
        note_id: data.note_id,
        reminder_date: data.reminder_date,
        status: data.status,
        frequency: data.frequency,
        snooze_until: data.snooze_until,
        notification_sent: data.notification_sent,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating reminder:', error);
      return null;
    }
  }

  static async getPendingReminders(): Promise<any[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase.rpc('get_pending_reminders', {
        user_uuid: user.user.id
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting pending reminders:', error);
      return [];
    }
  }

  static async markReminderSent(reminderId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('mark_reminder_sent', {
        reminder_uuid: reminderId
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error marking reminder as sent:', error);
      return false;
    }
  }

  static async snoozeReminder(reminderId: string, minutes: number = 15): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('snooze_reminder', {
        reminder_uuid: reminderId,
        snooze_minutes: minutes
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error snoozing reminder:', error);
      return false;
    }
  }

  static async deleteReminder(reminderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', reminderId);

      return !error;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return false;
    }
  }
}
