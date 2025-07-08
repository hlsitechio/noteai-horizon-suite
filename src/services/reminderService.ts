import { supabase } from '@/integrations/supabase/client';
import { Reminder } from '../types/note';
import { toast } from 'sonner';

export class ReminderService {
  static async createReminder(noteId: string, reminderDate: Date, frequency: 'once' | 'daily' | 'weekly' | 'monthly' = 'once'): Promise<Reminder | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create reminder in reminders table
      const { data: reminder, error: reminderError } = await supabase
        .from('reminders')
        .insert({
          user_id: user.id,
          note_id: noteId,
          reminder_date: reminderDate.toISOString(),
          frequency,
          status: 'pending'
        })
        .select()
        .single();

      if (reminderError) {
        console.error('Error creating reminder:', reminderError);
        throw reminderError;
      }

      // Update note with reminder info
      const { error: noteError } = await supabase
        .from('notes_v2')
        .update({
          reminder_date: reminderDate.toISOString(),
          reminder_status: 'pending',
          reminder_frequency: frequency,
          reminder_enabled: true
        })
        .eq('id', noteId);

      if (noteError) {
        console.error('Error updating note with reminder:', noteError);
        // Clean up the reminder if note update fails
        await supabase.from('reminders').delete().eq('id', reminder.id);
        throw noteError;
      }

      console.log('Reminder created successfully:', reminder);
      return reminder as Reminder;
    } catch (error: any) {
      console.error('Failed to create reminder:', error);
      toast.error('Failed to create reminder');
      return null;
    }
  }

  static async getUserReminders(userId: string): Promise<Reminder[]> {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select(`
          *,
          notes_v2:note_id (
            title,
            content
          )
        `)
        .eq('user_id', userId)
        .order('reminder_date', { ascending: true });

      if (error) {
        console.error('Error fetching user reminders:', error);
        throw error;
      }

      return (data || []) as Reminder[];
    } catch (error: any) {
      console.error('Failed to fetch user reminders:', error);
      return [];
    }
  }

  static async getPendingReminders(): Promise<Reminder[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('reminders')
        .select(`
          *,
          notes_v2:note_id (
            title,
            content
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .lte('reminder_date', now)
        .or(`snooze_until.is.null,snooze_until.lte.${now}`)
        .order('reminder_date', { ascending: true });

      if (error) {
        console.error('Error fetching pending reminders:', error);
        throw error;
      }

      return (data || []) as Reminder[];
    } catch (error: any) {
      console.error('Failed to fetch pending reminders:', error);
      return [];
    }
  }

  static async markReminderSent(reminderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({
          status: 'sent',
          notification_sent: true
        })
        .eq('id', reminderId);

      if (error) {
        console.error('Error marking reminder as sent:', error);
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Failed to mark reminder as sent:', error);
      return false;
    }
  }

  static async snoozeReminder(reminderId: string, snoozeUntil: Date): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({
          status: 'snoozed',
          snooze_until: snoozeUntil.toISOString()
        })
        .eq('id', reminderId);

      if (error) {
        console.error('Error snoozing reminder:', error);
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Failed to snooze reminder:', error);
      return false;
    }
  }

  static async deleteReminder(reminderId: string): Promise<boolean> {
    try {
      // Get reminder details first to update the associated note
      const { data: reminder, error: fetchError } = await supabase
        .from('reminders')
        .select('note_id')
        .eq('id', reminderId)
        .single();

      if (fetchError) {
        console.error('Error fetching reminder for deletion:', fetchError);
        throw fetchError;
      }

      // Delete the reminder
      const { error: deleteError } = await supabase
        .from('reminders')
        .delete()
        .eq('id', reminderId);

      if (deleteError) {
        console.error('Error deleting reminder:', deleteError);
        throw deleteError;
      }

      // Update the associated note to disable reminder
      if (reminder?.note_id) {
        await supabase
          .from('notes_v2')
          .update({
            reminder_enabled: false,
            reminder_status: 'none'
          })
          .eq('id', reminder.note_id);
      }

      return true;
    } catch (error: any) {
      console.error('Failed to delete reminder:', error);
      return false;
    }
  }

  static async completeReminder(reminderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({
          status: 'dismissed'
        })
        .eq('id', reminderId);

      if (error) {
        console.error('Error completing reminder:', error);
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Failed to complete reminder:', error);
      return false;
    }
  }

  static async processPendingReminders(): Promise<void> {
    try {
      const pendingReminders = await this.getPendingReminders();
      
      // Process each pending reminder
      for (const reminder of pendingReminders) {
        // Here you could add logic to send notifications
        // For now, we'll just log that a reminder is due
        console.log('Reminder due:', {
          id: reminder.id,
          noteTitle: (reminder as any).notes_v2?.title,
          reminderDate: reminder.reminder_date
        });
        
        // You could integrate with browser notifications here
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Reminder', {
            body: `Reminder: ${(reminder as any).notes_v2?.title}`,
            icon: '/favicon.ico'
          });
        }
      }
    } catch (error: any) {
      console.error('Failed to process pending reminders:', error);
    }
  }
}