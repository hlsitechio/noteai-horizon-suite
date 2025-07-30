
import { ConsolidatedAnalyticsService } from './consolidatedAnalyticsService';
import { OptimizedPerformanceService } from './optimizedPerformanceService';
import { OptimizedCleanupService } from './optimizedCleanupService';
import { productionMonitoring } from './productionMonitoringService';
import { logger } from '../utils/logger';

export class AppInitializationService {
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize optimized services with minimal performance impact
      OptimizedCleanupService.initialize();
      OptimizedPerformanceService.initialize();
      ConsolidatedAnalyticsService.initialize();

      // Initialize production monitoring in production
      if (import.meta.env.PROD) {
        // Production monitoring disabled to prevent fingerprinting warnings
        logger.debug('Production monitoring disabled');
      }

      // Set up minimal global error handlers
      this.setupGlobalErrorHandlers();

      this.isInitialized = true;
      logger.debug('✅ App initialized successfully with optimized services');
      
      // Track initialization success
      if (import.meta.env.PROD) {
        productionMonitoring.trackUserAction('app_initialized', performance.now());
      }

    } catch (error) {
      logger.error('❌ Failed to initialize application:', error);
      
      // Track initialization failure
      if (import.meta.env.PROD) {
        // Temporarily disable initialization error tracking to prevent RLS errors
        return;
        productionMonitoring.trackMetric('app_initialization_error', 1, 'counter', {
          error_message: String(error).substring(0, 500)
        });
      }
    }
  }

  private static setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      // Filter out Firebase permission errors to reduce noise
      if (event.reason?.message?.includes('permission-denied')) {
        console.warn('Firebase permission error ignored:', event.reason);
        event.preventDefault();
        return;
      }
      
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      // Filter out Firebase and COOP errors
      if (event.error?.message?.includes('permission-denied') || 
          event.error?.message?.includes('Cross-Origin-Opener-Policy')) {
        console.warn('Filtered error ignored:', event.error);
        return;
      }
      
      
    });
  }

  static cleanup() {
    OptimizedPerformanceService.cleanup();
    OptimizedCleanupService.cleanup();
    ConsolidatedAnalyticsService.cleanup();
    
    // Cleanup production monitoring
    if (import.meta.env.PROD) {
      productionMonitoring.cleanup();
    }
    
    this.isInitialized = false;
  }
}
