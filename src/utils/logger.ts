/**
 * Centralized logging utility with environment-based controls
 * Reduces console noise while maintaining debugging capabilities
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

class Logger {
  private logLevel: LogLevel;
  private enabledModules: Set<string>;
  
  constructor() {
    // Default to NONE level to eliminate all logs unless explicitly enabled
    this.logLevel = import.meta.env.DEV ? LogLevel.ERROR : LogLevel.NONE;
    
    // Only enable modules if explicitly requested
    const enabledModules = import.meta.env.VITE_DEBUG_MODULES?.split(',') || [];
    this.enabledModules = new Set(enabledModules.map(m => m.trim()));
    
    // Override log level if specified in environment
    const envLogLevel = import.meta.env.VITE_LOG_LEVEL;
    if (envLogLevel && envLogLevel in LogLevel) {
      this.logLevel = LogLevel[envLogLevel as keyof typeof LogLevel];
    }
  }

  private shouldLog(level: LogLevel, module?: string): boolean {
    // Only allow a specific welcome message, block everything else
    return false;
  }

  private formatMessage(level: string, module: string | undefined, message: string, ...args: unknown[]): unknown[] {
    const timestamp = new Date().toISOString();
    const modulePrefix = module ? `[${module}]` : '';
    const prefix = `${timestamp} ${level}:${modulePrefix}`;
    
    return [prefix, message, ...args];
  }

  debug(message: string, ...args: unknown[]): void;
  debug(module: string, message: string, ...args: unknown[]): void;
  debug(moduleOrMessage: string, messageOrArg?: string | unknown, ...args: unknown[]): void {
    if (typeof messageOrArg === 'string') {
      // Called with module
      const module = moduleOrMessage;
      const message = messageOrArg;
      if (this.shouldLog(LogLevel.DEBUG, module)) {
        console.debug(...this.formatMessage('DEBUG', module, message, ...args));
      }
    } else {
      // Called without module
      const message = moduleOrMessage;
      if (this.shouldLog(LogLevel.DEBUG)) {
        console.debug(...this.formatMessage('DEBUG', undefined, message, messageOrArg, ...args));
      }
    }
  }

  info(message: string, ...args: unknown[]): void;
  info(module: string, message: string, ...args: unknown[]): void;
  info(moduleOrMessage: string, messageOrArg?: string | unknown, ...args: unknown[]): void {
    if (typeof messageOrArg === 'string') {
      const module = moduleOrMessage;
      const message = messageOrArg;
      if (this.shouldLog(LogLevel.INFO, module)) {
        console.info(...this.formatMessage('INFO', module, message, ...args));
      }
    } else {
      const message = moduleOrMessage;
      if (this.shouldLog(LogLevel.INFO)) {
        console.info(...this.formatMessage('INFO', undefined, message, messageOrArg, ...args));
      }
    }
  }

  warn(message: string, ...args: unknown[]): void;
  warn(module: string, message: string, ...args: unknown[]): void;
  warn(moduleOrMessage: string, messageOrArg?: string | unknown, ...args: unknown[]): void {
    if (typeof messageOrArg === 'string') {
      const module = moduleOrMessage;
      const message = messageOrArg;
      if (this.shouldLog(LogLevel.WARN, module)) {
        console.warn(...this.formatMessage('WARN', module, message, ...args));
      }
    } else {
      const message = moduleOrMessage;
      if (this.shouldLog(LogLevel.WARN)) {
        console.warn(...this.formatMessage('WARN', undefined, message, messageOrArg, ...args));
      }
    }
  }

  error(message: string, ...args: unknown[]): void;
  error(module: string, message: string, ...args: unknown[]): void;
  error(moduleOrMessage: string, messageOrArg?: string | unknown, ...args: unknown[]): void {
    if (typeof messageOrArg === 'string') {
      const module = moduleOrMessage;
      const message = messageOrArg;
      if (this.shouldLog(LogLevel.ERROR, module)) {
        console.error(...this.formatMessage('ERROR', module, message, ...args));
      }
    } else {
      const message = moduleOrMessage;
      if (this.shouldLog(LogLevel.ERROR)) {
        console.error(...this.formatMessage('ERROR', undefined, message, messageOrArg, ...args));
      }
    }
  }

  // Convenience methods for common patterns
  auth = {
    debug: (message: string, ...args: unknown[]) => this.debug('AUTH', message, ...args),
    info: (message: string, ...args: unknown[]) => this.info('AUTH', message, ...args),
    warn: (message: string, ...args: unknown[]) => this.warn('AUTH', message, ...args),
    error: (message: string, ...args: unknown[]) => this.error('AUTH', message, ...args),
  };

  notes = {
    debug: (message: string, ...args: unknown[]) => this.debug('NOTES', message, ...args),
    info: (message: string, ...args: unknown[]) => this.info('NOTES', message, ...args),
    warn: (message: string, ...args: unknown[]) => this.warn('NOTES', message, ...args),
    error: (message: string, ...args: unknown[]) => this.error('NOTES', message, ...args),
  };

  projects = {
    debug: (message: string, ...args: unknown[]) => this.debug('PROJECTS', message, ...args),
    info: (message: string, ...args: unknown[]) => this.info('PROJECTS', message, ...args),
    warn: (message: string, ...args: unknown[]) => this.warn('PROJECTS', message, ...args),
    error: (message: string, ...args: unknown[]) => this.error('PROJECTS', message, ...args),
  };

  realtime = {
    debug: (message: string, ...args: unknown[]) => this.debug('REALTIME', message, ...args),
    info: (message: string, ...args: unknown[]) => this.info('REALTIME', message, ...args),
    warn: (message: string, ...args: unknown[]) => this.warn('REALTIME', message, ...args),
    error: (message: string, ...args: unknown[]) => this.error('REALTIME', message, ...args),
  };

  floating = {
    debug: (message: string, ...args: unknown[]) => this.debug('FLOATING', message, ...args),
    info: (message: string, ...args: unknown[]) => this.info('FLOATING', message, ...args),
    warn: (message: string, ...args: unknown[]) => this.warn('FLOATING', message, ...args),
    error: (message: string, ...args: unknown[]) => this.error('FLOATING', message, ...args),
  };
}

// Export singleton instance
export const logger = new Logger();

// Backward compatibility exports for easy migration
export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  auth: logger.auth,
  notes: logger.notes,
  projects: logger.projects,
  realtime: logger.realtime,
  floating: logger.floating,
};