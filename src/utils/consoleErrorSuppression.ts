/**
 * Console Error Suppression and Logging System
 * Intercepts and manages console errors with intelligent filtering
 */

interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  suppressed: boolean;
  count: number;
}

class ConsoleErrorManager {
  private errorLog: ErrorLogEntry[] = [];
  private suppressedPatterns: RegExp[] = [];
  private maxLogSize = 1000;
  private originalConsole = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    log: console.log
  };

  constructor() {
    this.setupSuppressionPatterns();
    this.interceptConsole();
  }

  private setupSuppressionPatterns() {
    this.suppressedPatterns = [
      /ResizeObserver loop limit exceeded/i,
      /Non-Error promise rejection captured/i,
      /Script error\./i,
      /Network request failed/i,
      /Loading chunk \d+ failed/i,
      /ChunkLoadError/i,
      /dynamically imported module/i,
      /Extension context invalidated/i,
      /chrome-extension:/i,
      /moz-extension:/i,
      /webkit-masked-url:/i,
    ];
  }

  private interceptConsole() {
    console.error = (...args: any[]) => {
      this.handleConsoleMessage('error', args);
    };

    console.warn = (...args: any[]) => {
      this.handleConsoleMessage('warn', args);
    };

    console.info = (...args: any[]) => {
      this.handleConsoleMessage('info', args);
    };
  }

  private handleConsoleMessage(level: 'error' | 'warn' | 'info', args: any[]) {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');

    const shouldSuppress = this.shouldSuppressMessage(message);
    
    if (!shouldSuppress || import.meta.env.DEV) {
      this.originalConsole[level](...args);
    }

    this.logError({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      stack: new Error().stack,
      suppressed: shouldSuppress,
      count: 1
    });
  }

  private shouldSuppressMessage(message: string): boolean {
    return this.suppressedPatterns.some(pattern => pattern.test(message));
  }

  private logError(entry: ErrorLogEntry) {
    // Check for duplicate messages
    const existing = this.errorLog.find(log => 
      log.message === entry.message && log.level === entry.level
    );

    if (existing) {
      existing.count++;
      existing.timestamp = entry.timestamp;
      return;
    }

    this.errorLog.unshift(entry);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }
  }

  public getErrorLog(): ErrorLogEntry[] {
    return [...this.errorLog];
  }

  public clearLog() {
    this.errorLog = [];
  }

  public addSuppressionPattern(pattern: RegExp) {
    this.suppressedPatterns.push(pattern);
  }

  public getStats() {
    const total = this.errorLog.length;
    const suppressed = this.errorLog.filter(log => log.suppressed).length;
    const byLevel = this.errorLog.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, suppressed, byLevel };
  }

  public restore() {
    console.error = this.originalConsole.error;
    console.warn = this.originalConsole.warn;
    console.info = this.originalConsole.info;
  }
}

export const consoleErrorManager = new ConsoleErrorManager();
