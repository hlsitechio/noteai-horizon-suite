import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReminderService } from '../services/reminderService';
import { NotificationService } from '../services/notificationService';
import { toast } from 'sonner';

export const useReminderManager = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [pendingReminders, setPendingReminders] = useState<any[]>([]);

  const snoozeReminder = useCallback(async (reminderId: string, minutes: number = 15) => {
    const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000);
    const success = await ReminderService.snoozeReminder(reminderId, snoozeUntil);
    if (success) {
      toast.success(`Reminder snoozed for ${minutes} minutes`);
      setPendingReminders(prev => prev.filter(r => r.id !== reminderId));
    } else {
      toast.error('Failed to snooze reminder');
    }
  }, []);

  const dismissReminder = useCallback(async (reminderId: string) => {
    const success = await ReminderService.markReminderSent(reminderId);
    if (success) {
      toast.success('Reminder dismissed');
      setPendingReminders(prev => prev.filter(r => r.id !== reminderId));
    } else {
      toast.error('Failed to dismiss reminder');
    }
  }, []);

  // Check for reminders periodically
  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;
    let currentlyChecking = false;

    const performReminderCheck = async () => {
      if (currentlyChecking || !mounted) return;
      
      currentlyChecking = true;
      setIsChecking(true);
      
      try {
        const reminders = await ReminderService.getPendingReminders();
        if (mounted) {
          setPendingReminders(reminders);

          // Show notifications for new reminders
          for (const reminder of reminders) {
            const noteTitle = (reminder as any).notes_v2?.title || 'Note reminder';
            
            // Use the NotificationService to show reminder notification
            const notification = NotificationService.showReminderNotification(
              noteTitle,
              reminder.note_id,
              reminder.id
            );
            
            if (!notification) {
              // Fallback to toast if notifications aren't available
              toast.info(`⏰ Reminder: ${noteTitle}`, {
                action: {
                  label: 'View',
                  onClick: () => {
                    // Navigate to the note or editor if needed
                    window.location.href = `/editor/${reminder.note_id}`;
                  }
                }
              });
            }
          }
        }
      } catch (error) {
        console.error('Error checking reminders:', error);
        if (mounted) {
          setPendingReminders([]);
        }
      } finally {
        currentlyChecking = false;
        if (mounted) {
          setIsChecking(false);
        }
      }
    };

    // Initial check after a short delay
    const initialTimeout = setTimeout(() => {
      if (mounted) {
        performReminderCheck();
      }
    }, 3000);

    // Set up interval for periodic checks
    interval = setInterval(() => {
      if (mounted) {
        performReminderCheck();
      }
    }, 300000); // Check every 5 minutes

    return () => {
      mounted = false;
      clearTimeout(initialTimeout);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [navigate]);

  // Request notification permission on mount
  useEffect(() => {
    NotificationService.requestPermission().then(granted => {
      if (!granted) {
        // Notifications not enabled for reminders
      }
    }).catch(error => {
      console.error('Error requesting notification permission:', error);
    });
  }, []);

  return {
    pendingReminders,
    isChecking,
    snoozeReminder,
    dismissReminder
  };
};