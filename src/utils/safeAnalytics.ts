
/**
 * Safe analytics utilities with error handling
 */

export function safeSendAnalyticsEvent(eventName: string, eventParams?: Record<string, any>) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: 'engagement',
        event_label: eventParams?.label || '',
        value: eventParams?.value || 0,
        ...eventParams,
      });
      // Reduced logging to prevent console noise
    }
    // Silent failure when GA not available
  } catch (error) {
    // Silent failure to prevent console noise
  }
}

export function safeSetAnalyticsUserId(userId: string) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
      });
    }
  } catch (error) {
    // Silent failure
  }
}

export function safeTrackPageView(pagePath: string, pageTitle?: string) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
    }
  } catch (error) {
    // Silent failure
  }
}

export function enableAnalyticsDebugMode() {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        debug_mode: true,
      });
    }
  } catch (error) {
    // Silent failure
  }
}

export function safeTrackError(error: Error, context?: string) {
  try {
    safeSendAnalyticsEvent('exception', {
      description: error.message,
      fatal: false,
      context: context || 'unknown',
    });
  } catch (trackingError) {
    console.warn('Failed to track error to analytics:', trackingError);
  }
}
