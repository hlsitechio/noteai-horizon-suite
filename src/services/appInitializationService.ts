
import { AnalyticsService } from './analyticsService';
import { PerformanceService } from './performanceService';
import { initSentry } from '../config/sentry';
import { launchDarklyService } from './launchDarklyService';
import * as Sentry from "@sentry/react";

export class AppInitializationService {
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Online Note AI application...');
      
      // Initialize Sentry first for error tracking
      initSentry();
      console.log('✅ Sentry initialized');

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
      Sentry.captureException(error);
    }
  }

  private static async initializeLaunchDarkly() {
    try {
      // Note: Replace 'your-client-id-here' with actual LaunchDarkly client ID
      // This is just a placeholder - actual initialization should be done when user context is available
      console.log('🏁 LaunchDarkly service ready for initialization');
      
      // For testing purposes, you can uncomment the line below:
      // await launchDarklyService.initialize('your-client-id', { kind: "user", key: "test-user" });
    } catch (error) {
      console.warn('LaunchDarkly initialization skipped:', error);
      // Don't throw here as this is optional and shouldn't break app initialization
    }
  }

  private static setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      Sentry.captureException(event.reason);
      AnalyticsService.trackError(new Error(String(event.reason)), 'unhandled_promise');
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
      Sentry.captureException(event.error);
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
