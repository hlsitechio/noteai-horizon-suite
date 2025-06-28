
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppInitializationService } from './services/appInitializationService'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loading...');

// Initialize the application services
AppInitializationService.initialize();

// Create a client with optimized settings for your app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          return (error.status as number) >= 500 && failureCount < 3;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

console.log('QueryClient created with enhanced error handling, rendering app...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, creating React root...');
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Fixed React Query Devtools configuration with valid position */}
      <ReactQueryDevtools 
        initialIsOpen={false}
        position="bottom"
      />
    </QueryClientProvider>
  );
  console.log('App rendered successfully with enhanced error handling and security');
}
