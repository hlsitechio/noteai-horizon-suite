
import { 
  safeSendAnalyticsEvent, 
  safeSetAnalyticsUserId, 
  safeTrackPageView, 
  safeTrackError, 
  enableAnalyticsDebugMode,
  safeTrackTiming,
  safeTrackCustomMetric
} from '@/utils/enhancedSafeAnalytics';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export class EnhancedAnalyticsService {
  private static GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 Measurement ID
  private static isInitialized = false;

  static initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // Initialize Google Analytics
      this.loadGoogleAnalytics();
      this.isInitialized = true;
      console.log('Enhanced Analytics service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize enhanced analytics:', error);
    }
  }

  private static loadGoogleAnalytics() {
    try {
      // Create gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
      script.onerror = () => console.warn('Failed to load Google Analytics script');
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', this.GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: false, // We'll handle this manually
      });

      // Enable debug mode in development
      if (import.meta.env.DEV) {
        enableAnalyticsDebugMode();
      }
    } catch (error) {
      console.error('Failed to load Google Analytics:', error);
    }
  }

  static trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.isInitialized) return;
    safeSendAnalyticsEvent(eventName, parameters);
  }

  static trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.isInitialized) return;
    safeTrackPageView(pagePath, pageTitle);
  }

  static trackUserAction(action: string, category: string = 'user_interaction') {
    this.trackEvent('user_action', {
      event_category: category,
      event_label: action,
    });
  }

  static trackError(error: Error, context?: string) {
    safeTrackError(error, context);
  }

  static trackTiming(category: string, variable: string, value: number, label?: string) {
    safeTrackTiming(category, variable, value, label);
  }

  static trackCustomMetric(metricName: string, value: number, dimensions?: Record<string, string>) {
    safeTrackCustomMetric(metricName, value, dimensions);
  }

  static setUserId(userId: string) {
    if (!this.isInitialized) return;
    safeSetAnalyticsUserId(userId);
  }

  static trackPerformance(metricName: string, value: number) {
    this.trackCustomMetric('performance', value, { metric: metricName });
  }

  static trackEngagement(action: string, value?: number) {
    this.trackEvent('engagement', {
      action,
      value: value || 1,
    });
  }
}
