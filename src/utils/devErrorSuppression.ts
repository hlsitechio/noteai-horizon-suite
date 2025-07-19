/**
 * Development Error Suppression System
 * Filters out known development environment errors that don't affect functionality
 */

// Known development error patterns that can be safely ignored
const DEV_ERROR_PATTERNS = [
  /WebSocket connection.*failed/i,
  /Failed to load resource.*net::ERR_FAILED/i,
  /CORS policy.*blocked/i,
  /_sandbox\/dev-server/i,
  /Access-Control-Allow-Origin/i,
  /\[vite\].*connecting/i,
  /\[vite\].*connected/i,
  /\[HMR\]/i,
  /livereload/i,
  /hot.*reload/i,
  /dev.*server/i
];

/**
 * Check if an error message should be suppressed in development
 */
export const shouldSuppressDevError = (message: string): boolean => {
  if (import.meta.env.PROD) {
    return false; // Don't suppress anything in production
  }
  
  return DEV_ERROR_PATTERNS.some(pattern => pattern.test(message));
};

/**
 * Initialize development error suppression
 */
export const initDevErrorSuppression = () => {
  if (import.meta.env.PROD) {
    return; // Only run in development
  }
  
  // Override window.addEventListener for global error handling
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type: string, listener: any, options?: any) {
    if (type === 'error' || type === 'unhandledrejection') {
      const wrappedListener = (event: any) => {
        const errorMessage = event.error?.message || event.reason?.message || event.message || '';
        
        if (shouldSuppressDevError(errorMessage)) {
          console.debug('Suppressed dev error:', errorMessage);
          return; // Suppress the error
        }
        
        return listener(event);
      };
      
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  console.debug('🔧 Development error suppression initialized');
};