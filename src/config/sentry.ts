
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  Sentry.init({
    dsn: "https://209461c58ea399b71187c83f06ab7770@o4509521908400128.ingest.us.sentry.io/4509562204651520",
    integrations: [
      Sentry.browserTracingIntegration(),
      // LaunchDarkly integration for feature flag monitoring
      Sentry.launchDarklyIntegration(),
      // Only enable replay in production to avoid CSP issues in development
      ...(import.meta.env.PROD ? [Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
        // Disable worker to avoid CSP issues
        useCompression: false,
      })] : []),
      // Add breadcrumbs integration for better error context
      Sentry.breadcrumbsIntegration({
        console: true,
        dom: true,
        fetch: true,
        history: true,
        sentry: true,
        xhr: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay - only in production
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0, // 10% in production, 0% in dev
    replaysOnErrorSampleRate: import.meta.env.PROD ? 1.0 : 0, // 100% on errors in production, 0% in dev
    
    environment: import.meta.env.MODE,
    
    // Enhanced error capturing with better filtering
    ignoreErrors: [
      // Ignore common browser extension errors
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Script error.',
      'Network request failed',
      // Ignore CSP worker errors in development
      'Failed to construct \'Worker\'',
      'SecurityError: Failed to construct \'Worker\'',
      // Ignore ad blocker related errors
      'net::ERR_BLOCKED_BY_CLIENT',
      'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
      // Ignore common tracking script errors
      'facebook.net',
      'tiktok.com',
      'reddit.com',
      'googletagmanager.com',
      'google-analytics.com',
      'static.cloudflareinsights.com',
    ],
    
    // Capture all console errors
    beforeSend(event, hint) {
      // Skip blocked resource errors (they're expected due to ad blockers)
      if (hint.originalException && 
          hint.originalException.toString &&
          hint.originalException.toString().includes('ERR_BLOCKED_BY_CLIENT')) {
        return null;
      }
      
      // Skip CSP violations for known blocked resources
      if (event.message && (
        event.message.includes('facebook.net') ||
        event.message.includes('tiktok.com') ||
        event.message.includes('reddit.com') ||
        event.message.includes('static.cloudflareinsights.com')
      )) {
        return null;
      }
      
      // In development, log to console but still send to Sentry for testing
      if (import.meta.env.DEV) {
        console.log('Sentry event (dev mode):', event);
        console.log('Error details:', hint.originalException);
        
        // Skip CSP violations in development
        if (hint.originalException && hint.originalException.toString().includes('Content Security Policy')) {
          return null;
        }
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
    
    // Enhanced transport options with better error handling
    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
    
    // Add tunnel option for environments with strict CSP
    tunnel: import.meta.env.PROD ? undefined : '/sentry-tunnel',
  });
};
