
import * as Sentry from "@sentry/react";
import * as LaunchDarkly from "launchdarkly-js-client-sdk";

export const initSentry = () => {
  Sentry.init({
    dsn: "https://209461c58ea399b71187c83f06ab7770@o4509521908400128.ingest.us.sentry.io/4509562204651520",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
      // Add breadcrumbs integration for better error context
      Sentry.breadcrumbsIntegration({
        console: true,
        dom: true,
        fetch: true,
        history: true,
        sentry: true,
        xhr: true,
      }),
      // LaunchDarkly integration for feature flag tracking
      Sentry.launchDarklyIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    
    environment: import.meta.env.MODE,
    
    // Enhanced error capturing
    ignoreErrors: [
      // Ignore common browser extension errors
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Script error.',
      'Network request failed',
    ],
    
    // Capture all console errors
    beforeSend(event, hint) {
      // In development, log to console but still send to Sentry for testing
      if (import.meta.env.DEV) {
        console.log('Sentry event (dev mode):', event);
        console.log('Error details:', hint.originalException);
      }
      
      // Capture console errors in breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs.forEach(breadcrumb => {
          if (breadcrumb.category === 'console' && breadcrumb.level === 'error') {
            console.log('Console error captured:', breadcrumb.message);
          }
        });
      }
      
      return event;
    },
    
    // Enable debug mode in development
    debug: import.meta.env.DEV,
    
    // Enhanced transport options
    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
  });
};
