import { useGlobalReminderManager } from '@/hooks/useGlobalReminderManager';

// Silent component that initializes global reminder management
export const ReminderManager: React.FC = () => {
  useGlobalReminderManager();
  return null; // This component renders nothing, it just manages reminders
};