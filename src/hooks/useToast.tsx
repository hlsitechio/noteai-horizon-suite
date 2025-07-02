
import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '../contexts/NotificationsContext';

interface ToastContextType {
  toast: {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
