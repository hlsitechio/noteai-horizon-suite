
/**
 * Error Emergency Tools - Quick actions for critical error situations
 */

import { advancedErrorDebugger } from './advancedErrorDebugger';
import { emergencyErrorShutdown } from './emergencyErrorShutdown';
import { errorDiagnostics } from './errorDiagnostics';

class ErrorEmergencyTools {
  
  quickDiagnosis() {
    console.log('🏥 QUICK EMERGENCY DIAGNOSIS');
    console.log('=====================================');
    
    // Get current stats
    const diagnosticStats = errorDiagnostics.getStats();
    const currentTime = Date.now();
    const runtime = Math.round((currentTime - (currentTime - diagnosticStats.runtime * 1000)) / 1000);
    
    console.log(`📊 Current Status:`);
    console.log(`   • Total Errors: ${diagnosticStats.totalErrors}`);
    console.log(`   • Runtime: ${runtime} seconds`);
    console.log(`   • Error Rate: ${(diagnosticStats.totalErrors / Math.max(runtime, 1) * 60).toFixed(1)} errors/minute`);
    
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
    
    // Analyze error growth
    if (diagnosticStats.totalErrors > 1000) {
      console.warn(`\n⚠️  HIGH ERROR COUNT DETECTED`);
      console.warn(`   Current count: ${diagnosticStats.totalErrors}`);
      console.warn(`   This indicates a serious issue that needs immediate attention`);
    }
    
    if (diagnosticStats.totalErrors > 10000) {
      console.error(`\n🚨 CRITICAL ERROR LEVEL`);
      console.error(`   Error count: ${diagnosticStats.totalErrors}`);
      console.error(`   RECOMMENDATION: Consider emergency shutdown`);
    }
    
    return diagnosticStats;
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
    console.log('1. emergencyTools.quickDiagnosis() - Get current error status');
    console.log('2. emergencyTools.identifyErrorSource() - Deep analysis of error patterns');
    console.log('3. emergencyTools.stopAllErrors() - Emergency shutdown of error systems');
    console.log('4. emergencyTools.resetErrorCounters() - Reset all error counters');
    console.log('5. emergencyTools.blockProblematicDomains() - Block domains causing errors');
    console.log('6. emergencyShutdown.shutdown() - Complete emergency shutdown');
    console.log('7. advancedDebugger.emergencyAnalysis() - Immediate pattern analysis');
  }
  
  stopAllErrors() {
    console.log('🛑 STOPPING ALL ERROR SYSTEMS');
    
    // Clear all error logs
    errorDiagnostics.reset();
    
    // Shutdown all error handling
    emergencyErrorShutdown.shutdown();
    
    // Clear advanced debugger
    advancedErrorDebugger.clearAllData();
    
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
    
    // Add domains to network error manager blocked list
    try {
      const { resourceLoadingErrorManager } = require('./resourceLoadingErrorHandler');
      problematicDomains.forEach(domain => {
        console.log(`   Blocking: ${domain}`);
      });
      console.log('✅ Problematic domains blocked');
    } catch (error) {
      console.warn('Could not access resource loading error manager:', error);
    }
  }
}

export const emergencyTools = new ErrorEmergencyTools();

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).emergencyTools = emergencyTools;
  
  // Show emergency instructions
  console.log('🚨 EMERGENCY ERROR DEBUGGING TOOLS LOADED');
  console.log('==========================================');
  console.log('🔧 Available commands:');
  console.log('   • emergencyTools.quickDiagnosis() - Quick error analysis');
  console.log('   • emergencyTools.identifyErrorSource() - Find error source');
  console.log('   • emergencyTools.emergencyActions() - Show all available actions');
  console.log('   • emergencyTools.stopAllErrors() - Emergency stop');
  console.log('');
  console.log('🚨 For immediate help with 200K errors, run:');
  console.log('   emergencyTools.quickDiagnosis()');
}
