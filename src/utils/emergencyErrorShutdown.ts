
/**
 * Emergency Error Shutdown - Stops all error handling systems
 */

class EmergencyErrorShutdown {
  private isShutdown = false;

  public shutdown() {
    if (this.isShutdown) return;

    console.warn('🛑 EMERGENCY SHUTDOWN: Disabling all error handling systems');
    
    try {
      // Stop all error managers
      const { consoleErrorManager } = require('./consoleErrorSuppression');
      const { networkErrorRecoveryManager } = require('./networkErrorRecovery');
      const { resourceLoadingErrorManager } = require('./resourceLoadingErrorHandler');
      const { errorThrottlingManager } = require('./errorThrottlingDeduplication');
      const { errorSystemDebugger } = require('./errorSystemDebugger');

      // Clear all error logs
      consoleErrorManager.clearLog();
      networkErrorRecoveryManager.clearFailedRequests();
      resourceLoadingErrorManager.clearFailedResources();
      errorThrottlingManager.clearAllErrors();
      errorSystemDebugger.stopDebugging();

      // Restore original console methods
      consoleErrorManager.restore();

      console.log('✅ All error handling systems have been shut down');
      this.isShutdown = true;

    } catch (error) {
      console.error('Failed to shutdown error systems:', error);
    }
  }

  public restart() {
    if (!this.isShutdown) return;

    console.log('🔄 Restarting error handling systems');
    // Force reload to restart all systems
    window.location.reload();
  }

  public getStatus() {
    return { isShutdown: this.isShutdown };
  }
}

export const emergencyErrorShutdown = new EmergencyErrorShutdown();

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).emergencyShutdown = emergencyErrorShutdown;
}
