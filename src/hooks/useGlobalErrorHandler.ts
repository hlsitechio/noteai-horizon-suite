
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as Sentry from "@sentry/react";
import { useErrorTracing } from './useErrorTracing';
import { bugResolutionService } from '@/services/intelligentBugResolutionService';
import { toast } from 'sonner';

export const useGlobalErrorHandler = () => {
  const { traceError } = useErrorTracing();
  const queryClient = useQueryClient();

  // Helper function to analyze errors with intelligent bug resolution
  const analyzeErrorWithResolution = async (error: Error, context: any) => {
    try {
      const suggestions = await bugResolutionService.analyzeError({
        errorMessage: error.message,
        stackTrace: error.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        ...context
      });

      if (suggestions.length > 0) {
        const topSuggestion = suggestions[0];
        if (topSuggestion.confidence > 0.8 && topSuggestion.canAutoResolve) {
          toast.success(`Auto-resolving ${topSuggestion.category} error`);
        } else if (topSuggestion.confidence > 0.6) {
          toast.info(`Potential solution detected for ${topSuggestion.category} error`);
        }
      }
    } catch (analysisError) {
      // Send analysis errors to Sentry instead of console
      Sentry.captureException(analysisError, {
        tags: { source: 'bugResolutionAnalysis' }
      });
    }
  };

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = async (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      
      // Analyze error for intelligent resolution
      await analyzeErrorWithResolution(error, {
        type: 'unhandledPromiseRejection',
        breadcrumbs: []
      });
      
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
        error,
        additionalData: {
          type: 'unhandledPromiseRejection',
        },
      });

      toast.error('An unexpected error occurred');
    };

    // Handle JavaScript errors
    const handleError = async (event: ErrorEvent) => {
      const error = event.error || new Error(event.message);
      
      // Analyze error for intelligent resolution
      await analyzeErrorWithResolution(error, {
        type: 'javascriptError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        breadcrumbs: []
      });
      
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
        error,
        additionalData: {
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
      
      Sentry.captureMessage(errorMessage, 'error');
      
      traceError({
        component: 'GlobalErrorHandler',
        operation: 'resourceError',
        error: new Error(errorMessage),
        additionalData: {
          type: 'resourceError',
          tagName: target.tagName,
          src: (target as any).src || (target as any).href,
        },
      });
    };

    // Console methods are already overridden in main.tsx
    // Just send important messages to Sentry silently

    // Set up global query error handler using query cache
    const queryCache = queryClient.getQueryCache();
    const mutationCache = queryClient.getMutationCache();

    const unsubscribeQuery = queryCache.subscribe(async (event) => {
      if (event.type === 'updated') {
        const query = event.query;
        if (query.state.error && query.state.error instanceof Error) {
          // Analyze error for intelligent resolution
          await analyzeErrorWithResolution(query.state.error, {
            type: 'tanstackQueryError',
            queryKey: query.queryKey,
            breadcrumbs: []
          });
          
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
          
          traceError({
            component: 'GlobalErrorHandler',
            operation: 'queryError',
            error: query.state.error,
            additionalData: {
              type: 'tanstackQueryError',
              queryKey: query.queryKey,
            },
          });
        }
      }
    });

    const unsubscribeMutation = mutationCache.subscribe(async (event) => {
      if (event.type === 'updated') {
        const mutation = event.mutation;
        if (mutation.state.error && mutation.state.error instanceof Error) {
          // Analyze error for intelligent resolution
          await analyzeErrorWithResolution(mutation.state.error, {
            type: 'tanstackMutationError',
            mutationKey: mutation.options.mutationKey,
            breadcrumbs: []
          });
          
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
          
          traceError({
            component: 'GlobalErrorHandler',
            operation: 'mutationError',
            error: mutation.state.error,
            additionalData: {
              type: 'tanstackMutationError',
              mutationKey: mutation.options.mutationKey,
            },
          });
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
      
      // Console methods remain overridden globally
      
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [traceError, queryClient]);
};
