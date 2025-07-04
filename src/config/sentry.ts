
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  Sentry.init({
    dsn: "https://5066bad906f0271cdf12ddb691b3066f@o4509521908400128.ingest.us.sentry.io/4509588661141504",
    integrations: [
      Sentry.browserTracingIntegration(),
      // Disable replay integration to avoid worker CSP issues
      // Sentry.replayIntegration({
      //   maskAllText: false,
      //   blockAllMedia: false,
      // }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1,
    // Disable session replay to avoid CSP conflicts
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    
    environment: import.meta.env.MODE,
    
    ignoreErrors: [
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Script error.',
      'Network request failed',
      'Cannot assign to read only property',
    ],
    
    debug: false,
  });
};
