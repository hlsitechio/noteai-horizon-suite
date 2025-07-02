
import React from 'react';
import GlobalErrorBoundary from './ErrorBoundary/GlobalErrorBoundary';
import { ErrorBoundaryWithTracing } from './ErrorBoundaryWithTracing';
import { useGlobalErrorHandler } from '../hooks/useGlobalErrorHandler';

interface AppWithErrorHandlingProps {
  children: React.ReactNode;
}

const AppWithErrorHandling: React.FC<AppWithErrorHandlingProps> = ({ children }) => {
  // Set up global error handling
  useGlobalErrorHandler();

  return (
    <GlobalErrorBoundary>
      <ErrorBoundaryWithTracing>
        {children}
      </ErrorBoundaryWithTracing>
    </GlobalErrorBoundary>
  );
};

export default AppWithErrorHandling;
