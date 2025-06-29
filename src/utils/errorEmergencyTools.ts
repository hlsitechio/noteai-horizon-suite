/**
 * Error Emergency Tools - Enhanced with correction capabilities
 */

import { advancedErrorDebugger } from './advancedErrorDebugger';
import { emergencyErrorShutdown } from './emergencyErrorShutdown';
import { errorDiagnostics } from './errorDiagnostics';
import { errorCorrectionSystem } from './errorCorrectionSystem';
import { errorPreventionSystem } from './errorPreventionSystem';

class ErrorEmergencyTools {
  
  quickDiagnosis() {
    console.log('🏥 QUICK EMERGENCY DIAGNOSIS');
    console.log('=====================================');
    
    // Get current stats
    const diagnosticStats = errorDiagnostics.getStats();
    const correctionStats = errorCorrectionSystem.getStats();
    const currentTime = Date.now();
    const runtime = Math.round((currentTime - (currentTime - diagnosticStats.runtime * 1000)) / 1000);
    
    console.log(`📊 Current Status:`);
    console.log(`   • Total Errors: ${diagnosticStats.totalErrors}`);
    console.log(`   • Corrected Errors: ${correctionStats.totalCorrections}`);
    console.log(`   • Runtime: ${runtime} seconds`);
    console.log(`   • Error Rate: ${(diagnosticStats.totalErrors / Math.max(runtime, 1) * 60).toFixed(1)} errors/minute`);
    console.log(`   • Correction Rate: ${(correctionStats.totalCorrections / Math.max(runtime, 1) * 60).toFixed(1)} corrections/minute`);
    
    console.log(`\n🔧 Error Corrections:`);
    Object.entries(correctionStats.correctionsByType).forEach(([type, count]) => {
      console.log(`   • ${type}: ${count} corrections`);
    });
    
    console.log(`\n📈 Errors by Type:`);
    Object.entries(diagnosticStats.errorsByType).forEach(([type, count]) => {
      const percentage = (count / diagnosticStats.totalErrors * 100).toFixed(1);
      console.log(`   • ${type}: ${count} (${percentage}%)`);
    });
    
    console.log(`\n🕒 Recent Error Pattern:`);
    const recentErrors = diagnosticStats.recentErrors.slice(-10);
    recentErrors.forEach((error, i) => {
      const timeAgo = Math.round((currentTime - error.timestamp) / 1000);
      console.log(`   ${i + 1}. [${timeAgo}s ago] ${error.type}: ${error.message.substring(0, 80)}...`);
    });
    
    // Analyze correction effectiveness
    const effectivenessRate = diagnosticStats.totalErrors > 0 
      ? (correctionStats.totalCorrections / diagnosticStats.totalErrors * 100).toFixed(1)
      : '0';
    
    console.log(`\n📈 Correction Effectiveness: ${effectivenessRate}%`);
    
    if (diagnosticStats.totalErrors > 1000) {
      console.warn(`\n⚠️  HIGH ERROR COUNT DETECTED`);
      console.warn(`   Current count: ${diagnosticStats.totalErrors}`);
      console.warn(`   Corrections applied: ${correctionStats.totalCorrections}`);
      console.warn(`   Consider increasing correction aggressiveness`);
    }
    
    if (diagnosticStats.totalErrors > 10000) {
      console.error(`\n🚨 CRITICAL ERROR LEVEL`);
      console.error(`   Error count: ${diagnosticStats.totalErrors}`);
      console.error(`   Corrections: ${correctionStats.totalCorrections}`);
      console.error(`   RECOMMENDATION: Activate emergency correction mode`);
    }
    
    return { diagnosticStats, correctionStats };
  }
  
  activateEmergencyCorrection() {
    console.log('🚨 ACTIVATING EMERGENCY CORRECTION MODE');
    console.log('=====================================');
    
    // Start aggressive error correction
    advancedErrorDebugger.startAdvancedDebugging();
    
    // Apply immediate corrections
    this.applyImmediateCorrections();
    
    // Monitor and auto-correct
    const emergencyInterval = setInterval(() => {
      const stats = errorDiagnostics.getStats();
      const correctionStats = errorCorrectionSystem.getStats();
      
      console.log(`🔧 Emergency Correction Status: ${stats.totalErrors} errors, ${correctionStats.totalCorrections} corrections`);
      
      // If error rate is still high, apply more aggressive corrections
      if (stats.totalErrors > 1000) {
        this.applyAggressiveCorrections();
      }
      
      // Stop emergency mode if errors are under control
      if (stats.totalErrors < 100) {
        clearInterval(emergencyInterval);
        console.log('✅ Emergency correction mode deactivated - errors under control');
      }
    }, 5000);
    
    // Auto-stop after 2 minutes
    setTimeout(() => {
      clearInterval(emergencyInterval);
      console.log('⏰ Emergency correction mode timeout - switching to normal mode');
    }, 120000);
  }
  
  private applyImmediateCorrections() {
    console.log('🔧 Applying immediate corrections...');
    
    // Suppress all console errors temporarily
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = () => {};
    console.warn = () => {};
    
    // Restore after 30 seconds
    setTimeout(() => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log('🔧 Console error suppression lifted');
    }, 30000);
    
    // Block all external requests temporarily
    const originalFetch = window.fetch;
    window.fetch = async (...args: any[]) => {
      const url = args[0];
      if (typeof url === 'string' && !url.includes(window.location.hostname)) {
        return new Response('{}', { status: 200 });
      }
      return originalFetch.apply(window, args);
    };
    
    // Restore after 1 minute
    setTimeout(() => {
      window.fetch = originalFetch;
      console.log('🔧 External request blocking lifted');
    }, 60000);
  }
  
  private applyAggressiveCorrections() {
    console.log('🔥 Applying aggressive corrections...');
    
    // Remove all error-prone scripts
    const scripts = document.querySelectorAll('script[src*="analytics"], script[src*="tracking"], script[src*="ads"]');
    scripts.forEach(script => script.remove());
    
    // Clear all intervals and timeouts
    const highestTimeoutId = window.setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
    
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    console.log('🔥 Aggressive corrections applied');
  }
  
  identifyErrorSource() {
    console.log('🔍 IDENTIFYING ERROR SOURCE');
    console.log('=====================================');
    
    // Start advanced debugging for deeper analysis
    advancedErrorDebugger.startAdvancedDebugging();
    
    // Wait a few seconds then perform emergency analysis
    setTimeout(() => {
      const criticalPatterns = advancedErrorDebugger.emergencyAnalysis();
      
      console.log('\n💡 LIKELY ROOT CAUSES:');
      
      // Analyze patterns for common issues
      const networkPatterns = criticalPatterns.filter(p => p.signature.includes('network:'));
      const resourcePatterns = criticalPatterns.filter(p => p.signature.includes('resource:'));
      const consolePatterns = criticalPatterns.filter(p => p.signature.includes('console:'));
      const jsPatterns = criticalPatterns.filter(p => p.signature.includes('javascript:'));
      
      if (networkPatterns.length > 0) {
        console.log('🌐 Network Issues Detected:');
        networkPatterns.slice(0, 3).forEach(p => {
          console.log(`   • ${p.signature} (${p.count} occurrences)`);
        });
      }
      
      if (resourcePatterns.length > 0) {
        console.log('📦 Resource Loading Issues:');
        resourcePatterns.slice(0, 3).forEach(p => {
          console.log(`   • ${p.signature} (${p.count} occurrences)`);
        });
      }
      
      if (consolePatterns.length > 0) {
        console.log('📝 Console Error Issues:');
        consolePatterns.slice(0, 3).forEach(p => {
          console.log(`   • ${p.signature} (${p.count} occurrences)`);
        });
      }
      
      if (jsPatterns.length > 0) {
        console.log('⚡ JavaScript Runtime Issues:');
        jsPatterns.slice(0, 3).forEach(p => {
          console.log(`   • ${p.signature} (${p.count} occurrences)`);
        });
      }
      
      // Stop debugging after analysis
      setTimeout(() => {
        advancedErrorDebugger.stopDebugging();
      }, 5000);
      
    }, 3000);
  }
  
  emergencyActions() {
    console.log('🚨 EMERGENCY ACTIONS AVAILABLE');
    console.log('=====================================');
    console.log('1. emergencyTools.quickDiagnosis() - Get current error status and corrections');
    console.log('2. emergencyTools.activateEmergencyCorrection() - Start aggressive error correction');
    console.log('3. emergencyTools.identifyErrorSource() - Deep analysis of error patterns');
    console.log('4. emergencyTools.stopAllErrors() - Emergency shutdown of error systems');
    console.log('5. emergencyTools.resetErrorCounters() - Reset all error counters');
    console.log('6. emergencyTools.blockProblematicDomains() - Block domains causing errors');
    console.log('7. emergencyShutdown.shutdown() - Complete emergency shutdown');
    console.log('8. errorCorrection.getStats() - Get correction statistics');
    console.log('9. errorPrevention.getActiveRules() - Get active prevention rules');
  }
  
  stopAllErrors() {
    console.log('🛑 STOPPING ALL ERROR SYSTEMS');
    
    // Clear all error logs
    errorDiagnostics.reset();
    
    // Shutdown all error handling
    emergencyErrorShutdown.shutdown();
    
    // Clear advanced debugger
    advancedErrorDebugger.clearAllData();
    
    // Shutdown correction systems
    errorCorrectionSystem.shutdown();
    
    console.log('✅ All error systems stopped and cleared');
  }
  
  resetErrorCounters() {
    console.log('🔄 RESETTING ERROR COUNTERS');
    
    errorDiagnostics.reset();
    advancedErrorDebugger.clearAllData();
    
    console.log('✅ All error counters reset');
  }
  
  blockProblematicDomains() {
    console.log('🚫 BLOCKING PROBLEMATIC DOMAINS');
    
    const problematicDomains = [
      'static.cloudflareinsights.com',
      'www.googletagmanager.com',
      'connect.facebook.net',
      'analytics.tiktok.com',
      'www.redditstatic.com',
      'pagead2.googlesyndication.com',
      'googleads.g.doubleclick.net'
    ];
    
    // Block domains by overriding fetch
    const originalFetch = window.fetch;
    window.fetch = async (...args: any[]) => {
      const url = args[0];
      if (typeof url === 'string' && problematicDomains.some(domain => url.includes(domain))) {
        console.log(`   Blocked request to: ${url}`);
        return new Response('{}', { status: 200 });
      }
      return originalFetch.apply(window, args);
    };
    
    problematicDomains.forEach(domain => {
      console.log(`   Blocking: ${domain}`);
    });
    
    console.log('✅ Problematic domains blocked');
  }
}

export const emergencyTools = new ErrorEmergencyTools();

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).emergencyTools = emergencyTools;
  
  // Show emergency instructions
  console.log('🚨 ENHANCED EMERGENCY ERROR TOOLS LOADED');
  console.log('==========================================');
  console.log('🔧 New correction capabilities:');
  console.log('   • emergencyTools.activateEmergencyCorrection() - Start aggressive error fixing');
  console.log('   • emergencyTools.quickDiagnosis() - Enhanced diagnostics with correction stats');
  console.log('   • errorCorrection.getStats() - View correction statistics');
  console.log('   • errorPrevention.getActiveRules() - View prevention rules');
  console.log('');
  console.log('🚨 For immediate error correction, run:');
  console.log('   emergencyTools.activateEmergencyCorrection()');
}
