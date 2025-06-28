
import { useState, useEffect, useCallback } from 'react';
import { EnhancedReminderService } from '../services/enhancedReminderService';
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
      const reminders = await EnhancedReminderService.getPendingRemindersWithPreferences();
      setPendingReminders(reminders);

      // Send all types of notifications for each reminder
      for (const reminder of reminders) {
        // Add to in-app notifications
        addNotification({
          title: `📝 Reminder: ${reminder.note_title}`,
          message: 'Click to view your note',
          type: 'info'
        });

        // Send all configured notifications (browser, push, email, SMS)
        await EnhancedReminderService.sendReminderNotifications(reminder);
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, addNotification]);

  const snoozeReminder = useCallback(async (reminderId: string, minutes: number = 15) => {
    const success = await EnhancedReminderService.snoozeReminder(reminderId, minutes);
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
    const success = await EnhancedReminderService.markReminderSent(reminderId);
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
