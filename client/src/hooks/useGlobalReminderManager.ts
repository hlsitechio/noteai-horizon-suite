// Temporary placeholder for missing Global Reminder Manager hook
import { useState } from 'react';

export const useGlobalReminderManager = () => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return {
    reminders,
    isLoading,
    addReminder: () => {},
    removeReminder: () => {},
    updateReminder: () => {},
  };
};