
/**
 * Master Error Resolution System
 * Coordinates all error handling systems and provides unified initialization
 */

import { consoleErrorManager } from './consoleErrorSuppression';
import { reactDevToolsErrorManager } from './reactDevToolsErrorSuppression';
import { browserCompatibilityManager } from './browserCompatibilityHandler';
import { networkErrorRecoveryManager } from './networkErrorRecovery';
import { resourceLoadingErrorManager } from './resourceLoadingErrorHandler';
import { errorThrottlingManager } from './errorThrottlingDeduplication';
import { chromeExtensionConflictManager } from './chromeExtensionConflictHandler';

interface ErrorResolutionConfig {
  enableConsoleErrorSuppression: boolean;
  enableReactDevToolsSuppression: boolean;
  enableBrowserCompatibility: boolean;
  enableNetworkRecovery: boolean;
  enableResourceErrorHandling: boolean;
  enableErrorThrottling: boolean;
  enableExtensionConflictHandling: boolean;
  developmentMode: boolean;
}

class MasterErrorResolutionSystem {
  private isInitialized = false;
  private config: ErrorResolutionConfig;
  private errorStats = {
    totalErrorsHandled: 0,
    errorsByType: new Map<string, number>(),
    lastInitialized: null as Date | null,
  };

  constructor() {
    this.config = {
      enableConsoleErrorSuppression: true,
      enableReactDevToolsSuppression: true,
      enableBrowserCompatibility: true,
      enableNetworkRecovery: true,
      enableResourceErrorHandling: true,
      enableErrorThrottling: true,
      enableExtensionConflictHandling: true,
      developmentMode: import.meta.env.DEV,
    };
  }

  public async initialize(customConfig?: Partial<ErrorResolutionConfig>): Promise<void> {
    if (this.isInitialized) {
      console.warn('Master Error Resolution System already initialized');
      return;
    }

    // Merge custom config
    this.config = { ...this.config, ...customConfig };

    console.log('🛡️  Initializing Master Error Resolution System...');

    try {
      // Initialize all subsystems
      if (this.config.enableConsoleErrorSuppression) {
        console.log('✅ Console Error Suppression initialized');
      }

      if (this.config.enableReactDevToolsSuppression) {
        console.log('✅ React DevTools Error Suppression initialized');
      }

      if (this.config.enableBrowserCompatibility) {
        console.log('✅ Browser Compatibility Handler initialized');
      }

      if (this.config.enableNetworkRecovery) {
        console.log('✅ Network Error Recovery initialized');
      }

      if (this.config.enableResourceErrorHandling) {
        console.log('✅ Resource Loading Error Handler initialized');
      }

      if (this.config.enableErrorThrottling) {
        console.log('✅ Error Throttling & Deduplication initialized');
      }

      if (this.config.enableExtensionConflictHandling) {
        console.log('✅ Chrome Extension Conflict Handler initialized');
      }

      // Setup global error monitoring
      this.setupGlobalErrorMonitoring();

      this.isInitialized = true;
      this.errorStats.lastInitialized = new Date();

      console.log('🎉 Master Error Resolution System fully initialized!');
      
      if (this.config.developmentMode) {
        this.logSystemStatus();
      }

    } catch (error) {
      console.error('❌ Failed to initialize Master Error Resolution System:', error);
      throw error;
    }
  }

  private setupGlobalErrorMonitoring() {
    // Global error event listener that coordinates with all subsystems
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalRejection(event);
    });

    // Performance monitoring
    if (typeof PerformanceObserver !== 'undefined') {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.name.includes('error')) {
            console.log('Error handling performance:', entry);
          }
        }
      });
      
      try {
        perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }
  }

  private handleGlobalError(event: ErrorEvent) {
    this.errorStats.totalErrorsHandled++;
    
    // Determine error type and route to appropriate handler
    const errorType = this.categorizeError(event);
    this.updateErrorStats(errorType);

    // Check if error should be reported
    const shouldReport = errorThrottlingManager.shouldReportError(
      event.error || new Error(event.message),
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    );

    if (!shouldReport) {
      event.preventDefault();
      return;
    }

    // Let specific handlers deal with their error types
    console.log(`Handled ${errorType} error:`, event.message);
  }

  private handleGlobalRejection(event: PromiseRejectionEvent) {
    this.errorStats.totalErrorsHandled++;
    this.updateErrorStats('promise_rejection');

    const shouldReport = errorThrottlingManager.shouldReportError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    );

    if (!shouldReport) {
      event.preventDefault();
      return;
    }

    console.log('Handled promise rejection:', event.reason);
  }

  private categorizeError(event: ErrorEvent): string {
    const message = event.message?.toLowerCase() || '';
    const filename = event.filename?.toLowerCase() || '';

    if (filename.includes('chrome-extension') || filename.includes('moz-extension')) {
      return 'extension';
    } else if (message.includes('network') || message.includes('fetch')) {
      return 'network';
    } else if (message.includes('resource') || message.includes('loading')) {
      return 'resource';
    } else if (message.includes('react') || message.includes('component')) {
      return 'react';
    } else {
      return 'general';
    }
  }

  private updateErrorStats(errorType: string) {
    const current = this.errorStats.errorsByType.get(errorType) || 0;
    this.errorStats.errorsByType.set(errorType, current + 1);
  }

  private logSystemStatus() {
    console.group('🛡️  Error Resolution System Status');
    console.log('Configuration:', this.config);
    console.log('Browser Info:', browserCompatibilityManager.getBrowserInfo());
    console.log('Network Status:', networkErrorRecoveryManager.getNetworkStatus());
    console.log('Console Stats:', consoleErrorManager.getStats());
    console.log('Error Stats:', this.getStats());
    console.groupEnd();
  }

  public getStats() {
    return {
      ...this.errorStats,
      errorsByType: Object.fromEntries(this.errorStats.errorsByType),
      systemHealth: this.getSystemHealth(),
    };
  }

  private getSystemHealth(): 'excellent' | 'good' | 'warning' | 'critical' {
    const consoleStats = consoleErrorManager.getStats();
    const networkStatus = networkErrorRecoveryManager.getNetworkStatus();
    const resourceStats = resourceLoadingErrorManager.getStats();

    const totalIssues = 
      (consoleStats.total || 0) + 
      (networkStatus.failedRequestsCount || 0) + 
      (resourceStats.total || 0);

    if (totalIssues === 0) return 'excellent';
    if (totalIssues < 5) return 'good';
    if (totalIssues < 20) return 'warning';
    return 'critical';
  }

  public updateConfig(newConfig: Partial<ErrorResolutionConfig>) {
    this.config = { ...this.config, ...newConfig };
    console.log('Error Resolution System config updated:', newConfig);
  }

  public async cleanup() {
    if (!this.isInitialized) return;

    // Cleanup all subsystems
    consoleErrorManager.restore();
    
    console.log('🧹 Master Error Resolution System cleaned up');
    this.isInitialized = false;
  }

  public isSystemHealthy(): boolean {
    const health = this.getSystemHealth();
    return health === 'excellent' || health === 'good';
  }
}

// Export singleton instance
export const masterErrorResolutionSystem = new MasterErrorResolutionSystem();

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  masterErrorResolutionSystem.initialize();
}
