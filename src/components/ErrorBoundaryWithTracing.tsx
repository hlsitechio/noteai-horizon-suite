
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useErrorTracing } from '../hooks/useErrorTracing';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const { traceError } = useErrorTracing();

  React.useEffect(() => {
    traceError({
      component: 'ErrorBoundary',
      operation: 'componentError',
      error,
      context: {
        timestamp: new Date().toISOString(),
      },
    });
  }, [error, traceError]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We've encountered an unexpected error. Our team has been notified and is working on a fix.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3 text-left">
            <p className="text-sm font-mono text-gray-800 break-all">
              {error.message}
            </p>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              onClick={resetErrorBoundary}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="default"
            >
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ErrorBoundaryWithTracingProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export const ErrorBoundaryWithTracing: React.FC<ErrorBoundaryWithTracingProps> = ({
  children,
  fallback: FallbackComponent = ErrorFallback,
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={(error, errorInfo) => {
        console.error('Error Boundary caught an error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
