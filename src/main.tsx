
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { ProjectRealmsProvider } from './contexts/ProjectRealmsContext';
import { QuantumAIProvider } from './contexts/QuantumAIContext';
import { AccentColorProvider } from './contexts/AccentColorContext';
import { ThemeProvider } from './providers/ThemeProvider';
import { masterErrorResolutionSystem } from './utils/masterErrorResolutionSystem';

// Initialize error resolution system immediately
masterErrorResolutionSystem.initialize({
  developmentMode: import.meta.env.DEV,
  enableConsoleErrorSuppression: true,
  enableReactDevToolsSuppression: true,
  enableBrowserCompatibility: true,
  enableNetworkRecovery: true,
  enableResourceErrorHandling: true,
  enableErrorThrottling: true,
  enableExtensionConflictHandling: true,
});

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
      <ThemeProvider>
        <AccentColorProvider>
          <AuthProvider>
            <NotesProvider>
              <FoldersProvider>
                <ProjectRealmsProvider>
                  <QuantumAIProvider>
                    <App />
                    <Toaster />
                    <ReactQueryDevtools initialIsOpen={false} />
                  </QuantumAIProvider>
                </ProjectRealmsProvider>
              </FoldersProvider>
            </NotesProvider>
          </AuthProvider>
        </AccentColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
