
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class AnalyticsService {
  private static GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 Measurement ID
  private static isInitialized = false;

  static initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Initialize Google Analytics
    this.loadGoogleAnalytics();
    this.isInitialized = true;
  }

  private static loadGoogleAnalytics() {
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
  }

  static trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: parameters?.label || '',
      value: parameters?.value || 0,
      ...parameters,
    });
  }

  static trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    window.gtag('config', this.GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }

  static trackUserAction(action: string, category: string = 'user_interaction') {
    this.trackEvent('user_action', {
      event_category: category,
      event_label: action,
    });
  }

  static trackError(error: Error, context?: string) {
    this.trackEvent('exception', {
      description: error.message,
      fatal: false,
      context: context || 'unknown',
    });
  }

  static setUserId(userId: string) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    window.gtag('config', this.GA_MEASUREMENT_ID, {
      user_id: userId,
    });
  }
}
