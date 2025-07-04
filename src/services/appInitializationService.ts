
import { AnalyticsService } from './analyticsService';
import { PerformanceService } from './performanceService';
import { initSentry } from '../config/sentry';
import * as Sentry from "@sentry/react";

export class AppInitializationService {
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Initializing Online Note AI application...');
      }
      
      // Initialize Sentry first for error tracking
      initSentry();
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Sentry initialized');
      }

      // Initialize performance monitoring
      PerformanceService.initialize();
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Performance monitoring initialized');
      }

      // Initialize analytics
      AnalyticsService.initialize();
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Analytics initialized');
      }

      // Set up global error handlers
      this.setupGlobalErrorHandlers();
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Global error handlers set up');
      }

      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Performance monitoring set up');
      }

      this.isInitialized = true;
      if (process.env.NODE_ENV === 'development') {
        console.log('🎉 Application initialization complete');
      }
      
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
