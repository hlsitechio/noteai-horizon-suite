/**
 * Advanced Error Debugger - Enhanced debugging for high-volume errors
 */

interface ErrorPattern {
  signature: string;
  count: number;
  firstSeen: number;
  lastSeen: number;
  rate: number; // errors per second
  stackTrace?: string;
  category: 'network' | 'console' | 'resource' | 'javascript' | 'promise' | 'other';
}

interface ErrorHotspot {
  source: string;
  errorCount: number;
  percentage: number;
  patterns: ErrorPattern[];
}

interface DebugSession {
  id: string;
  startTime: number;
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  topPatterns: ErrorPattern[];
  hotspots: ErrorHotspot[];
  recommendations: string[];
}

class AdvancedErrorDebugger {
  private errorPatterns = new Map<string, ErrorPattern>();
  private recentErrors: Array<{ timestamp: number; signature: string; category: string; details: any }> = [];
  private debugSession: DebugSession | null = null;
  private realTimeAnalysis = false;
  private analysisInterval: NodeJS.Timeout | null = null;

  startAdvancedDebugging() {
    console.log('🔍 Starting Advanced Error Debugging Session...');
    
    this.debugSession = {
      id: `debug_${Date.now()}`,
      startTime: Date.now(),
      totalErrors: 0,
      errorsByCategory: {},
      topPatterns: [],
      hotspots: [],
      recommendations: []
    };

    this.realTimeAnalysis = true;
    this.setupAdvancedInterception();
    this.startRealTimeAnalysis();
    
    console.log('📊 Advanced debugging active - monitoring all error sources');
  }

  private setupAdvancedInterception() {
    // Enhanced console error interception
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      this.captureError('console', 'error', args);
      return originalError.apply(console, args);
    };

    console.warn = (...args) => {
      this.captureError('console', 'warn', args);
      return originalWarn.apply(console, args);
    };

    // Network error interception
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      try {
        const response = await originalFetch.apply(window, args);
        if (!response.ok) {
          this.captureError('network', 'fetch_error', {
            url: args[0],
            status: response.status,
            statusText: response.statusText,
            duration: Date.now() - startTime
          });
        }
        return response;
      } catch (error) {
        this.captureError('network', 'fetch_failed', {
          url: args[0],
          error: error.message,
          duration: Date.now() - startTime
        });
        throw error;
      }
    };

    // JavaScript error interception
    const originalWindowError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureError('javascript', 'runtime_error', {
        message,
        source,
        lineno,
        colno,
        stack: error?.stack
      });
      
      if (originalWindowError) {
        return originalWindowError(message, source, lineno, colno, error);
      }
      return false;
    };

    // Promise rejection interception
    const originalUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = (event) => {
      this.captureError('promise', 'unhandled_rejection', {
        reason: event.reason,
        promise: event.promise
      });
      
      if (originalUnhandledRejection) {
        return originalUnhandledRejection(event);
      }
    };

    // Resource loading error interception
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        this.captureError('resource', 'load_failed', {
          tagName: target.tagName,
          src: (target as any).src || (target as any).href,
          type: target.tagName.toLowerCase()
        });
      }
    }, true);
  }

  private captureError(category: string, type: string, details: any) {
    if (!this.realTimeAnalysis) return;

    const signature = this.generateErrorSignature(category, type, details);
    const timestamp = Date.now();

    // Update error patterns
    let pattern = this.errorPatterns.get(signature);
    if (!pattern) {
      pattern = {
        signature,
        count: 0,
        firstSeen: timestamp,
        lastSeen: timestamp,
        rate: 0,
        category: category as any,
        stackTrace: details.stack || details.error?.stack
      };
      this.errorPatterns.set(signature, pattern);
    }

    pattern.count++;
    pattern.lastSeen = timestamp;
    pattern.rate = pattern.count / ((timestamp - pattern.firstSeen) / 1000);

    // Add to recent errors (keep only last 1000)
    this.recentErrors.push({ timestamp, signature, category, details });
    if (this.recentErrors.length > 1000) {
      this.recentErrors = this.recentErrors.slice(-1000);
    }

    // Update debug session
    if (this.debugSession) {
      this.debugSession.totalErrors++;
      this.debugSession.errorsByCategory[category] = (this.debugSession.errorsByCategory[category] || 0) + 1;
    }
  }

  private generateErrorSignature(category: string, type: string, details: any): string {
    switch (category) {
      case 'console':
        return `${category}:${type}:${this.normalizeMessage(details.join(' '))}`;
      case 'network':
        return `${category}:${type}:${details.url || 'unknown'}`;
      case 'javascript':
        return `${category}:${type}:${details.message}:${details.source}:${details.lineno}`;
      case 'promise':
        return `${category}:${type}:${details.reason}`;
      case 'resource':
        return `${category}:${type}:${details.tagName}:${details.src}`;
      default:
        return `${category}:${type}:${JSON.stringify(details).substring(0, 100)}`;
    }
  }

  private normalizeMessage(message: string): string {
    // Normalize similar error messages
    return message
      .replace(/\d+/g, 'N') // Replace numbers with N
      .replace(/https?:\/\/[^\s]+/g, 'URL') // Replace URLs
      .substring(0, 100); // Limit length
  }

  private startRealTimeAnalysis() {
    this.analysisInterval = setInterval(() => {
      this.performAnalysis();
    }, 5000); // Analyze every 5 seconds
  }

  private performAnalysis() {
    if (!this.debugSession) return;

    const now = Date.now();
    const timeWindow = 60000; // 1 minute
    const recentErrorsInWindow = this.recentErrors.filter(
      error => now - error.timestamp <= timeWindow
    );

    // Calculate error rate
    const currentRate = recentErrorsInWindow.length / (timeWindow / 1000);
    
    // Find top error patterns
    const patterns = Array.from(this.errorPatterns.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Identify hotspots
    const hotspots = this.identifyHotspots(patterns);

    // Generate recommendations
    const recommendations = this.generateRecommendations(patterns, currentRate);

    // Update debug session
    this.debugSession.topPatterns = patterns;
    this.debugSession.hotspots = hotspots;
    this.debugSession.recommendations = recommendations;

    // Log critical findings
    if (currentRate > 50) {
      console.error(`🚨 CRITICAL ERROR RATE: ${currentRate.toFixed(1)} errors/second`);
      console.group('🔥 Top Error Patterns:');
      patterns.slice(0, 5).forEach((pattern, i) => {
        console.error(`${i + 1}. ${pattern.signature} (${pattern.count} times, ${pattern.rate.toFixed(2)}/sec)`);
      });
      console.groupEnd();
    }

    if (recommendations.length > 0) {
      console.group('💡 Recommendations:');
      recommendations.forEach(rec => console.warn(`• ${rec}`));
      console.groupEnd();
    }
  }

  private identifyHotspots(patterns: ErrorPattern[]): ErrorHotspot[] {
    const hotspots = new Map<string, ErrorHotspot>();
    const totalErrors = patterns.reduce((sum, p) => sum + p.count, 0);

    patterns.forEach(pattern => {
      const source = this.extractSource(pattern);
      
      if (!hotspots.has(source)) {
        hotspots.set(source, {
          source,
          errorCount: 0,
          percentage: 0,
          patterns: []
        });
      }

      const hotspot = hotspots.get(source)!;
      hotspot.errorCount += pattern.count;
      hotspot.patterns.push(pattern);
    });

    // Calculate percentages and sort
    return Array.from(hotspots.values())
      .map(hotspot => ({
        ...hotspot,
        percentage: (hotspot.errorCount / totalErrors) * 100
      }))
      .sort((a, b) => b.errorCount - a.errorCount);
  }

  private extractSource(pattern: ErrorPattern): string {
    if (pattern.signature.includes('network:')) return 'Network Requests';
    if (pattern.signature.includes('resource:')) return 'Resource Loading';
    if (pattern.signature.includes('console:')) return 'Console Errors';
    if (pattern.signature.includes('javascript:')) return 'JavaScript Runtime';
    if (pattern.signature.includes('promise:')) return 'Promise Rejections';
    return 'Unknown Source';
  }

  private generateRecommendations(patterns: ErrorPattern[], currentRate: number): string[] {
    const recommendations: string[] = [];

    if (currentRate > 100) {
      recommendations.push('EMERGENCY: Error rate exceeds 100/sec - consider emergency shutdown');
    }

    // Check for specific error patterns
    const networkErrors = patterns.filter(p => p.category === 'network').length;
    const resourceErrors = patterns.filter(p => p.category === 'resource').length;
    const consoleErrors = patterns.filter(p => p.category === 'console').length;

    if (networkErrors > 5) {
      recommendations.push('High network error count - check API endpoints and CORS configuration');
    }

    if (resourceErrors > 3) {
      recommendations.push('Multiple resource loading failures - check CSP and blocked domains');
    }

    if (consoleErrors > 10) {
      recommendations.push('Excessive console errors - review error suppression patterns');
    }

    // Check for infinite loops
    const highRatePatterns = patterns.filter(p => p.rate > 10);
    if (highRatePatterns.length > 0) {
      recommendations.push('Detected high-frequency errors - possible infinite loops or rapid retries');
      highRatePatterns.forEach(p => {
        recommendations.push(`  - ${p.signature} (${p.rate.toFixed(1)}/sec)`);
      });
    }

    return recommendations;
  }

  getDebugReport(): DebugSession | null {
    return this.debugSession;
  }

  getTopErrorPatterns(limit: number = 20): ErrorPattern[] {
    return Array.from(this.errorPatterns.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  stopDebugging() {
    this.realTimeAnalysis = false;
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    console.log('🔍 Advanced debugging session ended');
    
    if (this.debugSession) {
      console.group('📋 Final Debug Report');
      console.log('Session Duration:', Math.round((Date.now() - this.debugSession.startTime) / 1000), 'seconds');
      console.log('Total Errors Captured:', this.debugSession.totalErrors);
      console.log('Errors by Category:', this.debugSession.errorsByCategory);
      console.log('Top Error Patterns:', this.debugSession.topPatterns.slice(0, 10));
      console.log('Hotspots:', this.debugSession.hotspots);
      console.log('Recommendations:', this.debugSession.recommendations);
      console.groupEnd();
    }
  }

  // Emergency functions
  emergencyAnalysis() {
    console.log('🚨 EMERGENCY ANALYSIS - Identifying critical error sources');
    
    const criticalPatterns = this.getTopErrorPatterns(10);
    const totalErrors = criticalPatterns.reduce((sum, p) => sum + p.count, 0);
    
    console.group('🔥 CRITICAL ERROR ANALYSIS');
    console.log(`Total errors in top patterns: ${totalErrors}`);
    
    criticalPatterns.forEach((pattern, i) => {
      const percentage = (pattern.count / totalErrors * 100).toFixed(1);
      console.error(`${i + 1}. [${percentage}%] ${pattern.signature}`);
      console.log(`   Count: ${pattern.count}, Rate: ${pattern.rate.toFixed(2)}/sec`);
      if (pattern.stackTrace) {
        console.log(`   Stack: ${pattern.stackTrace.split('\n')[0]}`);
      }
    });
    console.groupEnd();
    
    return criticalPatterns;
  }

  clearAllData() {
    this.errorPatterns.clear();
    this.recentErrors = [];
    this.debugSession = null;
    console.log('🧹 All debug data cleared');
  }
}

export const advancedErrorDebugger = new AdvancedErrorDebugger();

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).advancedDebugger = advancedErrorDebugger;
}
