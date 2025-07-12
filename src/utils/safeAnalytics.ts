
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
    console.log('Analytics Event:', eventName, eventParams);
    
    // Example integration patterns:
    // gtag('event', eventName, eventParams);
    // mixpanel.track(eventName, eventParams);
    // amplitude.track(eventName, eventParams);
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
}

export function safeSetAnalyticsUserId(userId: string) {
  try {
    // Development logging only
    if (import.meta.env.DEV) {
      console.log('Analytics User ID set');
    }
    // gtag('config', 'GA_MEASUREMENT_ID', { user_id: userId });
    // mixpanel.identify(userId);
  } catch (error) {
    console.warn('Analytics user ID setting failed:', error);
  }
}

export function safeTrackPageView(pagePath: string, pageTitle?: string) {
  try {
    console.log('Analytics Page View:', pagePath, pageTitle);
    // gtag('config', 'GA_MEASUREMENT_ID', { page_path: pagePath, page_title: pageTitle });
  } catch (error) {
    console.warn('Analytics page view tracking failed:', error);
  }
}

export function enableAnalyticsDebugMode() {
  try {
    console.log('Analytics Debug Mode enabled');
    // window.gtag('config', 'GA_MEASUREMENT_ID', { debug_mode: true });
  } catch (error) {
    console.warn('Analytics debug mode failed:', error);
  }
}

export function safeTrackError(error: Error, context?: string) {
  try {
    console.log('Analytics Error tracked:', error.message, context);
    // gtag('event', 'exception', { description: error.message, fatal: false });
  } catch (trackingError) {
    console.warn('Analytics error tracking failed:', trackingError);
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
