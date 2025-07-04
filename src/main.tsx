
// Override console methods IMMEDIATELY before any other code runs
const originalConsoleInfo = console.info;

// Override all console methods to be completely silent except for our welcome message
console.log = () => {};
console.debug = () => {};
console.info = () => {};
console.warn = () => {};
console.error = () => {};

// Show welcome message after a short delay
setTimeout(() => {
  originalConsoleInfo('🚀 Welcome to Online Note AI!');
}, 100);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
    </QueryClientProvider>
  </React.StrictMode>,
);
