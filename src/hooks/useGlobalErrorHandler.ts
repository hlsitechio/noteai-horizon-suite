
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGlobalErrorHandler = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      
      console.error('Unhandled promise rejection:', error);
      toast.error('An unexpected error occurred');
    };

    // Handle JavaScript errors
    const handleError = (event: ErrorEvent) => {
      const error = event.error || new Error(event.message);
      
      console.error('JavaScript error:', error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
      
      toast.error('An unexpected error occurred');
    };

    // Handle resource loading errors
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      const errorMessage = `Failed to load resource: ${target.tagName} - ${(target as any).src || (target as any).href}`;
      
      console.warn('Resource loading error:', errorMessage);
    };

    // Console methods are managed by the unified console system - no conflicts
    

    // Set up global query error handler using query cache
    const queryCache = queryClient.getQueryCache();
    const mutationCache = queryClient.getMutationCache();

    const unsubscribeQuery = queryCache.subscribe((event) => {
      if (event.type === 'updated') {
        const query = event.query;
        if (query.state.error && query.state.error instanceof Error) {
          console.error('React Query error:', query.state.error, {
            queryKey: query.queryKey,
          });
        }
      }
    });

    const unsubscribeMutation = mutationCache.subscribe((event) => {
      if (event.type === 'updated') {
        const mutation = event.mutation;
        if (mutation.state.error && mutation.state.error instanceof Error) {
          console.error('React Query mutation error:', mutation.state.error, {
            mutationKey: mutation.options.mutationKey,
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
      
      // Console methods managed by unified system - no cleanup conflicts
      
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [queryClient]);
};
