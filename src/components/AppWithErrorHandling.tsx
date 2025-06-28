
import React from 'react';
import { ErrorBoundaryWithTracing } from './ErrorBoundaryWithTracing';
import { useGlobalErrorHandler } from '../hooks/useGlobalErrorHandler';
import NotesQueryDevtools from './NotesQueryDevtools';
import TanStackQueryTest from './TanStackQueryTest';

interface AppWithErrorHandlingProps {
  children: React.ReactNode;
}

const AppWithErrorHandling: React.FC<AppWithErrorHandlingProps> = ({ children }) => {
  // Set up global error handling
  useGlobalErrorHandler();

  return (
    <ErrorBoundaryWithTracing>
      {/* Temporary test component - remove this after testing */}
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <TanStackQueryTest />
      </div>
      {children}
      <NotesQueryDevtools />
    </ErrorBoundaryWithTracing>
  );
};

export default AppWithErrorHandling;
