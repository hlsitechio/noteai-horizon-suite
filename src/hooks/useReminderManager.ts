
import { useState, useEffect, useCallback } from 'react';
import { ReminderService } from '../services/reminderService';
import { NotificationService } from '../services/notificationService';
import { PushNotificationService } from '../services/pushNotificationService';
import { useNotifications } from '../contexts/NotificationsContext';
import { toast } from 'sonner';

export const useReminderManager = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [pendingReminders, setPendingReminders] = useState<any[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  const { addNotification } = useNotifications();

  // Initialize push notifications
  useEffect(() => {
    const initializePushNotifications = async () => {
      // Initialize service worker
      const swInitialized = await PushNotificationService.initialize();
      if (!swInitialized) {
        console.warn('Push notifications not supported');
        return;
      }

      // Request notification permission
      const permissionGranted = await PushNotificationService.requestPermission();
      if (!permissionGranted) {
        console.warn('Notification permission not granted');
        return;
      }

      // Subscribe to push notifications
      const subscription = await PushNotificationService.subscribeToPush();
      if (subscription) {
        setPushEnabled(true);
        console.log('Push notifications enabled');
      }
    };

    initializePushNotifications();
  }, []);

  const checkForReminders = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    try {
      const reminders = await ReminderService.getPendingReminders();
      setPendingReminders(reminders);

      // Show notifications for new reminders
      for (const reminder of reminders) {
        // Add to in-app notifications
        addNotification({
          title: `📝 Reminder: ${reminder.note_title}`,
          message: 'Click to view your note',
          type: 'info'
        });

        // Show browser notification
        const notification = NotificationService.showReminderNotification(
          reminder.note_title,
          reminder.note_id,
          reminder.reminder_id
        );

        // Show push notification if enabled
        if (pushEnabled) {
          await PushNotificationService.showLocalNotification(
            `📝 Reminder: ${reminder.note_title}`,
            {
              body: 'Click to view your note',
              tag: `reminder-${reminder.reminder_id}`,
              data: {
                noteId: reminder.note_id,
                reminderId: reminder.reminder_id
              },
              actions: [
                { action: 'view', title: 'View Note' },
                { action: 'snooze', title: 'Snooze 15min' },
                { action: 'dismiss', title: 'Dismiss' }
              ]
            }
          );
        }

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
  }, [isChecking, pushEnabled, addNotification]);

  const snoozeReminder = useCallback(async (reminderId: string, minutes: number = 15) => {
    const success = await ReminderService.snoozeReminder(reminderId, minutes);
    if (success) {
      toast.success(`Reminder snoozed for ${minutes} minutes`);
      setPendingReminders(prev => prev.filter(r => r.reminder_id !== reminderId));
      
      addNotification({
        title: 'Reminder Snoozed',
        message: `Reminder snoozed for ${minutes} minutes`,
        type: 'success'
      });
    } else {
      toast.error('Failed to snooze reminder');
    }
  }, [addNotification]);

  const dismissReminder = useCallback(async (reminderId: string) => {
    const success = await ReminderService.markReminderSent(reminderId);
    if (success) {
      toast.success('Reminder dismissed');
      setPendingReminders(prev => prev.filter(r => r.reminder_id !== reminderId));
      
      addNotification({
        title: 'Reminder Dismissed',
        message: 'Reminder has been dismissed',
        type: 'success'
      });
    } else {
      toast.error('Failed to dismiss reminder');
    }
  }, [addNotification]);

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
    pushEnabled,
    checkForReminders,
    snoozeReminder,
    dismissReminder
  };
};
