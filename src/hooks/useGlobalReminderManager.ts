import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useReminderManager } from './useReminderManager';

// Global hook to manage reminders across the entire app
export const useGlobalReminderManager = () => {
  const { user } = useAuth();
  const reminderManager = useReminderManager();

  useEffect(() => {
    if (!user) return;

    // The useReminderManager hook already sets up the reminder checking interval
    // We just need to make sure it's running when user is authenticated
    // Development logging only (reduced frequency)
    if (import.meta.env.DEV) {
      const logId = `reminder-manager-${user.id}`;
      if (!window[logId]) {
        console.log('Global reminder manager initialized');
        window[logId] = true;
      }
    }
  }, [user]);

  return reminderManager;
};