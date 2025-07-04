
import { safeSendAnalyticsEvent, safeSetAnalyticsUserId, safeTrackPageView, safeTrackError, enableAnalyticsDebugMode } from '@/utils/safeAnalytics';
import { logger } from '../utils/logger';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export class AnalyticsService {
  private static GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 Measurement ID
  private static isInitialized = false;

  static initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // Skip GA loading in development or with placeholder ID
      if (import.meta.env.DEV || this.GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        logger.info('Analytics service initialized (GA disabled - placeholder ID)');
      } else {
        this.loadGoogleAnalytics();
      }
      this.isInitialized = true;
    } catch (error) {
      logger.error('Failed to initialize analytics:', error);
    }
  }

  private static loadGoogleAnalytics() {
    try {
      // Create gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
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
      });

      // Enable debug mode in development
      if (import.meta.env.DEV) {
        enableAnalyticsDebugMode();
      }
    } catch (error) {
      logger.error('Failed to load Google Analytics:', error);
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

  static setUserId(userId: string) {
    if (!this.isInitialized) return;
    safeSetAnalyticsUserId(userId);
  }
}
