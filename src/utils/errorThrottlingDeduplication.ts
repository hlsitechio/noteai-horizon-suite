
/**
 * Error Throttling and Deduplication System
 */

interface ThrottledError {
  key: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  throttled: boolean;
}

class ErrorThrottlingManager {
  private errorCounts: Map<string, ThrottledError> = new Map();
  private throttleWindow = 60000; // 1 minute
  private maxErrorsPerWindow = 50;

  setThrottleConfig(windowMs: number, maxErrors: number) {
    this.throttleWindow = windowMs;
    this.maxErrorsPerWindow = maxErrors;
  }

  shouldThrottleError(errorMessage: string): boolean {
    const errorKey = this.generateErrorKey(errorMessage);
    const now = new Date();
    
    let errorInfo = this.errorCounts.get(errorKey);
    
    if (!errorInfo) {
      errorInfo = {
        key: errorKey,
        count: 1,
        firstSeen: now,
        lastSeen: now,
        throttled: false
      };
      this.errorCounts.set(errorKey, errorInfo);
      return false;
    }

    // Reset count if window has passed
    if (now.getTime() - errorInfo.firstSeen.getTime() > this.throttleWindow) {
      errorInfo.count = 1;
      errorInfo.firstSeen = now;
      errorInfo.lastSeen = now;
      errorInfo.throttled = false;
      return false;
    }

    errorInfo.count++;
    errorInfo.lastSeen = now;

    // Throttle if exceeded max count
    if (errorInfo.count > this.maxErrorsPerWindow) {
      errorInfo.throttled = true;
      return true;
    }

    return false;
  }

  private generateErrorKey(errorMessage: string): string {
    // Create a normalized key for similar errors
    return errorMessage
      .replace(/\d+/g, 'N') // Replace numbers
      .replace(/https?:\/\/[^\s]+/g, 'URL') // Replace URLs
      .substring(0, 100);
  }

  getStats() {
    return {
      totalUniqueErrors: this.errorCounts.size,
      throttledErrors: Array.from(this.errorCounts.values()).filter(e => e.throttled).length,
      windowSizeMs: this.throttleWindow,
      maxErrorsPerWindow: this.maxErrorsPerWindow
    };
  }

  cleanup() {
    const now = new Date();
    const cutoff = now.getTime() - (this.throttleWindow * 2);
    
    for (const [key, error] of this.errorCounts.entries()) {
      if (error.lastSeen.getTime() < cutoff) {
        this.errorCounts.delete(key);
      }
    }
  }
}

export const errorThrottlingManager = new ErrorThrottlingManager();

// Cleanup old entries periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    errorThrottlingManager.cleanup();
  }, 300000); // Every 5 minutes
}
