
import { useState, useEffect, useCallback } from 'react';
import { ReminderService } from '../services/reminderService';
import { NotificationService } from '../services/notificationService';
import { toast } from 'sonner';

export const useReminderManager = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [pendingReminders, setPendingReminders] = useState<any[]>([]);

  const checkForReminders = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    try {
      const reminders = await ReminderService.getPendingReminders();
      setPendingReminders(reminders);

      // Show notifications for new reminders
      for (const reminder of reminders) {
        const notification = NotificationService.showReminderNotification(
          reminder.note_title,
          reminder.note_id,
          reminder.reminder_id
        );

        if (notification) {
          // Handle notification click
          notification.onclick = () => {
            window.focus();
            window.location.href = `/app/editor?noteId=${reminder.note_id}`;
            notification.close();
          };

          // Mark as sent
          await ReminderService.markReminderSent(reminder.reminder_id);
        }
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]);

  const snoozeReminder = useCallback(async (reminderId: string, minutes: number = 15) => {
    const success = await ReminderService.snoozeReminder(reminderId, minutes);
    if (success) {
      toast.success(`Reminder snoozed for ${minutes} minutes`);
      setPendingReminders(prev => prev.filter(r => r.reminder_id !== reminderId));
    } else {
      toast.error('Failed to snooze reminder');
    }
  }, []);

  const dismissReminder = useCallback(async (reminderId: string) => {
    const success = await ReminderService.markReminderSent(reminderId);
    if (success) {
      toast.success('Reminder dismissed');
      setPendingReminders(prev => prev.filter(r => r.reminder_id !== reminderId));
    } else {
      toast.error('Failed to dismiss reminder');
    }
  }, []);

  // Check for reminders every minute
  useEffect(() => {
    // Initial check
    checkForReminders();

    // Set up interval
    const interval = setInterval(checkForReminders, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkForReminders]);

  // Request notification permission on mount
  useEffect(() => {
    NotificationService.requestPermission().then(granted => {
      if (!granted) {
        toast.error('Please enable notifications to receive reminders');
      }
    });
  }, []);

  return {
    pendingReminders,
    isChecking,
    checkForReminders,
    snoozeReminder,
    dismissReminder
  };
};
