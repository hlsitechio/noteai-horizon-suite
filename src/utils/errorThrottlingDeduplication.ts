
/**
 * Error Throttling and Deduplication System
 */

interface ThrottleEntry {
  count: number;
  firstSeen: number;
  lastSeen: number;
}

class ErrorThrottlingManager {
  private throttleMap = new Map<string, ThrottleEntry>();
  private maxErrorsPerWindow = 100;
  private windowDuration = 60000; // 1 minute

  setThrottleConfig(windowMs: number, maxErrors: number) {
    this.windowDuration = windowMs;
    this.maxErrorsPerWindow = maxErrors;
  }

  shouldReportError(error: Error): boolean {
    const errorKey = this.getErrorKey(error);
    const now = Date.now();
    const entry = this.throttleMap.get(errorKey);

    if (!entry) {
      this.throttleMap.set(errorKey, {
        count: 1,
        firstSeen: now,
        lastSeen: now
      });
      return true;
    }

    // Reset if window has passed
    if (now - entry.firstSeen > this.windowDuration) {
      this.throttleMap.set(errorKey, {
        count: 1,
        firstSeen: now,
        lastSeen: now
      });
      return true;
    }

    // Update existing entry
    entry.count++;
    entry.lastSeen = now;

    return entry.count <= this.maxErrorsPerWindow;
  }

  getErrorStats() {
    const now = Date.now();
    let totalUniqueErrors = 0;
    let totalOccurrences = 0;
    let suppressedErrors = 0;

    for (const [key, entry] of this.throttleMap.entries()) {
      // Only count active entries (not expired)
      if (now - entry.lastSeen <= this.windowDuration) {
        totalUniqueErrors++;
        totalOccurrences += entry.count;
        if (entry.count > this.maxErrorsPerWindow) {
          suppressedErrors += entry.count - this.maxErrorsPerWindow;
        }
      }
    }

    return {
      totalUniqueErrors,
      totalOccurrences,
      suppressedErrors
    };
  }

  clearAllErrors() {
    this.throttleMap.clear();
  }

  private getErrorKey(error: Error): string {
    return `${error.name}:${error.message}`;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.throttleMap.entries()) {
      if (now - entry.lastSeen > this.windowDuration) {
        this.throttleMap.delete(key);
      }
    }
  }
}

export const errorThrottlingManager = new ErrorThrottlingManager();

// Cleanup old entries every 5 minutes
setInterval(() => {
  errorThrottlingManager.cleanup();
}, 300000);
