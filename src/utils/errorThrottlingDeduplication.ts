
/**
 * Error Throttling & Deduplication System
 * Prevents error spam and manages duplicate error reporting
 */

interface ThrottledError {
  id: string;
  message: string;
  stack?: string;
  firstOccurrence: Date;
  lastOccurrence: Date;
  count: number;
  hash: string;
  suppressed: boolean;
}

class ErrorThrottlingManager {
  private errorMap: Map<string, ThrottledError> = new Map();
  private throttleWindow = 5000; // 5 seconds
  private maxOccurrences = 5;
  private cleanupInterval = 60000; // 1 minute
  private maxStoredErrors = 500;

  constructor() {
    this.startCleanupTimer();
  }

  public shouldReportError(error: Error | string, context?: Record<string, any>): boolean {
    const errorInfo = this.normalizeError(error);
    const errorHash = this.generateErrorHash(errorInfo, context);
    
    const existing = this.errorMap.get(errorHash);
    const now = new Date();

    if (!existing) {
      // First occurrence
      this.errorMap.set(errorHash, {
        id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: errorInfo.message,
        stack: errorInfo.stack,
        firstOccurrence: now,
        lastOccurrence: now,
        count: 1,
        hash: errorHash,
        suppressed: false
      });
      return true;
    }

    // Update existing error
    existing.lastOccurrence = now;
    existing.count++;

    // Check if we should throttle
    const timeSinceFirst = now.getTime() - existing.firstOccurrence.getTime();
    const shouldThrottle = existing.count > this.maxOccurrences && timeSinceFirst < this.throttleWindow;

    if (shouldThrottle && !existing.suppressed) {
      existing.suppressed = true;
      console.warn(`Error throttled: "${errorInfo.message}" (occurred ${existing.count} times)`);
      return false;
    }

    // Report if not suppressed or if it's been a while since last report
    const timeSinceLast = now.getTime() - existing.lastOccurrence.getTime();
    return !existing.suppressed || timeSinceLast > this.throttleWindow;
  }

  private normalizeError(error: Error | string): { message: string; stack?: string } {
    if (typeof error === 'string') {
      return { message: error };
    }
    return {
      message: error.message || String(error),
      stack: error.stack
    };
  }

  private generateErrorHash(errorInfo: { message: string; stack?: string }, context?: Record<string, any>): string {
    // Create hash based on error message, first few stack frames, and context
    const stackLines = errorInfo.stack?.split('\n').slice(0, 3).join('') || '';
    const contextStr = context ? JSON.stringify(context) : '';
    const combinedStr = errorInfo.message + stackLines + contextStr;
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < combinedStr.length; i++) {
      const char = combinedStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  private startCleanupTimer() {
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  private cleanup() {
    const now = new Date();
    const cutoffTime = now.getTime() - (this.cleanupInterval * 2);
    
    // Remove old errors
    for (const [hash, error] of this.errorMap.entries()) {
      if (error.lastOccurrence.getTime() < cutoffTime) {
        this.errorMap.delete(hash);
      }
    }

    // Limit total stored errors
    if (this.errorMap.size > this.maxStoredErrors) {
      const sortedErrors = Array.from(this.errorMap.entries())
        .sort(([, a], [, b]) => b.lastOccurrence.getTime() - a.lastOccurrence.getTime());
      
      this.errorMap.clear();
      sortedErrors.slice(0, this.maxStoredErrors).forEach(([hash, error]) => {
        this.errorMap.set(hash, error);
      });
    }

    console.log(`Error cleanup completed. Stored errors: ${this.errorMap.size}`);
  }

  public getErrorStats(): {
    totalUniqueErrors: number;
    totalOccurrences: number;
    suppressedErrors: number;
    topErrors: Array<{ message: string; count: number; suppressed: boolean }>;
  } {
    const errors = Array.from(this.errorMap.values());
    
    return {
      totalUniqueErrors: errors.length,
      totalOccurrences: errors.reduce((sum, error) => sum + error.count, 0),
      suppressedErrors: errors.filter(error => error.suppressed).length,
      topErrors: errors
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map(error => ({
          message: error.message,
          count: error.count,
          suppressed: error.suppressed
        }))
    };
  }

  public resetError(errorHash: string) {
    const error = this.errorMap.get(errorHash);
    if (error) {
      error.suppressed = false;
      error.count = 0;
      error.firstOccurrence = new Date();
    }
  }

  public clearAllErrors() {
    this.errorMap.clear();
  }

  public setThrottleConfig(window: number, maxOccurrences: number) {
    this.throttleWindow = window;
    this.maxOccurrences = maxOccurrences;
  }
}

export const errorThrottlingManager = new ErrorThrottlingManager();
