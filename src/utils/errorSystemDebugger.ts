/**
 * Error System Debugger
 * Helps identify what's causing the growing error count
 */

interface ErrorSystemStats {
  timestamp: Date;
  consoleErrors: number;
  networkErrors: number;
  resourceErrors: number;
  throttledErrors: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

class ErrorSystemDebugger {
  private stats: ErrorSystemStats[] = [];
  private debugInterval: NodeJS.Timeout | null = null;
  private isDebugging = false;

  startDebugging() {
    if (this.isDebugging) return;
    
    this.isDebugging = true;
    console.log('🔍 Starting Error System Debugging...');
    
    // Capture initial state
    this.captureStats();
    
    // Set up monitoring
    this.debugInterval = setInterval(() => {
      this.captureStats();
      this.analyzeGrowth();
    }, 5000);
  }

  stopDebugging() {
    if (!this.isDebugging) return;
    
    this.isDebugging = false;
    if (this.debugInterval) {
      clearInterval(this.debugInterval);
      this.debugInterval = null;
    }
    
    console.log('🔍 Error System Debugging stopped');
    this.generateReport();
  }

  private captureStats() {
    try {
      // Import managers dynamically to avoid circular dependencies
      const { consoleErrorManager } = require('./consoleErrorSuppression');
      const { networkErrorRecoveryManager } = require('./networkErrorRecovery');
      const { resourceLoadingErrorManager } = require('./resourceLoadingErrorHandler');
      const { errorThrottlingManager } = require('./errorThrottlingDeduplication');

      const consoleStats = consoleErrorManager.getStats();
      const networkStats = networkErrorRecoveryManager.getNetworkStatus();
      const resourceStats = resourceLoadingErrorManager.getStats();
      const throttlingStats = errorThrottlingManager.getErrorStats();

      const currentStats: ErrorSystemStats = {
        timestamp: new Date(),
        consoleErrors: consoleStats.total || 0,
        networkErrors: networkStats.failedRequestsCount || 0,
        resourceErrors: resourceStats.total || 0,
        throttledErrors: throttlingStats.totalOccurrences || 0,
        systemHealth: this.calculateSystemHealth(consoleStats, networkStats, resourceStats, throttlingStats)
      };

      this.stats.push(currentStats);
      
      // Keep only last 20 entries
      if (this.stats.length > 20) {
        this.stats = this.stats.slice(-20);
      }

      console.log('📊 Error System Stats:', {
        console: currentStats.consoleErrors,
        network: currentStats.networkErrors,
        resource: currentStats.resourceErrors,
        throttled: currentStats.throttledErrors,
        health: currentStats.systemHealth
      });

    } catch (error) {
      console.warn('Failed to capture error stats:', error);
    }
  }

  private calculateSystemHealth(consoleStats: any, networkStats: any, resourceStats: any, throttlingStats: any): 'healthy' | 'warning' | 'critical' {
    const totalErrors = (consoleStats.total || 0) + (networkStats.failedRequestsCount || 0) + (resourceStats.total || 0);
    
    if (totalErrors === 0) return 'healthy';
    if (totalErrors < 10) return 'warning';
    return 'critical';
  }

  private analyzeGrowth() {
    if (this.stats.length < 2) return;

    const current = this.stats[this.stats.length - 1];
    const previous = this.stats[this.stats.length - 2];

    const consoleGrowth = current.consoleErrors - previous.consoleErrors;
    const networkGrowth = current.networkErrors - previous.networkErrors;
    const resourceGrowth = current.resourceErrors - previous.resourceErrors;
    const throttledGrowth = current.throttledErrors - previous.throttledErrors;

    if (consoleGrowth > 0 || networkGrowth > 0 || resourceGrowth > 0 || throttledGrowth > 0) {
      console.warn('⚠️ Error Growth Detected:', {
        console: consoleGrowth > 0 ? `+${consoleGrowth}` : '0',
        network: networkGrowth > 0 ? `+${networkGrowth}` : '0',
        resource: resourceGrowth > 0 ? `+${resourceGrowth}` : '0',
        throttled: throttledGrowth > 0 ? `+${throttledGrowth}` : '0',
        timespan: '5 seconds'
      });

      // Detect rapid growth
      const totalGrowth = consoleGrowth + networkGrowth + resourceGrowth + throttledGrowth;
      if (totalGrowth > 5) {
        console.error('🚨 RAPID ERROR GROWTH DETECTED:', {
          rate: `${totalGrowth} errors in 5 seconds`,
          recommendation: 'Consider disabling error handling systems temporarily'
        });
      }
    }
  }

  private generateReport() {
    if (this.stats.length === 0) return;

    const firstStats = this.stats[0];
    const lastStats = this.stats[this.stats.length - 1];
    const timespan = lastStats.timestamp.getTime() - firstStats.timestamp.getTime();

    console.log('📋 Error System Debugging Report:', {
      duration: `${Math.round(timespan / 1000)} seconds`,
      initialErrors: {
        console: firstStats.consoleErrors,
        network: firstStats.networkErrors,
        resource: firstStats.resourceErrors,
        throttled: firstStats.throttledErrors
      },
      finalErrors: {
        console: lastStats.consoleErrors,
        network: lastStats.networkErrors,
        resource: lastStats.resourceErrors,
        throttled: lastStats.throttledErrors
      },
      growth: {
        console: lastStats.consoleErrors - firstStats.consoleErrors,
        network: lastStats.networkErrors - firstStats.networkErrors,
        resource: lastStats.resourceErrors - firstStats.resourceErrors,
        throttled: lastStats.throttledErrors - firstStats.throttledErrors
      },
      healthTrend: this.stats.map(s => s.systemHealth)
    });
  }

  getStats() {
    return [...this.stats];
  }

  getCurrentHealth() {
    if (this.stats.length === 0) return 'unknown';
    return this.stats[this.stats.length - 1].systemHealth;
  }
}

export const errorSystemDebugger = new ErrorSystemDebugger();

// Auto-start debugging in development
if (import.meta.env.DEV) {
  console.log('🔍 Auto-starting Error System Debugging in development mode');
  errorSystemDebugger.startDebugging();
}
