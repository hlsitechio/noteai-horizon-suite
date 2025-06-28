
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useErrorTracing } from './useErrorTracing';
import { toast } from 'sonner';

export const useGlobalErrorHandler = () => {
  const { traceError } = useErrorTracing();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      traceError({
        component: 'GlobalErrorHandler',
        operation: 'unhandledPromiseRejection',
        error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        context: {
          type: 'unhandledPromiseRejection',
        },
      });

      toast.error('An unexpected error occurred');
    };

    // Handle JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('JavaScript error:', event.error);
      
      traceError({
        component: 'GlobalErrorHandler',
        operation: 'javascriptError',
        error: event.error || new Error(event.message),
        context: {
          type: 'javascriptError',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });

      toast.error('An unexpected error occurred');
    };

    // Set up global query error handler
    queryClient.setDefaultOptions({
      queries: {
        onError: (error) => {
          console.error('Query error:', error);
          
          if (error instanceof Error) {
            traceError({
              component: 'GlobalErrorHandler',
              operation: 'queryError',
              error,
              context: {
                type: 'tanstackQueryError',
              },
            });
          }
        },
      },
      mutations: {
        onError: (error) => {
          console.error('Mutation error:', error);
          
          if (error instanceof Error) {
            traceError({
              component: 'GlobalErrorHandler',
              operation: 'mutationError',
              error,
              context: {
                type: 'tanstackMutationError',
              },
            });
          }
        },
      },
    });

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [traceError, queryClient]);
};
