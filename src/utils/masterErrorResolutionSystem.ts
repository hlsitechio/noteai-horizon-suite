
/**
 * Master Error Resolution System - Optimized
 * Coordinates all error handling subsystems with centralized configuration
 */

import { consoleErrorManager } from './consoleErrorSuppression';
import { errorThrottlingManager } from './errorThrottlingDeduplication';

interface MasterErrorConfig {
  developmentMode?: boolean;
  enableConsoleErrorSuppression?: boolean;
  enableErrorThrottling?: boolean;
  maxErrorsPerMinute?: number;
  enableDetailedLogging?: boolean;
}

class MasterErrorResolutionSystem {
  private initialized = false;
  private config: MasterErrorConfig = {};
  private errorStats = {
    totalSuppressed: 0,
    totalProcessed: 0,
    lastReset: new Date()
  };

  initialize(config: MasterErrorConfig = {}) {
    if (this.initialized) {
      return;
    }

    this.config = {
      developmentMode: false,
      enableConsoleErrorSuppression: true,
      enableErrorThrottling: true,
      maxErrorsPerMinute: 100,
      enableDetailedLogging: false,
      ...config
    };

    try {
      this.initializeSubsystems();
      this.setupGlobalErrorHandling();
      this.initialized = true;
      
      if (this.config.developmentMode) {
        console.log('✅ Master Error Resolution System initialized');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Master Error Resolution System:', error);
    }
  }

  private initializeSubsystems() {
    const { config } = this;
    
    if (config.enableErrorThrottling) {
      errorThrottlingManager.setThrottleConfig(60000, config.maxErrorsPerMinute || 100);
    }
  }

  private setupGlobalErrorHandling() {
    // Reset error stats periodically
    setInterval(() => {
      this.resetErrorStats();
    }, 60000);

    // Cleanup old error logs periodically
    setInterval(() => {
      this.performCleanup();
    }, 300000);
  }

  private resetErrorStats() {
    this.errorStats = {
      totalSuppressed: 0,
      totalProcessed: 0,
      lastReset: new Date()
    };
  }

  private performCleanup() {
    try {
      consoleErrorManager.clearLog();
    } catch (error) {
      // Silent cleanup failure
    }
  }

  public getErrorStats() {
    return {
      ...this.errorStats,
      uptime: Date.now() - this.errorStats.lastReset.getTime()
    };
  }

  public isInitialized() {
    return this.initialized;
  }

  public shutdown() {
    if (!this.initialized) return;

    try {
      consoleErrorManager.restore();
      this.initialized = false;
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }
}

export const masterErrorResolutionSystem = new MasterErrorResolutionSystem();

// Auto-initialize with safe defaults
if (typeof window !== 'undefined' && !masterErrorResolutionSystem.isInitialized()) {
  masterErrorResolutionSystem.initialize({
    developmentMode: import.meta.env?.DEV || false,
    enableDetailedLogging: import.meta.env?.DEV || false
  });
}
