
import React from 'react';
import GlobalErrorBoundary from './ErrorBoundary/GlobalErrorBoundary';
import EnhancedErrorBoundary from './ErrorBoundary/EnhancedErrorBoundary';
import { ErrorBoundaryWithTracing } from './ErrorBoundaryWithTracing';
import { useGlobalErrorHandler } from '../hooks/useGlobalErrorHandler';

interface AppWithEnhancedErrorHandlingProps {
  children: React.ReactNode;
}

const AppWithEnhancedErrorHandling: React.FC<AppWithEnhancedErrorHandlingProps> = ({ children }) => {
  // Set up global error handling
  useGlobalErrorHandler();

  return (
    <GlobalErrorBoundary>
      <EnhancedErrorBoundary>
        <ErrorBoundaryWithTracing>
          {children}
        </ErrorBoundaryWithTracing>
      </EnhancedErrorBoundary>
    </GlobalErrorBoundary>
  );
};

export default AppWithEnhancedErrorHandling;
