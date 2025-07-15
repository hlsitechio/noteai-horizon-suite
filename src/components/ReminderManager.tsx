import React from 'react';
import { useGlobalReminderManager } from '@/hooks/useGlobalReminderManager';
import { useAuth } from '@/contexts/AuthContext';

// Silent component that initializes global reminder management
// Only runs when user is authenticated
export const ReminderManager: React.FC = React.memo(() => {
  const { user } = useAuth();
  const reminderManager = useGlobalReminderManager();
  
  // Only initialize reminder management for authenticated users
  if (!user) {
    return null;
  }
  
  return null; // This component renders nothing, it just manages reminders
});

ReminderManager.displayName = 'ReminderManager';