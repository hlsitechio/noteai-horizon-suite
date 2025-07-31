import { logger } from '../utils/logger';

interface ErrorContext {
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  timestamp: number;
  buildVersion?: string;
  environment: 'development' | 'production' | 'staging';
}

interface CategorizedError {
  id: string;
  type: 'javascript' | 'network' | 'render' | 'memory' | 'security' | 'user-action';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  context: ErrorContext;
  frequency: number;
  firstSeen: number;
  lastSeen: number;
  resolved: boolean;
  tags: string[];
}

interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  errorRate: number;
  mttr: number; // Mean Time To Resolution
  stabilityScore: number;
  trendsData: Array<{
    timestamp: number;
    errorCount: number;
    errorRate: number;
  }>;
}

interface ErrorPattern {
  pattern: RegExp;
  type: CategorizedError['type'];
  severity: CategorizedError['severity'];
  suggestion: string;
}

export class AdvancedErrorManagement {
  private static errors: Map<string, CategorizedError> = new Map();
  private static metrics: ErrorMetrics = {
    totalErrors: 0,
    errorsByType: {},
    errorsBySeverity: {},
    errorRate: 0,
    mttr: 0,
    stabilityScore: 100,
    trendsData: []
  };
  
  private static sessionId = this.generateSessionId();
  private static isInitialized = false;
  private static errorPatterns: ErrorPattern[] = [
    {
      pattern: /ChunkLoadError|Loading chunk \\d+ failed/,
      type: 'network',
      severity: 'medium',
      suggestion: 'Implement chunk loading retry logic or reduce bundle sizes'
    },
    {
      pattern: /Cannot read property|Cannot read properties of undefined/,
      type: 'javascript',
      severity: 'high',
      suggestion: 'Add null checks and proper error boundaries'
    },
    {
      pattern: /Script error|Non-Error promise rejection/,
      type: 'javascript',
      severity: 'medium',
      suggestion: 'Enable CORS for better error reporting or add promise rejection handlers'
    },
    {
      pattern: /ResizeObserver loop limit exceeded/,
      type: 'render',
      severity: 'low',
      suggestion: 'Optimize component rendering and avoid infinite resize loops'
    },
    {
      pattern: /QuotaExceededError|Storage quota exceeded/,
      type: 'memory',
      severity: 'medium',
      suggestion: 'Implement storage cleanup and quota management'
    },
    {
      pattern: /SecurityError|Blocked by Content Security Policy/,
      type: 'security',
      severity: 'critical',
      suggestion: 'Review and update Content Security Policy configuration'
    }
  ];

  static initialize() {
    if (this.isInitialized) return;

    this.setupGlobalErrorHandlers();
    this.loadErrorsFromStorage();
    this.setupPeriodicCleanup();
    this.isInitialized = true;
    
    logger.info('Advanced Error Management initialized');
  }

  private static setupGlobalErrorHandlers() {
    // Enhanced global error handler
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'javascript',
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Enhanced unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'javascript',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack
      });
    });

    // React error boundary integration
    window.addEventListener('react-error-boundary', (event: any) => {
      this.captureError({
        type: 'render',
        message: `React Error Boundary: ${event.detail.error.message}`,
        stack: event.detail.error.stack,
        componentStack: event.detail.errorInfo?.componentStack
      });
    });

    // Performance observer for resource errors
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.duration === 0) {
              this.captureError({
                type: 'network',
                message: `Failed to load resource: ${resourceEntry.name}`,
                severity: 'medium'
              });
            }
          }
        });
        observer.observe({ type: 'resource', buffered: true });
      } catch (error) {
        logger.warn('Failed to setup performance observer for error tracking:', error);
      }
    }
  }

  static captureError(errorData: {
    type?: CategorizedError['type'];
    message: string;
    stack?: string;
    severity?: CategorizedError['severity'];
    filename?: string;
    lineno?: number;
    colno?: number;
    componentStack?: string;
    userId?: string;
  }) {
    const errorId = this.generateErrorId(errorData.message, errorData.stack);
    const existingError = this.errors.get(errorId);
    
    // Determine error type and severity using patterns
    const pattern = this.errorPatterns.find(p => p.pattern.test(errorData.message));
    const errorType = errorData.type || pattern?.type || 'javascript';
    const severity = errorData.severity || pattern?.severity || this.determineSeverity(errorData.message);

    const context: ErrorContext = {
      userId: errorData.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      buildVersion: this.getBuildVersion(),
      environment: this.getEnvironment()
    };

    if (existingError) {
      // Update existing error
      existingError.frequency++;
      existingError.lastSeen = Date.now();
      existingError.context = context; // Update with latest context
    } else {
      // Create new error
      const newError: CategorizedError = {
        id: errorId,
        type: errorType,
        severity,
        message: errorData.message,
        stack: errorData.stack,
        context,
        frequency: 1,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        resolved: false,
        tags: this.generateTags(errorData.message, errorType)
      };
      
      this.errors.set(errorId, newError);
    }

    // Update metrics
    this.updateMetrics();
    this.saveErrorsToStorage();

    // Log based on severity
    if (severity === 'critical') {
      logger.error('Critical error captured:', { errorId, message: errorData.message });
    } else if (severity === 'high') {
      logger.warn('High severity error captured:', { errorId, message: errorData.message });
    } else {
      logger.debug('Error captured:', { errorId, message: errorData.message });
    }

    // Auto-suggest solutions for known patterns
    if (pattern) {
      logger.info(`Error suggestion for ${errorType}: ${pattern.suggestion}`);
    }

    return errorId;
  }

  static getErrors(): CategorizedError[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.lastSeen - a.lastSeen);
  }

  static getErrorsByType(type: CategorizedError['type']): CategorizedError[] {
    return this.getErrors().filter(error => error.type === type);
  }

  static getErrorsBySeverity(severity: CategorizedError['severity']): CategorizedError[] {
    return this.getErrors().filter(error => error.severity === severity);
  }

  static getMetrics(): ErrorMetrics {
    return { ...this.metrics };
  }

  static resolveError(errorId: string, resolvedBy?: string) {
    const error = this.errors.get(errorId);
    if (error && !error.resolved) {
      error.resolved = true;
      error.tags.push(`resolved-by:${resolvedBy || 'system'}`);
      this.updateMetrics();
      this.saveErrorsToStorage();
      
      logger.info(`Error resolved: ${errorId} by ${resolvedBy || 'system'}`);
    }
  }

  static dismissError(errorId: string) {
    const error = this.errors.get(errorId);
    if (error) {
      error.tags.push('dismissed');
      this.saveErrorsToStorage();
    }
  }

  static getErrorInsights(): {
    topErrorTypes: Array<{ type: string; count: number; percentage: number }>;
    criticalIssues: CategorizedError[];
    recentTrends: Array<{ period: string; errorCount: number; change: number }>;
    suggestions: Array<{ priority: 'high' | 'medium' | 'low'; message: string; type: string }>;
  } {
    const errors = this.getErrors();
    const activeErrors = errors.filter(e => !e.resolved);
    
    // Top error types
    const typeCount: Record<string, number> = {};
    activeErrors.forEach(error => {
      typeCount[error.type] = (typeCount[error.type] || 0) + error.frequency;
    });
    
    const totalErrors = Object.values(typeCount).reduce((sum, count) => sum + count, 0);
    const topErrorTypes = Object.entries(typeCount)
      .map(([type, count]) => ({
        type,
        count,
        percentage: totalErrors > 0 ? (count / totalErrors) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Critical issues
    const criticalIssues = activeErrors.filter(e => e.severity === 'critical');

    // Recent trends (last 7 days)
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const recentTrends = [];
    
    for (let i = 6; i >= 0; i--) {
      const periodStart = now - (i + 1) * dayMs;
      const periodEnd = now - i * dayMs;
      const periodErrors = errors.filter(e => 
        e.firstSeen >= periodStart && e.firstSeen < periodEnd
      );
      
      recentTrends.push({
        period: new Date(periodEnd - dayMs / 2).toISOString().split('T')[0],
        errorCount: periodErrors.length,
        change: 0 // Would calculate change from previous period
      });
    }

    // Suggestions based on error patterns
    const suggestions = this.generateErrorSuggestions(activeErrors);

    return {
      topErrorTypes,
      criticalIssues,
      recentTrends,
      suggestions
    };
  }

  private static generateErrorSuggestions(errors: CategorizedError[]): Array<{
    priority: 'high' | 'medium' | 'low';
    message: string;
    type: string;
  }> {
    const suggestions = [];
    
    // Check for common patterns
    const networkErrors = errors.filter(e => e.type === 'network').length;
    const jsErrors = errors.filter(e => e.type === 'javascript').length;
    const criticalErrors = errors.filter(e => e.severity === 'critical').length;
    
    if (criticalErrors > 0) {
      suggestions.push({
        priority: 'high' as const,
        message: `${criticalErrors} critical errors need immediate attention`,
        type: 'critical-alert'
      });
    }
    
    if (networkErrors > 5) {
      suggestions.push({
        priority: 'medium' as const,
        message: 'High number of network errors detected. Consider implementing retry logic.',
        type: 'network-optimization'
      });
    }
    
    if (jsErrors > 10) {
      suggestions.push({
        priority: 'medium' as const,
        message: 'Many JavaScript errors detected. Review error boundaries and null checks.',
        type: 'code-quality'
      });
    }
    
    return suggestions;
  }

  private static generateErrorId(message: string, stack?: string): string {
    const content = message + (stack || '');
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private static generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static determineSeverity(message: string): CategorizedError['severity'] {
    if (message.includes('Critical') || message.includes('Fatal')) return 'critical';
    if (message.includes('Cannot read') || message.includes('undefined')) return 'high';
    if (message.includes('Warning') || message.includes('Deprecated')) return 'low';
    return 'medium';
  }

  private static generateTags(message: string, type: string): string[] {
    const tags = [type];
    
    if (message.includes('React')) tags.push('react');
    if (message.includes('fetch') || message.includes('XMLHttpRequest')) tags.push('api');
    if (message.includes('localStorage') || message.includes('sessionStorage')) tags.push('storage');
    if (message.includes('Permission') || message.includes('Security')) tags.push('security');
    
    return tags;
  }

  private static getBuildVersion(): string {
    return process.env.REACT_APP_VERSION || 'unknown';
  }

  private static getEnvironment(): 'development' | 'production' | 'staging' {
    return import.meta.env.MODE as 'development' | 'production' | 'staging';
  }

  private static updateMetrics() {
    const errors = Array.from(this.errors.values());
    const activeErrors = errors.filter(e => !e.resolved);
    
    this.metrics.totalErrors = errors.length;
    
    // Errors by type
    this.metrics.errorsByType = {};
    activeErrors.forEach(error => {
      this.metrics.errorsByType[error.type] = (this.metrics.errorsByType[error.type] || 0) + 1;
    });
    
    // Errors by severity
    this.metrics.errorsBySeverity = {};
    activeErrors.forEach(error => {
      this.metrics.errorsBySeverity[error.severity] = (this.metrics.errorsBySeverity[error.severity] || 0) + 1;
    });
    
    // Error rate (errors per session)
    this.metrics.errorRate = activeErrors.length;
    
    // Stability score (100 - weighted error score)
    const errorWeight = {
      critical: 25,
      high: 10,
      medium: 5,
      low: 1
    };
    
    const weightedErrors = activeErrors.reduce((sum, error) => {
      return sum + errorWeight[error.severity];
    }, 0);
    
    this.metrics.stabilityScore = Math.max(0, 100 - weightedErrors);
    
    // Add to trends
    this.metrics.trendsData.push({
      timestamp: Date.now(),
      errorCount: activeErrors.length,
      errorRate: this.metrics.errorRate
    });
    
    // Keep only last 100 entries
    if (this.metrics.trendsData.length > 100) {
      this.metrics.trendsData = this.metrics.trendsData.slice(-100);
    }
  }

  private static loadErrorsFromStorage() {
    try {
      const stored = localStorage.getItem('advanced_error_management');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.errors) {
          this.errors = new Map(data.errors);
        }
        if (data.metrics) {
          this.metrics = { ...this.metrics, ...data.metrics };
        }
      }
    } catch (error) {
      logger.warn('Failed to load error data from storage:', error);
    }
  }

  private static saveErrorsToStorage() {
    try {
      const data = {
        errors: Array.from(this.errors.entries()),
        metrics: this.metrics,
        lastUpdate: Date.now()
      };
      localStorage.setItem('advanced_error_management', JSON.stringify(data));
    } catch (error) {
      logger.warn('Failed to save error data to storage:', error);
    }
  }

  private static setupPeriodicCleanup() {
    // Clean up old resolved errors every hour
    setInterval(() => {
      const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago
      
      for (const [errorId, error] of this.errors.entries()) {
        if (error.resolved && error.lastSeen < cutoff) {
          this.errors.delete(errorId);
        }
      }
      
      this.saveErrorsToStorage();
    }, 60 * 60 * 1000); // Every hour
  }

  static cleanup() {
    this.saveErrorsToStorage();
    this.isInitialized = false;
    logger.info('Advanced Error Management cleaned up');
  }
}
