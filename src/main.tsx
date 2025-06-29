
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { masterErrorResolutionSystem } from './utils/masterErrorResolutionSystem';

// Initialize error resolution system only if not already initialized
if (!masterErrorResolutionSystem.isInitialized()) {
  masterErrorResolutionSystem.initialize({
    developmentMode: import.meta.env.DEV,
    enableConsoleErrorSuppression: true,
    enableReactDevToolsSuppression: true,
    enableBrowserCompatibility: true,
    enableNetworkRecovery: true,
    enableResourceErrorHandling: true,
    enableErrorThrottling: true,
    enableExtensionConflictHandling: true,
    enableDetailedLogging: import.meta.env.DEV,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
