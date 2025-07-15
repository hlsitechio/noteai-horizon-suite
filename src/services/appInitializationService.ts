
import { ConsolidatedAnalyticsService } from './consolidatedAnalyticsService';
import { OptimizedPerformanceService } from './optimizedPerformanceService';
import { OptimizedCleanupService } from './optimizedCleanupService';
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

      // Set up minimal global error handlers
      this.setupGlobalErrorHandlers();

      this.isInitialized = true;
      logger.debug('✅ App initialized successfully with optimized services');

    } catch (error) {
      logger.error('❌ Failed to initialize application:', error);
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
      
      // Sentry removed
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      // Filter out Firebase and COOP errors
      if (event.error?.message?.includes('permission-denied') || 
          event.error?.message?.includes('Cross-Origin-Opener-Policy')) {
        console.warn('Filtered error ignored:', event.error);
        return;
      }
      
      // Sentry removed
    });
  }

  static cleanup() {
    OptimizedPerformanceService.cleanup();
    OptimizedCleanupService.cleanup();
    ConsolidatedAnalyticsService.cleanup();
    this.isInitialized = false;
  }
}
