
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AppInitializationService } from './services/appInitializationService.ts';
import './index.css';

// Import debug tools in development
if (import.meta.env.DEV) {
  import('./utils/debugConsoleHelpers');
  // Import diagnostic tools
  import('./utils/errorDiagnostics');
  import('./utils/emergencyErrorShutdown');
  // Import advanced debugging tools
  import('./utils/advancedErrorDebugger');
  import('./utils/errorEmergencyTools');
  // Import new error correction and prevention systems
  import('./utils/errorCorrectionSystem');
  import('./utils/errorPreventionSystem');
}

// Initialize the application services
AppInitializationService.initialize();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
