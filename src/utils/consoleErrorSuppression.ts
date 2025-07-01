
/**
 * Console Error Suppression System
 * Intelligently suppresses known non-critical console errors
 */

interface ConsoleErrorEntry {
  message: string;
  timestamp: Date;
  count: number;
  suppressed: boolean;
}

class ConsoleErrorManager {
  private errorLog: Map<string, ConsoleErrorEntry> = new Map();
  private suppressionPatterns: RegExp[] = [];
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;
  private isActive = false;

  constructor() {
    this.originalConsoleError = console.error.bind(console);
    this.originalConsoleWarn = console.warn.bind(console);
    this.setupSuppressionPatterns();
  }

  private setupSuppressionPatterns() {
    this.suppressionPatterns = [
      /ERR_BLOCKED_BY_CLIENT/i,
      /net::ERR_BLOCKED_BY_CLIENT/i,
      /AdBlock/i,
      /uBlock/i,
      /Content Security Policy/i,
      /connect\.facebook\.net/i,
      /googletagmanager\.com/i,
      /analytics\.tiktok\.com/i,
      /www\.redditstatic\.com/i,
      /static\.cloudflareinsights\.com/i,
      /plausible\.io/i,
      /ResizeObserver loop limit exceeded/i,
      /Non-Error promise rejection captured/i,
      /was preloaded using link preload but not used/i,
      /preloaded.*not used within a few seconds/i,
      /facebook\.com\/tr/i,
      /lovable\.js/i,
      /cdn\.gpteng\.co/i,
      /violates the following Content Security Policy directive/i,
      /script-src-elem.*cdn\.gpteng\.co/i,
      /Refused to load the script.*cdn\.gpteng\.co/i,
      /Refused to load the script.*because it violates.*Content Security Policy/i,
      /Refused to connect.*because it violates.*Content Security Policy/i,
      /Fetch API cannot load.*Refused to connect.*Content Security Policy/i,
      /\[Violation\] 'setInterval' handler took \d+ms/i,
      /\[Violation\] 'setTimeout' handler took \d+ms/i,
      /\[Violation\] 'requestAnimationFrame' handler took \d+ms/i,
      /Script error\./i,
    ];
  }

  activate() {
    if (this.isActive) return;

    console.error = (...args: any[]) => {
      this.handleConsoleMessage('error', args);
    };

    console.warn = (...args: any[]) => {
      this.handleConsoleMessage('warn', args);
    };

    this.isActive = true;
  }

  private handleConsoleMessage(level: 'error' | 'warn', args: any[]) {
    const message = args.join(' ');
    const messageKey = this.generateMessageKey(message);

    // Check if this should be suppressed
    if (this.shouldSuppress(message)) {
      this.logSuppressedMessage(messageKey, message);
      return; // Suppress the message
    }

    // Log the message normally
    if (level === 'error') {
      this.originalConsoleError(...args);
    } else {
      this.originalConsoleWarn(...args);
    }

    this.logMessage(messageKey, message, false);
  }

  private shouldSuppress(message: string): boolean {
    return this.suppressionPatterns.some(pattern => pattern.test(message));
  }

  private generateMessageKey(message: string): string {
    // Create a key based on the error pattern, not the exact message
    for (const pattern of this.suppressionPatterns) {
      if (pattern.test(message)) {
        return pattern.source;
      }
    }
    return message.substring(0, 100); // First 100 chars for unique messages
  }

  private logSuppressedMessage(key: string, message: string) {
    const existing = this.errorLog.get(key);
    if (existing) {
      existing.count++;
      existing.timestamp = new Date();
    } else {
      this.errorLog.set(key, {
        message: message.substring(0, 200),
        timestamp: new Date(),
        count: 1,
        suppressed: true
      });
    }
  }

  private logMessage(key: string, message: string, suppressed: boolean) {
    const existing = this.errorLog.get(key);
    if (existing) {
      existing.count++;
      existing.timestamp = new Date();
    } else {
      this.errorLog.set(key, {
        message: message.substring(0, 200),
        timestamp: new Date(),
        count: 1,
        suppressed
      });
    }
  }

  getErrorLog(): ConsoleErrorEntry[] {
    return Array.from(this.errorLog.values());
  }

  getSuppressedCount(): number {
    return Array.from(this.errorLog.values())
      .filter(entry => entry.suppressed)
      .reduce((sum, entry) => sum + entry.count, 0);
  }

  clearLog() {
    this.errorLog.clear();
  }

  restore() {
    if (!this.isActive) return;

    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;
    this.isActive = false;
  }

  getStats() {
    const entries = Array.from(this.errorLog.values());
    return {
      totalMessages: entries.reduce((sum, entry) => sum + entry.count, 0),
      uniqueMessages: entries.length,
      suppressedMessages: entries.filter(e => e.suppressed).length,
      suppressedCount: this.getSuppressedCount(),
      isActive: this.isActive
    };
  }
}

export const consoleErrorManager = new ConsoleErrorManager();

// Auto-activate
if (typeof window !== 'undefined') {
  consoleErrorManager.activate();
}
