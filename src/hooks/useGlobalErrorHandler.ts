
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as Sentry from "@sentry/react";
import { useErrorTracing } from './useErrorTracing';
import { toast } from 'sonner';

export const useGlobalErrorHandler = () => {
  const { traceError } = useErrorTracing();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Send to Sentry with additional context
      Sentry.captureException(event.reason, {
        tags: {
          errorType: 'unhandledPromiseRejection',
          source: 'globalErrorHandler'
        },
        extra: {
          promiseRejectionReason: event.reason,
        }
      });
      
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
      
      // Send to Sentry with additional context
      Sentry.captureException(event.error, {
        tags: {
          errorType: 'javascriptError',
          source: 'globalErrorHandler'
        },
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          message: event.message,
        }
      });
      
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

    // Handle resource loading errors
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      const errorMessage = `Failed to load resource: ${target.tagName} - ${(target as any).src || (target as any).href}`;
      
      console.error('Resource loading error:', errorMessage);
      
      Sentry.captureMessage(errorMessage, 'error');
      
      traceError({
        component: 'GlobalErrorHandler',
        operation: 'resourceError',
        error: new Error(errorMessage),
        context: {
          type: 'resourceError',
          tagName: target.tagName,
          src: (target as any).src || (target as any).href,
        },
      });
    };

    // Handle console errors
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Capture in Sentry
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      Sentry.captureMessage(`Console Error: ${errorMessage}`, 'error');
    };

    // Handle console warnings
    const originalConsoleWarn = console.warn;
    console.warn = (...args: any[]) => {
      // Call original console.warn
      originalConsoleWarn.apply(console, args);
      
      // Capture in Sentry
      const warnMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      Sentry.captureMessage(`Console Warning: ${warnMessage}`, 'warning');
    };

    // Set up global query error handler using query cache
    const queryCache = queryClient.getQueryCache();
    const mutationCache = queryClient.getMutationCache();

    const unsubscribeQuery = queryCache.subscribe((event) => {
      if (event.type === 'updated') {
        const query = event.query;
        if (query.state.error) {
          console.error('Query error:', query.state.error);
          
          // Send to Sentry
          Sentry.captureException(query.state.error, {
            tags: {
              errorType: 'tanstackQueryError',
              source: 'globalErrorHandler'
            },
            extra: {
              queryKey: query.queryKey,
            }
          });
          
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
      if (event.type === 'updated') {
        const mutation = event.mutation;
        if (mutation.state.error) {
          console.error('Mutation error:', mutation.state.error);
          
          // Send to Sentry
          Sentry.captureException(mutation.state.error, {
            tags: {
              errorType: 'tanstackMutationError',
              source: 'globalErrorHandler'
            },
            extra: {
              mutationKey: mutation.options.mutationKey,
            }
          });
          
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
    window.addEventListener('error', handleResourceError, true); // Capture phase for resource errors

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      window.removeEventListener('error', handleResourceError, true);
      
      // Restore original console methods
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [traceError, queryClient]);
};
