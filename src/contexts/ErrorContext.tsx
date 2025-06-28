
import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { toast } from 'sonner';

interface ErrorDetails {
  id: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  component?: string;
  userId?: string;
}

interface ErrorContextType {
  errors: ErrorDetails[];
  reportError: (error: Error, context?: Record<string, any>, severity?: ErrorDetails['severity']) => string;
  clearError: (errorId: string) => void;
  clearAllErrors: () => void;
  getErrorStats: () => {
    total: number;
    bySeverity: Record<ErrorDetails['severity'], number>;
    recent: ErrorDetails[];
  };
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorReporting = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorReporting must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
  maxStoredErrors?: number;
  enableToasts?: boolean;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ 
  children, 
  maxStoredErrors = 50,
  enableToasts = true 
}) => {
  const [errors, setErrors] = useState<ErrorDetails[]>([]);

  const reportError = useCallback((
    error: Error, 
    context?: Record<string, any>, 
    severity: ErrorDetails['severity'] = 'medium'
  ): string => {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const errorDetails: ErrorDetails = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date(),
      severity,
      component: context?.component,
      userId: context?.userId,
    };

    // Add to local storage
    setErrors(prev => {
      const updated = [errorDetails, ...prev];
      return updated.slice(0, maxStoredErrors);
    });

    // Send to Sentry
    Sentry.captureException(error, {
      tags: {
        errorId,
        severity,
        component: context?.component,
      },
      extra: {
        ...context,
        timestamp: errorDetails.timestamp.toISOString(),
      },
      fingerprint: [errorId, error.message]
    });

    // Show toast notification based on severity
    if (enableToasts) {
      switch (severity) {
        case 'critical':
          toast.error('Critical error occurred', {
            description: 'The application may be unstable. Please refresh the page.',
            duration: 10000,
          });
          break;
        case 'high':
          toast.error('Error occurred', {
            description: error.message,
            duration: 5000,
          });
          break;
        case 'medium':
          toast.warning('Something went wrong', {
            description: 'The action may not have completed successfully.',
            duration: 3000,
          });
          break;
        case 'low':
          // Silent for low severity unless in development
          if (import.meta.env.DEV) {
            toast.info('Minor issue detected', {
              description: error.message,
              duration: 2000,
            });
          }
          break;
      }
    }

    // Log to console
    const logLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    console[logLevel](`[${severity.toUpperCase()}] Error ${errorId}:`, error, context);

    return errorId;
  }, [maxStoredErrors, enableToasts]);

  const clearError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(err => err.id !== errorId));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getErrorStats = useCallback(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const bySeverity = errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<ErrorDetails['severity'], number>);

    // Ensure all severity levels are present
    const completeBySeverity: Record<ErrorDetails['severity'], number> = {
      low: bySeverity.low || 0,
      medium: bySeverity.medium || 0,
      high: bySeverity.high || 0,
      critical: bySeverity.critical || 0,
    };

    return {
      total: errors.length,
      bySeverity: completeBySeverity,
      recent: errors.filter(error => error.timestamp > oneHourAgo),
    };
  }, [errors]);

  const contextValue: ErrorContextType = {
    errors,
    reportError,
    clearError,
    clearAllErrors,
    getErrorStats,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};
