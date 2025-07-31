/**
 * Unified Console Management System
 * Replaces all conflicting console override systems with a single, coherent approach
 */

// Development noise patterns to filter
const DEV_NOISE_PATTERNS = [
  // Development environment
  /lovable\.dev/i,
  /lovable\.app/i,
  /lovableproject\.com/i,
  /lovable-api\.com/i,
  /vite.*hmr/i,
  /\[vite\]/i,
  /\[HMR\]/i,
  /hot.*reload/i,
  /dev.*server/i,
  /_sandbox\/dev-server/i,
  /websocket.*connection.*failed/i,
  /failed.*to.*load.*resource.*net::ERR_FAILED/i,
  /cors.*policy.*blocked/i,
  /access.*control.*allow.*origin/i,
  /net::ERR_HTTP2_PROTOCOL_ERROR/i,
  /manifest\.json.*404/i,
  
  // Security blocks (working as intended)
  /SECURITY.*UTS.*tracking/i,
  /fingerprinting.*blocker.*activated/i,
  /UTS.*tracking.*system.*neutralized/i,
  /ERR_BLOCKED_BY_CLIENT/i,
  /Failed to load resource.*fbevents/i,
  /Failed to load resource.*googleads/i,
  /Failed to load resource.*doubleclick\.net/i,
  /connect\.facebook\.net/i,
  
  // Browser extension noise
  /message port closed before a response/i,
  /chrome-extension/i,
  /moz-extension/i,
  /message port closed/i,
  
  // Preload warnings
  /resource.*was preloaded.*but not used/i,
  /Please make sure it has an appropriate.*as.*value/i,
];

// Important errors that should always show
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
  /Internal server error/i
];

class UnifiedConsoleManager {
  private originalConsole: Console;
  private isActive = false;

  constructor() {
    this.originalConsole = { ...console };
  }

  public initialize() {
    if (this.isActive || import.meta.env.PROD) return;

    // Override console methods with unified filtering
    console.log = (...args: any[]) => {
      const message = this.formatMessage(args);
      if (!this.shouldFilter(message)) {
        this.originalConsole.log(...args);
      }
    };

    console.info = (...args: any[]) => {
      const message = this.formatMessage(args);
      if (!this.shouldFilter(message)) {
        this.originalConsole.info(...args);
      }
    };

    console.warn = (...args: any[]) => {
      const message = this.formatMessage(args);
      if (this.isImportant(message) || !this.shouldFilter(message)) {
        this.originalConsole.warn('⚠️', ...args);
      }
    };

    console.error = (...args: any[]) => {
      const message = this.formatMessage(args);
      if (this.isImportant(message) || !this.shouldFilter(message)) {
        this.originalConsole.error('🚨', ...args);
      }
    };

    console.debug = (...args: any[]) => {
      const message = this.formatMessage(args);
      if (!this.shouldFilter(message)) {
        this.originalConsole.debug(...args);
      }
    };

    this.isActive = true;
    this.originalConsole.log('🔧 Unified console management active');
  }

  public restore() {
    Object.assign(console, this.originalConsole);
    this.isActive = false;
  }

  private formatMessage(args: any[]): string {
    return args
      .map(arg => {
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) return arg.message;
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      })
      .join(' ');
  }

  private shouldFilter(message: string): boolean {
    return DEV_NOISE_PATTERNS.some(pattern => pattern.test(message));
  }

  private isImportant(message: string): boolean {
    return IMPORTANT_PATTERNS.some(pattern => pattern.test(message));
  }
}

// Global instance
export const unifiedConsoleManager = new UnifiedConsoleManager();

// Developer utilities
(window as any).__restoreConsole = () => unifiedConsoleManager.restore();
(window as any).__initConsole = () => unifiedConsoleManager.initialize();