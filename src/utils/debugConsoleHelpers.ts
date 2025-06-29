
/**
 * Debug Console Helpers
 * Provides easy access to debugging tools from the browser console
 */

import { errorSystemDebugger } from './errorSystemDebugger';
import { consoleErrorManager } from './consoleErrorSuppression';
import { networkErrorRecoveryManager } from './networkErrorRecovery';
import { resourceLoadingErrorManager } from './resourceLoadingErrorHandler';
import { errorThrottlingManager } from './errorThrottlingDeduplication';
import { masterErrorResolutionSystem } from './masterErrorResolutionSystem';

// Make debugging tools available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).debugTools = {
    // Error System Debugger
    startErrorDebugging: () => errorSystemDebugger.startDebugging(),
    stopErrorDebugging: () => errorSystemDebugger.stopDebugging(),
    getErrorStats: () => errorSystemDebugger.getStats(),
    
    // Console Error Manager
    getConsoleErrors: () => consoleErrorManager.getErrorLog(),
    clearConsoleErrors: () => consoleErrorManager.clearLog(),
    getConsoleStats: () => consoleErrorManager.getStats(),
    
    // Network Error Recovery
    getNetworkStatus: () => networkErrorRecoveryManager.getNetworkStatus(),
    getFailedRequests: () => networkErrorRecoveryManager.getFailedRequests(),
    clearNetworkErrors: () => networkErrorRecoveryManager.clearFailedRequests(),
    
    // Resource Loading Errors
    getResourceErrors: () => resourceLoadingErrorManager.getFailedResources(),
    clearResourceErrors: () => resourceLoadingErrorManager.clearFailedResources(),
    getResourceStats: () => resourceLoadingErrorManager.getStats(),
    
    // Error Throttling
    getThrottlingStats: () => errorThrottlingManager.getErrorStats(),
    clearThrottledErrors: () => errorThrottlingManager.clearAllErrors(),
    
    // Master Error System
    getMasterStats: () => masterErrorResolutionSystem.getErrorStats(),
    shutdownErrorSystems: () => masterErrorResolutionSystem.shutdown(),
    
    // New Diagnostic Tools
    getDiagnostics: () => (window as any).errorDiagnostics?.getStats(),
    resetDiagnostics: () => (window as any).errorDiagnostics?.reset(),
    emergencyShutdown: () => (window as any).emergencyShutdown?.shutdown(),
    restartErrorSystems: () => (window as any).emergencyShutdown?.restart(),
    
    // Quick Actions
    clearAllErrors: () => {
      consoleErrorManager.clearLog();
      networkErrorRecoveryManager.clearFailedRequests();
      resourceLoadingErrorManager.clearFailedResources();
      errorThrottlingManager.clearAllErrors();
      (window as any).errorDiagnostics?.reset();
      console.log('✅ All error logs cleared');
    },
    
    getSystemOverview: () => {
      return {
        console: consoleErrorManager.getStats(),
        network: networkErrorRecoveryManager.getNetworkStatus(),
        resource: resourceLoadingErrorManager.getStats(),
        throttling: errorThrottlingManager.getErrorStats(),
        master: masterErrorResolutionSystem.getErrorStats(),
        diagnostics: (window as any).errorDiagnostics?.getStats(),
        debugger: {
          health: errorSystemDebugger.getCurrentHealth(),
          statsCount: errorSystemDebugger.getStats().length
        }
      };
    }
  };
  
  console.log('🛠️ Enhanced debug tools available in console as window.debugTools');
  console.log('📚 Available commands:');
  console.log('  - debugTools.getSystemOverview() - Get complete error system overview');
  console.log('  - debugTools.getDiagnostics() - Get real-time error diagnostics');
  console.log('  - debugTools.clearAllErrors() - Clear all error logs');
  console.log('  - debugTools.emergencyShutdown() - Emergency shutdown of all error systems');
  console.log('  - debugTools.restartErrorSystems() - Restart all error systems');
  console.log('  - debugTools.startErrorDebugging() - Start real-time error monitoring');
  console.log('  - debugTools.stopErrorDebugging() - Stop error monitoring');
}
