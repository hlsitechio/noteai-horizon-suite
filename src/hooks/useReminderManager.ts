
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

  // Disabled reminder functionality - no initialization or checking
  console.log('Reminder manager disabled - no reminders will be processed');

  const checkForReminders = useCallback(async () => {
    console.log('Reminder checking is disabled');
    return;
  }, []);

  const snoozeReminder = useCallback(async (reminderId: string, minutes: number = 15) => {
    console.log('Reminder functionality is disabled');
    return false;
  }, []);

  const dismissReminder = useCallback(async (reminderId: string) => {
    console.log('Reminder functionality is disabled');
    return false;
  }, []);

  // Clear any existing intervals on mount and cleanup
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    pendingReminders: [],
    isChecking: false,
    pushEnabled: false,
    checkForReminders,
    snoozeReminder,
    dismissReminder
  };
};
