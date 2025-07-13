
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
    // Performance Monitoring - Disabled to avoid rate limiting
    tracesSampleRate: 0, // Completely disabled
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
      'Failed to load resource',
      'net::ERR_FAILED',
      'net::ERR_HTTP2_PROTOCOL_ERROR',
      'CORS policy',
      'Access to fetch',
      'WebSocket connection',
      'createOrJoinSocket',
      'firestore.googleapis.com',
      'lovable-api.com',
      'lovableproject.com',
    ],
    
    debug: false,
    
    // Rate limiting configuration
    maxBreadcrumbs: 50,
    
    // Transport options for rate limiting
    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
    
    beforeSend(event) {
      // Filter out known development/infrastructure errors
      const errorMessage = event.message || '';
      const errorStack = event.exception?.values?.[0]?.stacktrace?.frames?.join('') || '';
      const combinedText = errorMessage + errorStack;
      
      if (
        combinedText.includes('Failed to execute \'put\' on \'Cache\'') ||
        combinedText.includes('Content Security Policy directive') ||
        combinedText.includes('ws://localhost') ||
        combinedText.includes('429') ||
        combinedText.includes('Failed to load resource') ||
        combinedText.includes('net::ERR_FAILED') ||
        combinedText.includes('net::ERR_HTTP2_PROTOCOL_ERROR') ||
        combinedText.includes('CORS policy') ||
        combinedText.includes('Access to fetch') ||
        combinedText.includes('WebSocket connection') ||
        combinedText.includes('createOrJoinSocket') ||
        combinedText.includes('firestore.googleapis.com') ||
        combinedText.includes('lovable-api.com') ||
        combinedText.includes('lovableproject.com') ||
        combinedText.includes('MIME type') ||
        combinedText.includes('refused to apply style')
      ) {
        return null;
      }
      return event;
    },
  });
};
