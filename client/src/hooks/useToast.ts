
import { useNotifications } from '../contexts/NotificationsContext';

export const useToast = () => {
  const { addNotification } = useNotifications();

  const toast = {
    success: (title: string, message?: string) => {
      addNotification({
        title,
        message: message || '',
        type: 'success'
      });
    },
    error: (title: string, message?: string) => {
      addNotification({
        title,
        message: message || '',
        type: 'error'
      });
    },
    info: (title: string, message?: string) => {
      addNotification({
        title,
        message: message || '',
        type: 'info'
      });
    },
    warning: (title: string, message?: string) => {
      addNotification({
        title,
        message: message || '',
        type: 'warning'
      });
    }
  };

  return { toast };
};
