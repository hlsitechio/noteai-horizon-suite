
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
    // Performance Monitoring - Reduced to avoid rate limiting
    tracesSampleRate: 0.01,
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
      'Failed to execute \'put\' on \'Cache\'',
      'Partial response (status code 206) is unsupported',
      'Content Security Policy directive',
      'ws://localhost',
      'Rate limiting',
      '429',
    ],
    
    debug: false,
    
    // Rate limiting configuration
    maxBreadcrumbs: 50,
    
    // Transport options for rate limiting
    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
    
    beforeSend(event) {
      // Filter out known development/infrastructure errors
      if (event.message?.includes('Failed to execute \'put\' on \'Cache\'') ||
          event.message?.includes('Content Security Policy directive') ||
          event.message?.includes('ws://localhost') ||
          event.message?.includes('429')) {
        return null;
      }
      return event;
    },
  });
};
