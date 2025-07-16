
/**
 * Safe analytics utilities with error handling
 */

// Marketing analytics events for tracking user engagement and conversion
export function safeSendAnalyticsEvent(eventName: string, eventParams?: Record<string, any>) {
  try {
    // In a real implementation, you would integrate with analytics providers like:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - PostHog
    // Analytics logging removed to reduce console noise
    
    // Example integration patterns:
    // gtag('event', eventName, eventParams);
    // mixpanel.track(eventName, eventParams);
    // amplitude.track(eventName, eventParams);
  } catch (error) {
    // Analytics warning removed to reduce console noise
  }
}

export function safeSetAnalyticsUserId(userId: string) {
  try {
    // Development logging only
    if (import.meta.env.DEV) {
      // Analytics user ID logging removed to reduce console noise
    }
    // gtag('config', 'GA_MEASUREMENT_ID', { user_id: userId });
    // mixpanel.identify(userId);
  } catch (error) {
    // Analytics warning removed to reduce console noise
  }
}

export function safeTrackPageView(pagePath: string, pageTitle?: string) {
  try {
    // Analytics page view logging removed to reduce console noise
    // gtag('config', 'GA_MEASUREMENT_ID', { page_path: pagePath, page_title: pageTitle });
  } catch (error) {
    // Analytics warning removed to reduce console noise
  }
}

export function enableAnalyticsDebugMode() {
  try {
    // Analytics debug mode logging removed to reduce console noise
    // window.gtag('config', 'GA_MEASUREMENT_ID', { debug_mode: true });
  } catch (error) {
    // Analytics warning removed to reduce console noise
  }
}

export function safeTrackError(error: Error, context?: string) {
  try {
    // Analytics error logging removed to reduce console noise
    // gtag('event', 'exception', { description: error.message, fatal: false });
  } catch (trackingError) {
    // Analytics warning removed to reduce console noise
  }
}

// Marketing-specific tracking functions
export function trackMarketingConversion(conversionType: string, value?: number) {
  safeSendAnalyticsEvent('marketing_conversion', {
    conversion_type: conversionType,
    value: value,
    timestamp: Date.now()
  });
}

export function trackUserEngagement(engagementType: string, duration?: number) {
  safeSendAnalyticsEvent('user_engagement', {
    engagement_type: engagementType,
    duration: duration,
    timestamp: Date.now()
  });
}

export function trackFeatureUsage(featureName: string, context?: string) {
  safeSendAnalyticsEvent('feature_usage', {
    feature_name: featureName,
    context: context,
    timestamp: Date.now()
  });
}
