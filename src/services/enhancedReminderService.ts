
import { supabase } from '@/integrations/supabase/client';
import { ReminderService } from './reminderService';
import { NotificationService } from './notificationService';
import { PushNotificationService } from './pushNotificationService';

interface PendingReminderWithPreferences {
  reminder_id: string;
  note_id: string;
  note_title: string;
  reminder_date: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  phone_number?: string;
  email_address?: string;
}

export class EnhancedReminderService extends ReminderService {
  static async getPendingRemindersWithPreferences(): Promise<PendingReminderWithPreferences[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase.rpc('get_pending_reminders_with_preferences', {
        user_uuid: user.user.id
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting pending reminders with preferences:', error);
      return [];
    }
  }

  static async sendReminderNotifications(reminder: PendingReminderWithPreferences): Promise<void> {
    try {
      // Send browser notification (always)
      NotificationService.showReminderNotification(
        reminder.note_title,
        reminder.note_id,
        reminder.reminder_id
      );

      // Send push notification (always)
      await PushNotificationService.showLocalNotification(
        `📝 Reminder: ${reminder.note_title}`,
        {
          body: 'Click to view your note',
          tag: `reminder-${reminder.reminder_id}`,
          data: {
            noteId: reminder.note_id,
            reminderId: reminder.reminder_id
          }
        }
      );

      // Send email notification if enabled
      if (reminder.email_notifications && reminder.email_address) {
        await this.sendEmailNotification(reminder);
      }

      // Send SMS notification if enabled
      if (reminder.sms_notifications && reminder.phone_number) {
        await this.sendSMSNotification(reminder);
      }

      // Mark reminder as sent
      await this.markReminderSent(reminder.reminder_id);
    } catch (error) {
      console.error('Error sending reminder notifications:', error);
    }
  }

  private static async sendEmailNotification(reminder: PendingReminderWithPreferences): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-reminder-email', {
        body: {
          email: reminder.email_address,
          noteTitle: reminder.note_title,
          noteId: reminder.note_id,
          reminderId: reminder.reminder_id
        }
      });

      if (error) {
        console.error('Error sending email notification:', error);
      } else {
        console.log('Email notification sent successfully');
      }
    } catch (error) {
      console.error('Error invoking email function:', error);
    }
  }

  private static async sendSMSNotification(reminder: PendingReminderWithPreferences): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-reminder-sms', {
        body: {
          phoneNumber: reminder.phone_number,
          noteTitle: reminder.note_title,
          noteId: reminder.note_id,
          reminderId: reminder.reminder_id
        }
      });

      if (error) {
        console.error('Error sending SMS notification:', error);
      } else {
        console.log('SMS notification sent successfully');
      }
    } catch (error) {
      console.error('Error invoking SMS function:', error);
    }
  }
}
