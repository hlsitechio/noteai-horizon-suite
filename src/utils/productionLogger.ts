// Production-optimized logging utility to replace console.* calls
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: number;
  component?: string;
}

class ProductionLogger {
  private static instance: ProductionLogger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 100;
  private readonly isDevelopment = import.meta.env.DEV;

  static getInstance(): ProductionLogger {
    if (!ProductionLogger.instance) {
      ProductionLogger.instance = new ProductionLogger();
    }
    return ProductionLogger.instance;
  }

  private log(level: LogLevel, message: string, data?: unknown, component?: string) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now(),
      component
    };

    // Only keep recent logs to prevent memory leaks
    if (this.logs.length >= this.maxLogs) {
      this.logs.shift();
    }
    this.logs.push(entry);

    // In development, still show console output
    if (this.isDevelopment) {
      switch (level) {
        case 'debug':
          console.debug(`[${component || 'APP'}]`, message, data || '');
          break;
        case 'info':
          console.info(`[${component || 'APP'}]`, message, data || '');
          break;
        case 'warn':
          console.warn(`[${component || 'APP'}]`, message, data || '');
          break;
        case 'error':
          console.error(`[${component || 'APP'}]`, message, data || '');
          break;
      }
    } else {
      // In production, only log errors and warnings
      if (level === 'error' || level === 'warn') {
        // Send to monitoring service here
        this.sendToMonitoring(entry);
      }
    }
  }

  debug(message: string, data?: unknown, component?: string) {
    this.log('debug', message, data, component);
  }

  info(message: string, data?: unknown, component?: string) {
    this.log('info', message, data, component);
  }

  warn(message: string, data?: unknown, component?: string) {
    this.log('warn', message, data, component);
  }

  error(message: string, data?: unknown, component?: string) {
    this.log('error', message, data, component);
  }

  private sendToMonitoring(entry: LogEntry) {
    // Batch monitoring calls to prevent performance impact
    requestIdleCallback(() => {
      try {
        // In a real app, send to your monitoring service
        // e.g., Sentry, LogRocket, DataDog, etc.
        if (entry.level === 'error') {
          // Critical errors should be sent immediately
          this.sendCriticalError(entry);
        }
      } catch (error) {
        // Fallback to console if monitoring fails
        console.error('Monitoring service failed:', error);
      }
    });
  }

  private sendCriticalError(entry: LogEntry) {
    // Implementation for critical error reporting
    // This could integrate with your error tracking service
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs.length = 0;
  }

  getErrorReport(): string {
    const errors = this.logs.filter(log => log.level === 'error');
    return JSON.stringify(errors, null, 2);
  }
}

export const logger = ProductionLogger.getInstance();

// Performance-optimized component logger
export const createComponentLogger = (componentName: string) => ({
  debug: (message: string, data?: unknown) => logger.debug(message, data, componentName),
  info: (message: string, data?: unknown) => logger.info(message, data, componentName),
  warn: (message: string, data?: unknown) => logger.warn(message, data, componentName),
  error: (message: string, data?: unknown) => logger.error(message, data, componentName),
});

// Development-only console wrapper
export const devConsole = {
  log: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.error(...args);
    }
  }
};
