
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
      console.log('Analytics event sent:', eventName, eventParams);
    } else {
      console.warn('Google Analytics not available');
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
    // Don't throw error, just log it
  }
}

export function safeSetAnalyticsUserId(userId: string) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
      });
      console.log('Analytics user ID set:', userId);
    }
  } catch (error) {
    console.warn('Failed to set analytics user ID:', error);
  }
}

export function safeTrackPageView(pagePath: string, pageTitle?: string) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
      console.log('Page view tracked:', pagePath, pageTitle);
    }
  } catch (error) {
    console.warn('Failed to track page view:', error);
  }
}

export function enableAnalyticsDebugMode() {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        debug_mode: true,
      });
      console.log('Analytics debug mode enabled');
    }
  } catch (error) {
    console.warn('Failed to enable analytics debug mode:', error);
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
