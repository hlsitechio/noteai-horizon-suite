
import { useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { useToast } from '@/hooks/use-toast';
import { rateLimiter, secureLog } from '@/utils/securityUtils';

interface ErrorHandlerOptions {
  component?: string;
  operation?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  showToast?: boolean;
  context?: Record<string, any>;
}

export const useConsolidatedErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: Error, options: ErrorHandlerOptions = {}) => {
    const {
      component = 'Unknown',
      operation = 'unknown_operation',
      severity = 'medium',
      showToast = true,
      context = {}
    } = options;

    // Rate limiting
    const errorKey = `error_${component}_${operation}`;
    if (!rateLimiter.checkLimit(errorKey, 5, 60000)) {
      return; // Skip if rate limited
    }

    // Generate error ID
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Secure logging
    secureLog.error(`[${component}] ${operation} failed`, {
      errorId,
      message: error.message,
      severity,
      ...context
    });

    // Send to Sentry
    Sentry.captureException(error, {
      tags: {
        component,
        operation,
        severity,
        errorId
      },
      extra: context
    });

    // Show toast notification
    if (showToast) {
      const toastConfig = {
        title: severity === 'critical' ? 'Critical Error' : 'Error Occurred',
        description: severity === 'low' ? 'Minor issue detected' : error.message,
        variant: severity === 'critical' || severity === 'high' ? 'destructive' : 'default'
      } as const;

      toast(toastConfig);
    }

    return errorId;
  }, [toast]);

  return { handleError };
};
