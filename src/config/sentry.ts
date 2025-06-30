
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  // Only initialize Sentry in production and when DSN is available
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
      beforeSend(event) {
        // Filter out non-critical errors
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.type === 'ChunkLoadError' || 
              error?.value?.includes('Loading chunk') ||
              error?.value?.includes('ResizeObserver')) {
            return null;
          }
        }
        return event;
      },
    });
  } else {
    // Use Lovable's internal error tracking in development
    console.log('🔧 Using Lovable internal error tracking');
    
    // Set up basic error tracking for development
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }
};
