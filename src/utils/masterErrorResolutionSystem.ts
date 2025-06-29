
/**
 * Master Error Resolution System
 * Coordinates all error handling subsystems with centralized configuration
 */

import { consoleErrorManager } from './consoleErrorSuppression';
import { reactDevToolsErrorManager } from './reactDevToolsErrorSuppression';
import { browserCompatibilityManager } from './browserCompatibilityHandler';
import { networkErrorRecoveryManager } from './networkErrorRecovery';
import { resourceLoadingErrorManager } from './resourceLoadingErrorHandler';
import { errorThrottlingManager } from './errorThrottlingDeduplication';
import { chromeExtensionConflictManager } from './chromeExtensionConflictHandler';

interface MasterErrorConfig {
  developmentMode?: boolean;
  enableConsoleErrorSuppression?: boolean;
  enableReactDevToolsSuppression?: boolean;
  enableBrowserCompatibility?: boolean;
  enableNetworkRecovery?: boolean;
  enableResourceErrorHandling?: boolean;
  enableErrorThrottling?: boolean;
  enableExtensionConflictHandling?: boolean;
  errorReportingEndpoint?: string;
  maxErrorsPerMinute?: number;
  enableDetailedLogging?: boolean;
}

class MasterErrorResolutionSystem {
  private initialized = false;
  private config: MasterErrorConfig = {};
  private errorStats = {
    totalSuppressed: 0,
    totalProcessed: 0,
    systemErrors: 0,
    lastReset: new Date()
  };

  initialize(config: MasterErrorConfig = {}) {
    // Prevent duplicate initialization
    if (this.initialized) {
      if (config.enableDetailedLogging) {
        console.log('Master Error Resolution System: Already initialized, skipping...');
      }
      return;
    }

    this.config = {
      developmentMode: false,
      enableConsoleErrorSuppression: true,
      enableReactDevToolsSuppression: true,
      enableBrowserCompatibility: true,
      enableNetworkRecovery: true,
      enableResourceErrorHandling: true,
      enableErrorThrottling: true,
      enableExtensionConflictHandling: true,
      maxErrorsPerMinute: 100,
      enableDetailedLogging: false,
      ...config
    };

    try {
      this.initializeSubsystems();
      this.setupGlobalErrorHandling();
      this.setupPerformanceMonitoring();
      this.initialized = true;
      
      console.log('✅ Master Error Resolution System initialized successfully');
      
      if (this.config.developmentMode) {
        this.logSystemStatus();
      }
    } catch (error) {
      console.error('❌ Failed to initialize Master Error Resolution System:', error);
      this.errorStats.systemErrors++;
    }
  }

  private initializeSubsystems() {
    const { config } = this;
    
    // Initialize each subsystem based on configuration
    if (config.enableConsoleErrorSuppression) {
      // Console error manager is already initialized globally
      if (config.enableDetailedLogging) {
        console.log('✓ Console Error Suppression: Active');
      }
    }

    if (config.enableReactDevToolsSuppression) {
      // React DevTools error manager is already initialized globally
      if (config.enableDetailedLogging) {
        console.log('✓ React DevTools Error Suppression: Active');
      }
    }

    if (config.enableBrowserCompatibility) {
      // Browser compatibility manager is already initialized globally
      if (config.enableDetailedLogging) {
        console.log('✓ Browser Compatibility Handler: Active');
      }
    }

    if (config.enableNetworkRecovery) {
      // Network error recovery manager is already initialized globally
      if (config.enableDetailedLogging) {
        console.log('✓ Network Error Recovery: Active');
      }
    }

    if (config.enableResourceErrorHandling) {
      // Resource loading error manager is already initialized globally
      if (config.enableDetailedLogging) {
        console.log('✓ Resource Loading Error Handler: Active');
      }
    }

    if (config.enableErrorThrottling) {
      errorThrottlingManager.setThrottleConfig(60000, config.maxErrorsPerMinute || 100);
      if (config.enableDetailedLogging) {
        console.log('✓ Error Throttling System: Active');
      }
    }

    if (config.enableExtensionConflictHandling) {
      // Chrome extension conflict manager is already initialized globally
      if (config.enableDetailedLogging) {
        console.log('✓ Chrome Extension Conflict Handler: Active');
      }
    }
  }

  private setupGlobalErrorHandling() {
    // Global unhandled error catching
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error, {
        type: 'unhandled_error',
        source: event.filename,
        line: event.lineno,
        column: event.colno
      });
    });

    // Global unhandled promise rejection catching
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(event.reason, {
        type: 'unhandled_rejection',
        promise: true
      });
    });
  }

  private setupPerformanceMonitoring() {
    // Reset error stats periodically
    setInterval(() => {
      this.resetErrorStats();
    }, 60000); // Reset every minute

    // Cleanup old error logs periodically
    setInterval(() => {
      this.performCleanup();
    }, 300000); // Cleanup every 5 minutes
  }

  private handleGlobalError(error: any, context: Record<string, any>) {
    this.errorStats.totalProcessed++;

    // Apply error throttling
    if (this.config.enableErrorThrottling && !errorThrottlingManager.shouldReportError(error)) {
      this.errorStats.totalSuppressed++;
      return;
    }

    // Log error details in development
    if (this.config.developmentMode) {
      console.group('🔍 Master Error Resolution System - Global Error');
      console.error('Error:', error);
      console.log('Context:', context);
      console.log('Stats:', this.getErrorStats());
      console.groupEnd();
    }
  }

  private resetErrorStats() {
    this.errorStats = {
      totalSuppressed: 0,
      totalProcessed: 0,
      systemErrors: 0,
      lastReset: new Date()
    };
  }

  private performCleanup() {
    try {
      // Clear console error logs
      consoleErrorManager.clearLog();
      
      if (this.config.enableDetailedLogging) {
        console.log('🧹 Master Error Resolution System: Cleanup completed');
      }
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  }

  private logSystemStatus() {
    console.group('📊 Master Error Resolution System Status');
    console.log('Configuration:', this.config);
    console.log('Error Stats:', this.errorStats);
    console.log('Browser Info:', browserCompatibilityManager.getBrowserInfo());
    console.log('Console Error Stats:', consoleErrorManager.getStats());
    console.groupEnd();
  }

  public getErrorStats() {
    return {
      ...this.errorStats,
      uptime: Date.now() - this.errorStats.lastReset.getTime(),
      consoleStats: consoleErrorManager.getStats()
    };
  }

  public isInitialized() {
    return this.initialized;
  }

  public getConfiguration() {
    return { ...this.config };
  }

  public addCustomSuppressionPattern(pattern: RegExp) {
    consoleErrorManager.addSuppressionPattern(pattern);
    reactDevToolsErrorManager.addReactSuppressionPattern(pattern);
  }

  public shutdown() {
    if (!this.initialized) return;

    try {
      // Restore original console methods
      consoleErrorManager.restore();
      
      this.initialized = false;
      console.log('🔄 Master Error Resolution System shutdown complete');
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }
}

export const masterErrorResolutionSystem = new MasterErrorResolutionSystem();

// Auto-initialize with safe defaults if not already initialized
if (typeof window !== 'undefined' && !masterErrorResolutionSystem.isInitialized()) {
  masterErrorResolutionSystem.initialize({
    developmentMode: import.meta.env?.DEV || false,
    enableDetailedLogging: import.meta.env?.DEV || false
  });
}
