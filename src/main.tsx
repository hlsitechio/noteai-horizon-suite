
import React from 'react';
import { createRoot } from 'react-dom/client';
import { blockExternalTracking } from './utils/blockExternalTracking';
import { initializeSecurity } from './utils/securityAudit';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AppInitializationService } from './services/appInitializationService';

// Block external tracking injection before app initialization
blockExternalTracking();

// Initialize security measures to prevent data leaks
initializeSecurity({
  enableConsoleBlocking: !import.meta.env.DEV,
  enableSensitiveDataMasking: true,
  logSecurityViolations: import.meta.env.DEV,
  productionMode: !import.meta.env.DEV
});

// Initialize app with optimized services
AppInitializationService.initialize();

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

const container = document.getElementById('root')!;
const root = createRoot(container);
// Remove StrictMode in production to prevent development-only double renders
const AppWrapper = import.meta.env.DEV ? (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
) : (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </QueryClientProvider>
);

root.render(AppWrapper);
