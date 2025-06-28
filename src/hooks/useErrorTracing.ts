
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

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

      // Log to console for development
      console.error('Error Trace:', errorTrace);

      // Store in Supabase for monitoring
      const { error } = await supabase
        .from('error_traces')
        .insert(errorTrace);

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
    logErrorMutation.mutate(payload);
  };

  return {
    traceError,
    isLogging: logErrorMutation.isPending,
  };
};
