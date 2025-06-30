
import { AnalyticsService } from './analyticsService';
import { PerformanceService } from './performanceService';
import { initSentry } from '../config/sentry';
import { launchDarklyService } from './launchDarklyService';

export class AppInitializationService {
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Online Note AI application...');
      
      // Initialize Sentry (will use Lovable internal tracking in development)
      initSentry();
      console.log('✅ Error tracking initialized');

      // Initialize performance monitoring
      PerformanceService.initialize();
      console.log('✅ Performance monitoring initialized');

      // Initialize analytics
      AnalyticsService.initialize();
      console.log('✅ Analytics initialized');

      // Set up global error handlers
      this.setupGlobalErrorHandlers();
      console.log('✅ Global error handlers set up');

      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      console.log('✅ Performance monitoring set up');

      // Initialize LaunchDarkly (optional - can be done later with specific user context)
      await this.initializeLaunchDarkly();
      console.log('✅ LaunchDarkly setup completed');

      this.isInitialized = true;
      console.log('🎉 Application initialization complete');
      
      // Track initialization
      AnalyticsService.trackEvent('app_initialized', {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });

    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      // Use console.error instead of Sentry in development
      if (import.meta.env.PROD) {
        // Only use Sentry in production if available
        try {
          const Sentry = await import('@sentry/react');
          Sentry.captureException(error);
        } catch (sentryError) {
          console.error('Sentry not available:', sentryError);
        }
      }
    }
  }

  private static async initializeLaunchDarkly() {
    try {
      console.log('🏁 LaunchDarkly service ready for initialization');
    } catch (error) {
      console.warn('LaunchDarkly initialization skipped:', error);
    }
  }

  private static setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      if (import.meta.env.PROD) {
        try {
          const Sentry = require('@sentry/react');
          Sentry.captureException(event.reason);
        } catch (sentryError) {
          // Sentry not available, continue without it
        }
      }
      AnalyticsService.trackError(new Error(String(event.reason)), 'unhandled_promise');
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
      if (import.meta.env.PROD) {
        try {
          const Sentry = require('@sentry/react');
          Sentry.captureException(event.error);
        } catch (sentryError) {
          // Sentry not available, continue without it
        }
      }
      AnalyticsService.trackError(event.error, 'javascript_error');
    });
  }

  private static setupPerformanceMonitoring() {
    // Monitor Core Web Vitals and send to analytics
    setTimeout(() => {
      const metrics = PerformanceService.getMetrics();
      Object.entries(metrics).forEach(([metric, value]) => {
        AnalyticsService.trackEvent('performance_metric', {
          metric_name: metric,
          metric_value: value,
        });
      });
    }, 5000); // Wait 5 seconds to collect metrics
  }

  static cleanup() {
    PerformanceService.cleanup();
    this.isInitialized = false;
  }
}
