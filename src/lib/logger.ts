/**
 * Production-safe logging utility
 * Logs are removed in production builds via Vite configuration
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDev = import.meta.env.DEV;
  
  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDev && level === 'debug') return;
    
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] ${level.toUpperCase()}:`;
    
    if (context) {
      console[level](prefix, message, context);
    } else {
      console[level](prefix, message);
    }
  }
  
  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }
  
  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }
  
  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }
  
  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }
  
  // Performance logging
  time(label: string) {
    if (this.isDev) {
      console.time(label);
    }
  }
  
  timeEnd(label: string) {
    if (this.isDev) {
      console.timeEnd(label);
    }
  }
}

export const logger = new Logger();

// Performance measurement utility
export class PerformanceMonitor {
  private static measurements = new Map<string, number>();
  
  static start(label: string) {
    this.measurements.set(label, performance.now());
  }
  
  static end(label: string): number {
    const start = this.measurements.get(label);
    if (!start) return 0;
    
    const duration = performance.now() - start;
    this.measurements.delete(label);
    
    if (import.meta.env.DEV) {
      logger.debug(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
    }
    
    return duration;
  }
  
  static measure<T>(label: string, fn: () => T): T {
    this.start(label);
    try {
      return fn();
    } finally {
      this.end(label);
    }
  }
  
  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      return await fn();
    } finally {
      this.end(label);
    }
  }
}