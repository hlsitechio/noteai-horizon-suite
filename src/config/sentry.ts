
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  Sentry.init({
    dsn: "https://5066bad906f0271cdf12ddb691b3066f@o4509521908400128.ingest.us.sentry.io/4509588661141504",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, // Reduced for better performance
    // Session Replay  
    replaysSessionSampleRate: 0.01, // Much lower sample rate
    replaysOnErrorSampleRate: 1.0,
    
    environment: import.meta.env.MODE,
    
    // Simplified error handling
    ignoreErrors: [
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Script error.',
      'Network request failed',
      'Cannot assign to read only property',
    ],
    
    // Disable debug mode to prevent console conflicts
    debug: false,
  });
};
