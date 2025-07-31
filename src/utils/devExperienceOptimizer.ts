/**
 * Developer Experience Optimizer
 * Creates a clean development environment by filtering noise and highlighting real issues
 */

// Development noise patterns to completely suppress
const DEV_NOISE_PATTERNS = [
  /SECURITY.*UTS tracking attempt blocked/i,
  /SECURITY.*fingerprinting blocker activated/i,
  /SECURITY.*Auth session updated/i,
  /Retrieved settings.*sanitized/i,
  /SECURITY AUDIT ACTIVE/i,
  /WebSocket connection.*failed/i,
  /Failed to load resource.*net::ERR_FAILED/i,
  /CORS policy.*blocked/i,
  /_sandbox\/dev-server/i,
  /Access-Control-Allow-Origin/i,
  /\[vite\].*connecting/i,
  /\[vite\].*connected/i,
  /\[HMR\]/i,
  /livereload/i,
  /hot.*reload/i,
  /dev.*server/i,
  /Circuit breaker.*triggered/i,
  /Too many requests/i
];

// Real issues that developers need to see
const IMPORTANT_PATTERNS = [
  /TypeError/i,
  /ReferenceError/i,
  /SyntaxError/i,
  /Cannot read prop/i,
  /Cannot set prop/i,
  /is not a function/i,
  /is not defined/i,
  /React.*Warning/i,
  /React.*Error/i,
  /Component.*error/i,
  /Hook.*error/i,
  /Network.*error/i,
  /API.*error/i,
  /Database.*error/i,
  /Authentication.*error/i,
  /Permission.*denied/i,
  /Unauthorized/i,
  /Forbidden/i,
  /Not found/i,
  /Internal server error/i
];

class DevExperienceOptimizer {
  private originalConsole: Console;
  private isOptimized = false;
  private errorCount = 0;
  private warningCount = 0;
  private suppressedCount = 0;

  constructor() {
    this.originalConsole = { ...console };
  }

  private isDevNoise(message: string): boolean {
    return DEV_NOISE_PATTERNS.some(pattern => pattern.test(message));
  }

  private isImportantIssue(message: string): boolean {
    return IMPORTANT_PATTERNS.some(pattern => pattern.test(message));
  }

  private formatMessage(level: string, args: any[]): string {
    const timestamp = new Date().toLocaleTimeString();
    const messageStr = args.join(' ');
    return `[${timestamp}] ${level.toUpperCase()}: ${messageStr}`;
  }

  public optimize() {
    if (this.isOptimized || import.meta.env.PROD) return;

    const self = this;
    
    // Override console methods for clean development experience
    console.log = function(...args: any[]) {
      const messageStr = args.join(' ');
      if (!self.isDevNoise(messageStr)) {
        self.originalConsole.log(...args);
      } else {
        self.suppressedCount++;
      }
    };

    console.info = function(...args: any[]) {
      const messageStr = args.join(' ');
      if (!self.isDevNoise(messageStr)) {
        self.originalConsole.info(...args);
      } else {
        self.suppressedCount++;
      }
    };

    console.warn = function(...args: any[]) {
      const messageStr = args.join(' ');
      if (self.isImportantIssue(messageStr) || !self.isDevNoise(messageStr)) {
        self.warningCount++;
        self.originalConsole.warn('⚠️', self.formatMessage('warning', args));
      } else {
        self.suppressedCount++;
      }
    };

    console.error = function(...args: any[]) {
      const messageStr = args.join(' ');
      if (self.isImportantIssue(messageStr) || !self.isDevNoise(messageStr)) {
        self.errorCount++;
        self.originalConsole.error('🚨', self.formatMessage('error', args));
      } else {
        self.suppressedCount++;
      }
    };

    console.debug = function(...args: any[]) {
      const messageStr = args.join(' ');
      if (!self.isDevNoise(messageStr)) {
        self.originalConsole.debug(...args);
      } else {
        self.suppressedCount++;
      }
    };

    this.isOptimized = true;
    
    // Show developer experience status
    this.originalConsole.log(
      '🧹 Development Experience Optimized - Console noise filtered'
    );

    // Show summary only when there are new errors (not repetitive warnings)
    let lastErrorCount = 0;
    setInterval(() => {
      if (this.errorCount > lastErrorCount) {
        this.originalConsole.group('📊 Development Summary');
        this.originalConsole.log(`Errors: ${this.errorCount} | Warnings: ${this.warningCount} | Noise filtered: ${this.suppressedCount}`);
        this.originalConsole.groupEnd();
        lastErrorCount = this.errorCount;
      }
    }, 60000); // Every 60 seconds, only for new errors
  }

  public restore() {
    Object.assign(console, this.originalConsole);
    this.isOptimized = false;
    this.originalConsole.log('🔧 Console restored to original state');
  }

  public getStats() {
    return {
      errors: this.errorCount,
      warnings: this.warningCount,
      suppressed: this.suppressedCount,
      isOptimized: this.isOptimized
    };
  }
}

// Global instance
export const devExperienceOptimizer = new DevExperienceOptimizer();

// Developer utilities
(window as any).__devStats = () => {
  const stats = devExperienceOptimizer.getStats();
  console.table(stats);
  return stats;
};

(window as any).__restoreConsole = () => {
  devExperienceOptimizer.restore();
};

(window as any).__optimizeConsole = () => {
  devExperienceOptimizer.optimize();
};