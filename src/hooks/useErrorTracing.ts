
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { errorThrottlingManager } from '@/utils/errorThrottlingDeduplication';

interface ErrorTrace {
  id: string;
  timestamp: string;
  userId?: string;
  component: string;
  operation: string;
  error: {
    message: string;
    stack?: string;
    code?: string;
  };
  context: Record<string, any>;
  userAgent: string;
  url: string;
}

interface ErrorTracePayload {
  component: string;
  operation: string;
  error: Error;
  context?: Record<string, any>;
}

export const useErrorTracing = () => {
  const queryClient = useQueryClient();

  const logErrorMutation = useMutation({
    mutationFn: async (payload: ErrorTracePayload) => {
      // Check if this error should be throttled
      const errorKey = `${payload.component}_${payload.operation}_${payload.error.message}`;
      if (errorThrottlingManager.shouldThrottleError(errorKey)) {
        console.log('Error throttled:', errorKey);
        return null;
      }

      const traceId = uuidv4();
      const { data: { user } } = await supabase.auth.getUser();
      
      const errorTrace: ErrorTrace = {
        id: traceId,
        timestamp: new Date().toISOString(),
        userId: user?.id,
        component: payload.component,
        operation: payload.operation,
        error: {
          message: payload.error.message,
          stack: payload.error.stack,
          code: payload.error.name,
        },
        context: payload.context || {},
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Only log to console in development, and limit the output
      if (import.meta.env.DEV) {
        console.warn('Error Trace:', {
          component: errorTrace.component,
          operation: errorTrace.operation,
          message: errorTrace.error.message,
          id: errorTrace.id
        });
      }

      // Store in security_audit_log table for monitoring
      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          user_id: user?.id || null,
          action: 'error_trace',
          table_name: payload.component,
          record_id: traceId,
          new_values: errorTrace as any,
        });

      if (error) {
        console.error('Failed to store error trace:', error);
      }

      return traceId;
    },
    onError: (error) => {
      console.error('Error tracing failed:', error);
    },
  });

  const traceError = (payload: ErrorTracePayload) => {
    // Additional throttling at the hook level
    if (payload.component === 'ErrorBoundary' && payload.operation === 'componentError') {
      const errorKey = `ErrorBoundary_${payload.error.message}`;
      if (errorThrottlingManager.shouldThrottleError(errorKey)) {
        return;
      }
    }
    
    logErrorMutation.mutate(payload);
  };

  return {
    traceError,
    isLogging: logErrorMutation.isPending,
  };
};
