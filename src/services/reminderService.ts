// Reminder service - DISABLED
// The reminders table doesn't exist in the current database schema

import { Reminder } from '../types/note';

export class ReminderService {
  static async createReminder(noteId: string, reminderDate: Date, frequency: 'once' | 'daily' | 'weekly' | 'monthly' = 'once'): Promise<Reminder | null> {
    console.warn('Reminder service disabled - reminders table missing from database schema');
    return null;
  }

  static async getUserReminders(userId: string): Promise<Reminder[]> {
    console.warn('Reminder service disabled - reminders table missing from database schema');
    return [];
  }

  static async getPendingReminders(): Promise<Reminder[]> {
    console.warn('Reminder service disabled - reminders table missing from database schema');
    return [];
  }

  static async markReminderSent(reminderId: string): Promise<boolean> {
    console.warn('Reminder service disabled - reminders table missing from database schema');
    return false;
  }

  static async snoozeReminder(reminderId: string, snoozeUntil: Date): Promise<boolean> {
    console.warn('Reminder service disabled - reminders table missing from database schema');
    return false;
  }

  static async deleteReminder(reminderId: string): Promise<boolean> {
    console.warn('Reminder service disabled - reminders table missing from database schema');
    return false;
  }

  static async completeReminder(reminderId: string): Promise<boolean> {
    console.warn('Reminder service disabled - reminders table missing from database schema');
    return false;
  }

  static async processPendingReminders(): Promise<void> {
    console.warn('Reminder service disabled - reminders table missing from database schema');
  }
}