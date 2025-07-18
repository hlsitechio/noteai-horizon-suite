/**
 * Direct Console Capture System
 * Captures all console messages, errors, warnings, and logs in real-time
 * No third-party dependencies required
 */

export interface ConsoleMessage {
  id: string;
  timestamp: number;
  level: 'log' | 'warn' | 'error' | 'info' | 'debug' | 'trace';
  message: string;
  args: any[];
  stack?: string;
  source?: {
    file?: string;
    line?: number;
    column?: number;
  };
}

class ConsoleCapture {
  private messages: ConsoleMessage[] = [];
  private maxMessages = 1000;
  private originalConsole: any = {};
  private isCapturing = false;

  constructor() {
    this.setupCapture();
  }

  private setupCapture() {
    if (this.isCapturing) return;
    
    // Store original console methods
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
      trace: console.trace
    };

    // Override console methods
    const levels: Array<'log' | 'warn' | 'error' | 'info' | 'debug' | 'trace'> = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
    levels.forEach(level => {
      (console as any)[level] = (...args: any[]) => {
        // Call original method first
        this.originalConsole[level](...args);
        
        // Capture the message
        this.captureMessage(level, args);
      };
    });

    // Capture JavaScript errors
    window.addEventListener('error', this.handleError.bind(this));
    
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

    this.isCapturing = true;
  }

  private captureMessage(level: ConsoleMessage['level'], args: any[]) {
    const message: ConsoleMessage = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      level,
      message: this.formatMessage(args),
      args: args.map(arg => this.serializeArg(arg)),
      stack: new Error().stack
    };

    this.addMessage(message);
  }

  private handleError(event: ErrorEvent) {
    const message: ConsoleMessage = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      level: 'error',
      message: `${event.message}`,
      args: [event.error],
      stack: event.error?.stack,
      source: {
        file: event.filename,
        line: event.lineno,
        column: event.colno
      }
    };

    this.addMessage(message);
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    const message: ConsoleMessage = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      level: 'error',
      message: `Unhandled Promise Rejection: ${event.reason}`,
      args: [event.reason],
      stack: event.reason?.stack || new Error().stack
    };

    this.addMessage(message);
  }

  private formatMessage(args: any[]): string {
    return args.map(arg => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
  }

  private serializeArg(arg: any): any {
    if (arg === null || arg === undefined) return arg;
    if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') return arg;
    
    if (arg instanceof Error) {
      return {
        name: arg.name,
        message: arg.message,
        stack: arg.stack
      };
    }

    if (typeof arg === 'object') {
      try {
        return JSON.parse(JSON.stringify(arg));
      } catch {
        return String(arg);
      }
    }

    return String(arg);
  }

  private addMessage(message: ConsoleMessage) {
    this.messages.push(message);
    
    // Keep only the most recent messages
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('console_capture', JSON.stringify(this.messages.slice(-100)));
    } catch (e) {
      // Handle storage quota exceeded
    }
  }

  // Public methods for retrieving messages
  public getAllMessages(): ConsoleMessage[] {
    return [...this.messages];
  }

  public getMessagesByLevel(level: ConsoleMessage['level']): ConsoleMessage[] {
    return this.messages.filter(msg => msg.level === level);
  }

  public getErrorsAndWarnings(): ConsoleMessage[] {
    return this.messages.filter(msg => msg.level === 'error' || msg.level === 'warn');
  }

  public getMessagesFromLastMinutes(minutes: number): ConsoleMessage[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.messages.filter(msg => msg.timestamp > cutoff);
  }

  public exportMessages(): string {
    return JSON.stringify(this.messages, null, 2);
  }

  public clearMessages() {
    this.messages = [];
    localStorage.removeItem('console_capture');
  }

  public getMessageStats() {
    const stats = {
      total: this.messages.length,
      errors: 0,
      warnings: 0,
      logs: 0,
      info: 0,
      debug: 0,
      trace: 0
    };

    this.messages.forEach(msg => {
      stats[msg.level === 'log' ? 'logs' : msg.level]++;
    });

    return stats;
  }

  // Restore original console (for cleanup)
  public restore() {
    if (!this.isCapturing) return;
    
    Object.keys(this.originalConsole).forEach(level => {
      (console as any)[level] = this.originalConsole[level];
    });

    window.removeEventListener('error', this.handleError.bind(this));
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    
    this.isCapturing = false;
  }
}

// Create singleton instance
export const consoleCapture = new ConsoleCapture();

// Global access for debugging
if (typeof window !== 'undefined') {
  (window as any).consoleCapture = consoleCapture;
}
