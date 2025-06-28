
import React from 'react';
import { ErrorProvider } from '@/contexts/ErrorContext';
import ModernErrorBoundary from './ErrorBoundary/ModernErrorBoundary';
import GlobalErrorBoundary from './ErrorBoundary/GlobalErrorBoundary';
import EnhancedErrorBoundary from './ErrorBoundary/EnhancedErrorBoundary';
import { ErrorBoundaryWithTracing } from './ErrorBoundaryWithTracing';
import { useGlobalErrorHandler } from '../hooks/useGlobalErrorHandler';

interface AppWithAdvancedErrorHandlingProps {
  children: React.ReactNode;
}

const AppWithAdvancedErrorHandling: React.FC<AppWithAdvancedErrorHandlingProps> = ({ children }) => {
  // Set up global error handling
  useGlobalErrorHandler();

  return (
    <ErrorProvider enableToasts={true} maxStoredErrors={100}>
      <GlobalErrorBoundary>
        <ModernErrorBoundary level="page" showRetry={true} showReload={true}>
          <EnhancedErrorBoundary>
            <ErrorBoundaryWithTracing>
              {children}
            </ErrorBoundaryWithTracing>
          </EnhancedErrorBoundary>
        </ModernErrorBoundary>
      </GlobalErrorBoundary>
    </ErrorProvider>
  );
};

export default AppWithAdvancedErrorHandling;
