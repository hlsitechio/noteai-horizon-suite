
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loading...');

// Create a client with optimized settings for your app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          return (error.status as number) >= 500 && failureCount < 3;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

console.log('QueryClient created, rendering app...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
} else {
  console.log('Root element found, creating React root...');
  
  try {
    const root = createRoot(rootElement);
    root.render(
      <QueryClientProvider client={queryClient}>
        <App />
        {/* Only show React Query Devtools in development */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Failed to render app:', error);
    // Show a basic error message to the user
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center;">
          <h1>Something went wrong</h1>
          <p>Please refresh the page to try again.</p>
          <button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 16px;">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}
