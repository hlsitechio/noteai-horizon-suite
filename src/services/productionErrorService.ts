import { logger } from '../utils/logger';

interface ErrorReport {
  id: string;
  error: Error;
  context: string;
  timestamp: number;
  userId?: string;
  userAgent: string;
  url: string;
  stackTrace: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  reportedBy: 'system' | 'user';
}

interface ErrorPattern {
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  autoResolve?: boolean;
  suggestion?: string;
}

export class ProductionErrorService {
  private static errorReports: Map<string, ErrorReport> = new Map();
  private static errorPatterns: ErrorPattern[] = [
    {
      pattern: /Network request failed|fetch.*failed|ERR_NETWORK/i,
      severity: 'medium',
      category: 'Network',
      suggestion: 'Check internet connection and retry'
    },
    {
      pattern: /Cannot read prop.*of undefined|TypeError.*undefined/i,
      severity: 'high',
      category: 'Runtime',
      suggestion: 'Null/undefined value accessed unexpectedly'
    },
    {
      pattern: /permission.*denied|unauthorized|403|401/i,
      severity: 'high',
      category: 'Security',
      suggestion: 'Authentication or authorization issue'
    },
    {
      pattern: /ChunkLoadError|Loading chunk \d+ failed/i,
      severity: 'medium',
      category: 'Loading',
      autoResolve: true,
      suggestion: 'Code splitting chunk failed to load - retry usually works'
    },
    {
      pattern: /timeout|timed out|ETIMEDOUT/i,
      severity: 'medium',
      category: 'Performance',
      suggestion: 'Request timeout - check server response time'
    }
  ];

  static initialize() {
    // Set up global error handlers
    this.setupErrorHandlers();
    logger.info('Production Error Service initialized');
  }

  private static setupErrorHandlers() {
    // Global JavaScript error handler
    window.addEventListener('error', (event) => {
      this.reportError({
        error: event.error || new Error(event.message),
        context: 'Global JavaScript Error',
        severity: this.categorizeError(event.error?.message || event.message).severity,
        reportedBy: 'system'
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      this.reportError({
        error,
        context: 'Unhandled Promise Rejection',
        severity: this.categorizeError(error.message).severity,
        reportedBy: 'system'
      });
    });

    // React Error Boundary integration
    this.setupReactErrorBoundary();
  }

  private static setupReactErrorBoundary() {
    // This would be called by React Error Boundaries
    window.reportReactError = (error: Error, errorInfo: any) => {
      this.reportError({
        error,
        context: `React Error Boundary: ${errorInfo.componentStack}`,
        severity: 'high',
        reportedBy: 'system'
      });
    };
  }

  static reportError(options: {
    error: Error;
    context: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    userId?: string;
    reportedBy: 'system' | 'user';
  }) {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const categorization = this.categorizeError(options.error.message);

    const errorReport: ErrorReport = {
      id: errorId,
      error: options.error,
      context: options.context,
      timestamp: Date.now(),
      userId: options.userId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      stackTrace: options.error.stack || '',
      severity: options.severity || categorization.severity,
      resolved: categorization.autoResolve || false,
      reportedBy: options.reportedBy
    };

    this.errorReports.set(errorId, errorReport);

    // Log based on severity
    switch (errorReport.severity) {
      case 'critical':
        logger.error('CRITICAL ERROR:', errorReport);
        this.sendCriticalAlert(errorReport);
        break;
      case 'high':
        logger.error('High severity error:', errorReport);
        break;
      case 'medium':
        logger.warn('Medium severity error:', errorReport);
        break;
      case 'low':
        logger.debug('Low severity error:', errorReport);
        break;
    }

    return errorId;
  }

  private static categorizeError(errorMessage: string): { severity: ErrorReport['severity']; category: string; autoResolve?: boolean; suggestion?: string } {
    for (const pattern of this.errorPatterns) {
      if (pattern.pattern.test(errorMessage)) {
        return {
          severity: pattern.severity,
          category: pattern.category,
          autoResolve: pattern.autoResolve,
          suggestion: pattern.suggestion
        };
      }
    }

    // Default categorization
    return {
      severity: 'medium',
      category: 'Unknown'
    };
  }

  private static sendCriticalAlert(error: ErrorReport) {
    // In production, this would send alerts to monitoring services
    logger.error('🚨 CRITICAL ERROR ALERT 🚨', {
      errorId: error.id,
      message: error.error.message,
      context: error.context,
      timestamp: new Date(error.timestamp).toISOString()
    });

    // Store in localStorage for immediate access
    try {
      const criticalErrors = JSON.parse(localStorage.getItem('critical_errors') || '[]');
      criticalErrors.push({
        id: error.id,
        message: error.error.message,
        timestamp: error.timestamp,
        context: error.context
      });
      
      // Keep only last 10 critical errors
      if (criticalErrors.length > 10) {
        criticalErrors.splice(0, criticalErrors.length - 10);
      }
      
      localStorage.setItem('critical_errors', JSON.stringify(criticalErrors));
    } catch (storageError) {
      logger.error('Failed to store critical error:', storageError);
    }
  }

  static getErrorReports(timeRange?: '1h' | '24h' | '7d'): ErrorReport[] {
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };

    const cutoff = timeRange ? now - timeRanges[timeRange] : 0;
    
    return Array.from(this.errorReports.values())
      .filter(report => report.timestamp >= cutoff)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  static getErrorStats() {
    const reports = this.getErrorReports('24h');
    const total = reports.length;
    const bySeverity = {
      critical: reports.filter(r => r.severity === 'critical').length,
      high: reports.filter(r => r.severity === 'high').length,
      medium: reports.filter(r => r.severity === 'medium').length,
      low: reports.filter(r => r.severity === 'low').length
    };

    const resolved = reports.filter(r => r.resolved).length;
    const unresolved = total - resolved;

    return {
      total,
      bySeverity,
      resolved,
      unresolved,
      resolutionRate: total > 0 ? (resolved / total) * 100 : 0
    };
  }

  static markErrorResolved(errorId: string) {
    const error = this.errorReports.get(errorId);
    if (error) {
      error.resolved = true;
      this.errorReports.set(errorId, error);
      logger.info(`Error ${errorId} marked as resolved`);
    }
  }

  static clearOldErrors(olderThanDays: number = 7) {
    const cutoff = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    let clearedCount = 0;

    for (const [id, report] of this.errorReports.entries()) {
      if (report.timestamp < cutoff) {
        this.errorReports.delete(id);
        clearedCount++;
      }
    }

    logger.info(`Cleared ${clearedCount} old error reports`);
    return clearedCount;
  }
}

// Declare global for React Error Boundary integration
declare global {
  interface Window {
    reportReactError?: (error: Error, errorInfo: any) => void;
  }
}
