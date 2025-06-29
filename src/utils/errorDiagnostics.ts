/**
 * Error Diagnostics - Real-time error monitoring and reporting
 */

class ErrorDiagnostics {
  private errorCount = 0;
  private startTime = Date.now();
  private errorsByType: Record<string, number> = {};
  private recentErrors: Array<{ timestamp: number; type: string; message: string }> = [];

  constructor() {
    this.setupRealTimeMonitoring();
  }

  private setupRealTimeMonitoring() {
    // Monitor original console methods before they get intercepted
    const originalError = console.error;
    const originalWarn = console.warn;

    // Intercept and count all errors
    const self = this;
    
    console.error = function(...args) {
      self.logError('console.error', args.join(' '));
      return originalError.apply(console, args);
    };

    console.warn = function(...args) {
      self.logError('console.warn', args.join(' '));
      return originalWarn.apply(console, args);
    };

    // Monitor unhandled errors
    window.addEventListener('error', (event) => {
      self.logError('javascript_error', event.message || 'Unknown error');
    });

    // Monitor promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      self.logError('promise_rejection', String(event.reason));
    });

    // Monitor network errors
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      try {
        const response = await originalFetch.apply(window, args);
        if (!response.ok) {
          self.logError('network_error', `${response.status} ${response.statusText}`);
        }
        return response;
      } catch (error) {
        self.logError('network_error', String(error));
        throw error;
      }
    };

    // Report stats every 5 seconds
    setInterval(() => {
      this.reportStats();
    }, 5000);
  }

  private logError(type: string, message: string) {
    this.errorCount++;
    this.errorsByType[type] = (this.errorsByType[type] || 0) + 1;
    
    this.recentErrors.push({
      timestamp: Date.now(),
      type,
      message: message.substring(0, 200) // Limit message length
    });

    // Keep only last 50 errors
    if (this.recentErrors.length > 50) {
      this.recentErrors = this.recentErrors.slice(-50);
    }
  }

  private reportStats() {
    const runtime = Math.round((Date.now() - this.startTime) / 1000);
    const errorRate = (this.errorCount / runtime * 60).toFixed(1); // errors per minute

    console.group(`🔍 ERROR DIAGNOSTICS - Runtime: ${runtime}s`);
    console.log(`📊 Total Errors: ${this.errorCount} (${errorRate}/min)`);
    console.log('📈 Errors by Type:', this.errorsByType);
    
    if (this.recentErrors.length > 0) {
      console.log('🕒 Recent Errors (last 10):');
      this.recentErrors.slice(-10).forEach((error, index) => {
        const timeAgo = Math.round((Date.now() - error.timestamp) / 1000);
        console.log(`  ${index + 1}. [${timeAgo}s ago] ${error.type}: ${error.message}`);
      });
    }
    
    console.groupEnd();

    // Alert if error rate is very high
    if (parseFloat(errorRate) > 30) {
      console.error(`🚨 HIGH ERROR RATE DETECTED: ${errorRate} errors/minute`);
    }
  }

  public getStats() {
    return {
      totalErrors: this.errorCount,
      runtime: Math.round((Date.now() - this.startTime) / 1000),
      errorsByType: { ...this.errorsByType },
      recentErrors: [...this.recentErrors]
    };
  }

  public reset() {
    this.errorCount = 0;
    this.startTime = Date.now();
    this.errorsByType = {};
    this.recentErrors = [];
    console.log('🔄 Error diagnostics reset');
  }
}

export const errorDiagnostics = new ErrorDiagnostics();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).errorDiagnostics = errorDiagnostics;
}
