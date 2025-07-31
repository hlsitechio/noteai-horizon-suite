/**
 * Robust Component Utilities
 * Higher-order components and hooks for building resilient UI components
 */

import React, { Component, ErrorInfo, ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

/**
 * Enhanced Error Boundary with better recovery options
 */
export class RobustErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Show user-friendly error message
    toast.error('Something went wrong. The component will try to recover automatically.', {
      duration: 5000,
    });

    // Auto-recovery after 5 seconds
    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      toast.info('Component recovered. Please try again.');
    }, 5000);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state if resetKeys changed
    if (this.props.resetOnPropsChange && this.props.resetKeys !== prevProps.resetKeys) {
      if (this.state.hasError) {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <h3 className="font-semibold text-destructive mb-2">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-3">
            The component encountered an error and will recover automatically.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for robust component mounting/unmounting detection
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}

/**
 * Hook for safe state updates that only execute if component is mounted
 */
export function useSafeState<T>(
  initialState: T | (() => T)
): [T, (newState: T | ((prevState: T) => T)) => void] {
  const [state, setState] = useState(initialState);
  const isMounted = useIsMounted();

  const safeSetState = useCallback((newState: T | ((prevState: T) => T)) => {
    if (isMounted()) {
      setState(newState);
    }
  }, [isMounted]);

  return [state, safeSetState];
}

/**
 * Hook for robust async operations with automatic cleanup
 */
export function useRobustAsync<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    immediate?: boolean;
  } = {}
) {
  const { onSuccess, onError, immediate = true } = options;
  const [data, setData] = useSafeState<T | null>(null);
  const [loading, setLoading] = useSafeState(false);
  const [error, setError] = useSafeState<Error | null>(null);
  const isMounted = useIsMounted();

  const execute = useCallback(async () => {
    if (!isMounted()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await asyncFn();
      if (isMounted()) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      if (isMounted()) {
        setError(error);
        onError?.(error);
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [asyncFn, isMounted, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, deps);

  return { data, loading, error, execute };
}

/**
 * Higher-order component for adding error boundaries to any component
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const ComponentWithErrorBoundary = (props: P) => (
    <RobustErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </RobustErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ComponentWithErrorBoundary;
}

/**
 * Hook for graceful component unmounting with cleanup
 */
export function useGracefulUnmount(cleanupFn?: () => void) {
  const cleanupRef = useRef(cleanupFn);
  cleanupRef.current = cleanupFn;

  useEffect(() => {
    return () => {
      try {
        cleanupRef.current?.();
      } catch (error) {
        console.warn('Cleanup function error during unmount:', error);
      }
    };
  }, []);
}