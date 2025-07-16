
/**
 * Enhanced safe analytics utilities with comprehensive error handling
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function safeSendAnalyticsEvent(eventName: string, eventParams?: Record<string, any>) {
  // Enhanced Analytics completely paused - no events sent
  return;
}

export function safeSetAnalyticsUserId(userId: string) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
      });
      // Development logging only
      if (import.meta.env.DEV) {
        // Analytics user ID logging removed to reduce console noise
      }
    }
  } catch (error) {
    // Analytics user ID failure logging removed to reduce console noise
  }
}

export function safeTrackPageView(pagePath: string, pageTitle?: string) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
      // Page view tracking logging removed to reduce console noise
    }
  } catch (error) {
    // Page view tracking failure logging removed to reduce console noise
  }
}

export function enableAnalyticsDebugMode() {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        debug_mode: true,
      });
      // Analytics debug mode logging removed to reduce console noise
    }
  } catch (error) {
    // Debug mode failure logging removed to reduce console noise
  }
}

export function safeTrackError(error: Error, context?: string) {
  try {
    safeSendAnalyticsEvent('exception', {
      description: error.message,
      fatal: false,
      context: context || 'unknown',
      stack: error.stack,
    });
  } catch (trackingError) {
    // Error tracking failure logging removed to reduce console noise
  }
}

export function safeTrackTiming(category: string, variable: string, value: number, label?: string) {
  try {
    safeSendAnalyticsEvent('timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label,
    });
  } catch (error) {
    // Timing tracking failure logging removed to reduce console noise
  }
}

export function safeTrackCustomMetric(metricName: string, value: number, dimensions?: Record<string, string>) {
  try {
    safeSendAnalyticsEvent('custom_metric', {
      metric_name: metricName,
      metric_value: value,
      ...dimensions,
    });
  } catch (error) {
    // Custom metric tracking failure logging removed to reduce console noise
  }
}
