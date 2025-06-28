
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize push notifications
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

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

    // Request notification permission on mount
    NotificationService.requestPermission().then(granted => {
      if (!granted) {
        toast.error('Please enable notifications to receive reminders');
      }
    });
  }, []);

  const checkForReminders = useCallback(async () => {
    if (isChecking) {
      console.log('Reminder check already in progress, skipping...');
      return;
    }
    
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

  // Set up interval for checking reminders
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial check
    checkForReminders();

    // Set up new interval - check every 60 seconds
    intervalRef.current = setInterval(() => {
      checkForReminders();
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkForReminders]);

  return {
    pendingReminders,
    isChecking,
    pushEnabled,
    checkForReminders,
    snoozeReminder,
    dismissReminder
  };
};
