
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

    // Set up global query error handler using query cache
    const queryCache = queryClient.getQueryCache();
    const mutationCache = queryClient.getMutationCache();

    const unsubscribeQuery = queryCache.subscribe((event) => {
      if (event.type === 'observerResultsUpdated') {
        const { query } = event;
        if (query.state.error) {
          console.error('Query error:', query.state.error);
          
          if (query.state.error instanceof Error) {
            traceError({
              component: 'GlobalErrorHandler',
              operation: 'queryError',
              error: query.state.error,
              context: {
                type: 'tanstackQueryError',
                queryKey: query.queryKey,
              },
            });
          }
        }
      }
    });

    const unsubscribeMutation = mutationCache.subscribe((event) => {
      if (event.type === 'observerResultsUpdated') {
        const { mutation } = event;
        if (mutation.state.error) {
          console.error('Mutation error:', mutation.state.error);
          
          if (mutation.state.error instanceof Error) {
            traceError({
              component: 'GlobalErrorHandler',
              operation: 'mutationError',
              error: mutation.state.error,
              context: {
                type: 'tanstackMutationError',
                mutationKey: mutation.options.mutationKey,
              },
            });
          }
        }
      }
    });

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [traceError, queryClient]);
};
