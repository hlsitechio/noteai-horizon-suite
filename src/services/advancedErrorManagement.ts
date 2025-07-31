import { logger } from '@/utils/logger';

interface ErrorMetrics {
  totalErrors: number;
  criticalErrors: number;
  warningErrors: number;
  recoveredErrors: number;
  stabilityScore: number;
  errorRate: number;
  meanTimeToRecovery: number;
}

interface ErrorReport {
  id: string;
  type: 'javascript' | 'network' | 'rendering' | 'performance';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  stack?: string;
  url?: string;
  recovered: boolean;
  userAgent?: string;
  context?: any;
}

interface RecoveryStrategy {
  errorType: string;
  action: 'retry' | 'fallback' | 'reload' | 'redirect';
  maxAttempts: number;
  delay: number;
}

export class AdvancedErrorManagement {
  private static errorHistory: ErrorReport[] = [];
  private static metrics: ErrorMetrics = {
    totalErrors: 0,
    criticalErrors: 0,
    warningErrors: 0,
    recoveredErrors: 0,
    stabilityScore: 100,
    errorRate: 0,
    meanTimeToRecovery: 0
  };

  private static recoveryStrategies: Map<string, RecoveryStrategy> = new Map([
    ['ChunkLoadError', { errorType: 'ChunkLoadError', action: 'reload', maxAttempts: 2, delay: 1000 }],
    ['NetworkError', { errorType: 'NetworkError', action: 'retry', maxAttempts: 3, delay: 2000 }],
    ['ReferenceError', { errorType: 'ReferenceError', action: 'fallback', maxAttempts: 1, delay: 0 }],
    ['TypeError', { errorType: 'TypeError', action: 'fallback', maxAttempts: 1, delay: 0 }]
  ]);

  private static isInitialized = false;
  private static attemptCounts: Map<string, number> = new Map();

  static initialize() {
    if (this.isInitialized) return;

    this.setupGlobalErrorHandlers();
    this.setupUnhandledPromiseRejectionHandler();
    this.startMetricsCalculation();
    
    logger.info('Advanced Error Management initialized');
    this.isInitialized = true;
  }

  private static setupGlobalErrorHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'javascript',
        message: event.message,
        severity: this.determineSeverity(event.error),
        stack: event.error?.stack,
        url: event.filename
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'javascript',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        severity: 'high',
        stack: event.reason?.stack
      });
    });

    // Override console.error to capture logged errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ');
      
      this.captureError({
        type: 'javascript',
        message,
        severity: 'medium'
      });
      
      originalConsoleError.apply(console, args);
    };
  }

  private static setupUnhandledPromiseRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      
      this.captureError({
        type: 'javascript',
        message: `Unhandled Promise: ${error?.message || error}`,
        severity: 'high',
        stack: error?.stack
      });

      // Attempt recovery
      this.attemptRecovery('UnhandledPromise', error);
    });
  }

  static captureError(errorData: Omit<ErrorReport, 'id' | 'timestamp' | 'recovered' | 'userAgent'>) {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      recovered: false,
      userAgent: navigator.userAgent,
      ...errorData
    };

    this.errorHistory.push(errorReport);
    
    // Keep only last 100 errors
    if (this.errorHistory.length > 100) {
      this.errorHistory.shift();
    }

    this.updateMetrics();
    this.attemptRecovery(errorData.type, errorData);

    logger.error('Error captured by Advanced Error Management', errorReport);
  }

  private static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static determineSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
    if (!error) return 'low';
    
    const message = error.message || error.toString();
    
    // Critical errors that break the app
    if (message.includes('ChunkLoadError') || 
        message.includes('Loading chunk') ||
        message.includes('TypeError: Cannot read prop')) {
      return 'critical';
    }
    
    // High severity errors
    if (message.includes('ReferenceError') ||
        message.includes('TypeError') ||
        message.includes('Network request failed')) {
      return 'high';
    }
    
    // Medium severity
    if (message.includes('Warning') || 
        message.includes('Deprecated')) {
      return 'medium';
    }
    
    return 'low';
  }

  private static async attemptRecovery(errorType: string, error: any): Promise<boolean> {
    const strategy = this.recoveryStrategies.get(errorType);
    if (!strategy) return false;

    const attemptKey = `${errorType}_${error?.message || 'unknown'}`;
    const currentAttempts = this.attemptCounts.get(attemptKey) || 0;

    if (currentAttempts >= strategy.maxAttempts) {
      return false;
    }

    this.attemptCounts.set(attemptKey, currentAttempts + 1);

    try {
      await new Promise(resolve => setTimeout(resolve, strategy.delay));

      switch (strategy.action) {
        case 'reload':
          window.location.reload();
          break;
        case 'retry':
          // Implement retry logic based on error context
          return this.retryFailedOperation(error);
        case 'fallback':
          return this.activateFallback(error);
        case 'redirect':
          window.location.href = '/app/dashboard';
          break;
      }

      this.markErrorAsRecovered(errorType);
      return true;
    } catch (recoveryError) {
      logger.error('Recovery attempt failed', { originalError: error, recoveryError });
      return false;
    }
  }

  private static retryFailedOperation(error: any): boolean {
    // Implement retry logic for network operations
    if (error?.type === 'network') {
      // Trigger a re-fetch or retry mechanism
      window.dispatchEvent(new CustomEvent('retry-failed-request', { detail: error }));
      return true;
    }
    return false;
  }

  private static activateFallback(error: any): boolean {
    // Implement fallback UI or functionality
    window.dispatchEvent(new CustomEvent('activate-error-fallback', { detail: error }));
    return true;
  }

  private static markErrorAsRecovered(errorType: string) {
    const recentErrors = this.errorHistory
      .filter(err => err.type === errorType && !err.recovered)
      .slice(-5); // Mark last 5 similar errors as recovered

    recentErrors.forEach(err => {
      err.recovered = true;
    });

    this.updateMetrics();
  }

  private static updateMetrics() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const recentErrors = this.errorHistory.filter(err => now - err.timestamp < oneHour);

    this.metrics.totalErrors = this.errorHistory.length;
    this.metrics.criticalErrors = this.errorHistory.filter(err => err.severity === 'critical').length;
    this.metrics.warningErrors = this.errorHistory.filter(err => err.severity === 'medium' || err.severity === 'low').length;
    this.metrics.recoveredErrors = this.errorHistory.filter(err => err.recovered).length;
    
    // Calculate error rate per hour
    this.metrics.errorRate = recentErrors.length;
    
    // Calculate stability score (0-100)
    const errorWeight = {
      critical: 25,
      high: 10,
      medium: 5,
      low: 1
    };
    
    const totalErrorWeight = recentErrors.reduce((sum, err) => sum + errorWeight[err.severity], 0);
    this.metrics.stabilityScore = Math.max(0, 100 - totalErrorWeight);
    
    // Calculate mean time to recovery
    const recoveredErrors = this.errorHistory.filter(err => err.recovered);
    if (recoveredErrors.length > 0) {
      const avgRecoveryTime = recoveredErrors.reduce((sum, err) => {
        const recoveryTime = this.estimateRecoveryTime(err);
        return sum + recoveryTime;
      }, 0) / recoveredErrors.length;
      
      this.metrics.meanTimeToRecovery = avgRecoveryTime;
    }
  }

  private static estimateRecoveryTime(error: ErrorReport): number {
    // Estimate recovery time based on error type and when it was marked as recovered
    // This is a simplified calculation
    return 30000; // 30 seconds average
  }

  private static startMetricsCalculation() {
    // Update metrics every 30 seconds
    setInterval(() => {
      this.updateMetrics();
    }, 30000);
  }

  static getMetrics(): ErrorMetrics {
    return { ...this.metrics };
  }

  static getErrorHistory(limit: number = 50): ErrorReport[] {
    return this.errorHistory.slice(-limit);
  }

  static clearErrorHistory() {
    this.errorHistory = [];
    this.attemptCounts.clear();
    this.updateMetrics();
  }

  static addRecoveryStrategy(errorType: string, strategy: RecoveryStrategy) {
    this.recoveryStrategies.set(errorType, strategy);
  }

  static getStabilityReport() {
    const metrics = this.getMetrics();
    const recentErrors = this.getErrorHistory(20);
    
    return {
      score: metrics.stabilityScore,
      status: metrics.stabilityScore >= 90 ? 'excellent' : 
              metrics.stabilityScore >= 70 ? 'good' : 
              metrics.stabilityScore >= 50 ? 'fair' : 'poor',
      recommendations: this.generateRecommendations(metrics, recentErrors)
    };
  }

  private static generateRecommendations(metrics: ErrorMetrics, recentErrors: ErrorReport[]): string[] {
    const recommendations: string[] = [];
    
    if (metrics.criticalErrors > 0) {
      recommendations.push('Address critical errors immediately to prevent app crashes');
    }
    
    if (metrics.errorRate > 10) {
      recommendations.push('High error rate detected - implement better error prevention');
    }
    
    if (metrics.meanTimeToRecovery > 60000) {
      recommendations.push('Improve error recovery mechanisms for faster resolution');
    }
    
    const commonErrorTypes = this.getMostCommonErrorTypes(recentErrors);
    if (commonErrorTypes.length > 0) {
      recommendations.push(`Focus on fixing common error types: ${commonErrorTypes.join(', ')}`);
    }
    
    return recommendations;
  }

  private static getMostCommonErrorTypes(errors: ErrorReport[]): string[] {
    const errorCounts = errors.reduce((acc, err) => {
      const type = err.message.split(':')[0] || err.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
  }
}
