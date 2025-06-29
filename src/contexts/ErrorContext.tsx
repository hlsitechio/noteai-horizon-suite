import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface ErrorInfo {
  id: string;
  error: Error;
  timestamp: Date;
  component?: string;
  context?: Record<string, any>;
}

interface ErrorContextType {
  errors: ErrorInfo[];
  addError: (error: Error, component?: string, context?: Record<string, any>) => void;
  clearErrors: () => void;
  removeError: (id: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
  enableToasts?: boolean;
  maxStoredErrors?: number;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ 
  children, 
  enableToasts = true,
  maxStoredErrors = 50 
}) => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const addError = (error: Error, component?: string, context?: Record<string, any>) => {
    const errorInfo: ErrorInfo = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error,
      timestamp: new Date(),
      component,
      context
    };

    setErrors(prev => {
      const newErrors = [errorInfo, ...prev];
      // Keep only the most recent errors
      return newErrors.slice(0, maxStoredErrors);
    });

    if (enableToasts) {
      toast.error(`Error in ${component || 'Application'}`, {
        description: error.message,
      });
    }
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  };

  return (
    <ErrorContext.Provider value={{ errors, addError, clearErrors, removeError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
};
