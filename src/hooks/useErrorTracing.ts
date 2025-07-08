import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface ErrorTrace {
  id: string;
  component: string;
  error: string;
  stack: string;
  timestamp: string;
  url: string;
  userAgent: string;
  sessionId?: string;
  userId?: string;
}

export const useErrorTracing = () => {
  const { user } = useAuth();

  const traceError = useCallback(async (payload: {
    component: string;
    error: string;
    stack?: string;
    sessionId?: string;
    additionalData?: Record<string, any>;
  }) => {
    try {
      const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const errorTrace: ErrorTrace = {
        id: traceId,
        component: payload.component,
        error: payload.error,
        stack: payload.stack || '',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: payload.sessionId,
        userId: user?.id,
      };

      // Since security_audit_log table doesn't exist, just log locally for now
      // TODO: Create security_audit_log table if error tracing functionality is needed
      console.warn('Security audit log not available - table missing');
      console.log('Error trace would be stored:', {
        user_id: user?.id || null,
        action: 'error_trace',
        table_name: payload.component,
        record_id: traceId,
        new_values: errorTrace
      });

      // Store in localStorage as fallback
      try {
        const existingTraces = JSON.parse(localStorage.getItem('error_traces') || '[]');
        existingTraces.push(errorTrace);
        
        // Keep only last 50 traces
        if (existingTraces.length > 50) {
          existingTraces.splice(0, existingTraces.length - 50);
        }
        
        localStorage.setItem('error_traces', JSON.stringify(existingTraces));
      } catch (storageError) {
        console.warn('Failed to store error trace in localStorage:', storageError);
      }

      return traceId;
    } catch (error) {
      console.error('Error in error tracing:', error);
      return null;
    }
  }, [user]);

  const getErrorTraces = useCallback(async (limit: number = 20): Promise<ErrorTrace[]> => {
    try {
      // Since table doesn't exist, return from localStorage
      const traces = JSON.parse(localStorage.getItem('error_traces') || '[]');
      return traces.slice(-limit).reverse(); // Most recent first
    } catch (error) {
      console.error('Error retrieving error traces:', error);
      return [];
    }
  }, []);

  return {
    traceError,
    getErrorTraces
  };
};
