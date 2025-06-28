
import React from 'react';
import { ErrorBoundaryWithTracing } from './ErrorBoundaryWithTracing';
import { useGlobalErrorHandler } from '../hooks/useGlobalErrorHandler';

interface AppWithErrorHandlingProps {
  children: React.ReactNode;
}

const AppWithErrorHandling: React.FC<AppWithErrorHandlingProps> = ({ children }) => {
  // Set up global error handling
  useGlobalErrorHandler();

  return (
    <ErrorBoundaryWithTracing>
      {children}
    </ErrorBoundaryWithTracing>
  );
};

export default AppWithErrorHandling;
