
/**
 * Safe Analytics Utilities
 * Provides fallback methods for analytics operations
 */

export const safeSendAnalyticsEvent = (eventName: string, parameters?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  } catch (error) {
    console.warn('Analytics event failed:', error);
  }
};

export const safeSetAnalyticsUserId = (userId: string) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId
      });
    }
  } catch (error) {
    console.warn('Analytics user ID failed:', error);
  }
};

export const safeTrackPageView = (pagePath: string, pageTitle?: string) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
    }
  } catch (error) {
    console.warn('Analytics page view failed:', error);
  }
};

export const safeTrackError = (error: Error, context?: string) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_map: {
          context: context || 'unknown'
        }
      });
    }
    console.error(`Error in ${context}:`, error);
  } catch (analyticsError) {
    console.warn('Analytics error tracking failed:', analyticsError);
    console.error(`Original error in ${context}:`, error);
  }
};

export const enableAnalyticsDebugMode = () => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        debug_mode: true
      });
    }
  } catch (error) {
    console.warn('Analytics debug mode failed:', error);
  }
};
