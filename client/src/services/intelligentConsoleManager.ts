
import { apmService, KNOWN_ERROR_PATTERNS } from './apmService';
import { logger } from '@/lib/logger';

class IntelligentConsoleManager {
  private static instance: IntelligentConsoleManager;
  private originalConsole: Console;
  private isEnabled: boolean = true;
  private filterLevel: 'none' | 'dev' | 'strict' = 'dev';

  // Enhanced patterns to filter out development environment noise and expected security blocks
  private readonly DEV_PATTERNS = [
    // Development environment patterns
    /lovable\.dev/i,
    /lovable\.app/i,
    /vite.*hmr/i,
    /hot.*reload/i,
    /webpack.*hmr/i,
    /dev.*server/i,
    /live.*reload/i,
    /@vite\/client/i,
    /socket.*disconnect/i,
    /websocket.*connection.*failed/i,
    /websocket.*close.*event/i,
    /cors.*policy.*blocked/i,
    /_sandbox\/dev-server/i,
    /failed.*to.*load.*resource.*net::ERR_FAILED/i,
    /access.*control.*allow.*origin/i,
    /react.*devtools/i,
    /react.*refresh/i,
    /__REACT_DEVTOOLS_GLOBAL_HOOK__/i,
    /fast.*refresh/i,
    /development.*mode/i,
    /dev.*environment/i,
    /\[HMR\]/i,
    /\[vite\]/i,
    /ESLint/i,
    /TypeScript/i,
    
    // Security patterns - these are EXPECTED blocks, so suppress the console noise
    /SECURITY.*UTS.*tracking/i,
    /Ultra-aggressive.*fingerprinting/i,
    /UTS.*tracking.*system.*neutralized/i,
    /fingerprinting.*blocker.*activated/i,
    
    // Network blocking patterns - these are WORKING AS INTENDED
    /Failed to load resource.*net::ERR_BLOCKED_BY_CLIENT/i,
    /ERR_BLOCKED_BY_CLIENT/i,
    /Failed to load resource.*connect\.facebook\.net/i,
    /Failed to load resource.*fbevents/i,
    /Failed to load resource.*fbcdn\.net/i,
    /Failed to load resource.*googleads/i,
    /Failed to load resource.*doubleclick\.net/i,
    /Failed to load resource.*googlesyndication/i,
    /Failed to load resource.*google-analytics/i,
    
    // UTS tracking messages - these show our blocking is working
    /\[UTS\].*\[fp\]/i,
    /\[UTS\].*\[gusid\]/i,
    /\[UTS\].*\[pc\]/i,
    /\[UTS\].*\[_fbp_c\]/i,
    /\[UTS\].*\[pcu\]/i,
    /UTS.*fp.*init/i,
    /UTS.*fingerprint/i,
    
    // Permissions policy warnings from external sources (expected)
    /Unrecognized feature.*vr/i,
    /Unrecognized feature.*battery/i,
    /Permissions-Policy.*vr/i,
    /Permissions-Policy.*battery/i,
    
    // Preload warnings - these are performance warnings, not functional errors
    /resource.*was preloaded.*but not used/i,
    /Please make sure it has an appropriate.*as.*value/i,
    /preloaded intentionally/i,
    
    // Browser extension errors
    /The message port closed before a response was received/i,
    /content\.js.*Uncaught/i,
    /chrome-extension/i,
    /moz-extension/i,
    /safari-extension/i,
    
    // Tracking script detection (these are good - means our blocking works)
    /facebook\.com\/tr/i,
    /connect\.facebook\.net/i,
    /fbevents/i,
    /fbcdn\.net/i
  ];

  // Strict patterns for additional filtering
  private readonly STRICT_PATTERNS = [
    /react/i,
    /component/i,
    /hook/i,
    /render/i,
    /virtual.*dom/i,
    /fiber/i,
    /reconciler/i
  ];

  constructor() {
    this.originalConsole = { ...console };
    this.initializeConsoleOverrides();
  }

  static getInstance(): IntelligentConsoleManager {
    if (!IntelligentConsoleManager.instance) {
      IntelligentConsoleManager.instance = new IntelligentConsoleManager();
    }
    return IntelligentConsoleManager.instance;
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.restoreOriginalConsole();
    } else {
      this.initializeConsoleOverrides();
    }
  }

  setFilterLevel(level: 'none' | 'dev' | 'strict') {
    this.filterLevel = level;
  }

  private initializeConsoleOverrides() {
    if (!this.isEnabled) return;

    // Override console.error with enhanced filtering
    console.error = (...args: any[]) => {
      const message = this.formatMessage(args);
      const shouldFilter = this.shouldFilterMessage(message);

      if (!shouldFilter) {
        this.originalConsole.error(...args);
        
        // Record error in APM only if it's a real error
        apmService.recordError({
          error_type: 'console_error',
          error_message: message,
          error_stack: this.getStackTrace(),
          component_name: this.extractComponentName(),
          severity: 'high',
          tags: { source: 'console', filtered: false }
        });
      } else {
        // Record filtered errors for debugging purposes but with low severity
        apmService.recordError({
          error_type: 'console_error_filtered',
          error_message: message,
          error_stack: this.getStackTrace(),
          component_name: this.extractComponentName(),
          severity: 'low',
          tags: { source: 'console', filtered: true }
        });
      }
    };

    // Override console.warn with enhanced filtering
    console.warn = (...args: any[]) => {
      const message = this.formatMessage(args);
      const shouldFilter = this.shouldFilterMessage(message);

      if (!shouldFilter) {
        this.originalConsole.warn(...args);
        
        apmService.recordError({
          error_type: 'console_warning',
          error_message: message,
          component_name: this.extractComponentName(),
          severity: 'medium',
          tags: { source: 'console', filtered: false }
        });
      }
    };

    // Override console.log with filtering for security messages
    console.log = (...args: any[]) => {
      const message = this.formatMessage(args);
      const shouldFilter = this.shouldFilterMessage(message);

      if (!shouldFilter) {
        this.originalConsole.log(...args);
      }

      // Track performance-related logs
      if (message.includes('performance') || message.includes('timing')) {
        const value = this.extractNumericValue(message);
        if (value !== null) {
          apmService.recordMetric({
            metric_type: 'performance',
            metric_name: 'console_performance',
            metric_value: value,
            tags: { source: 'console', message: message.substring(0, 100) }
          });
        }
      }
    };

    // Override console.info to filter info messages
    console.info = (...args: any[]) => {
      const message = this.formatMessage(args);
      const shouldFilter = this.shouldFilterMessage(message);

      if (!shouldFilter) {
        this.originalConsole.info(...args);
      }
    };

    // Show one-time initialization message
    this.originalConsole.log('🔧 Enhanced console filtering active - blocking noise, showing real issues');
  }

  private restoreOriginalConsole() {
    Object.assign(console, this.originalConsole);
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

  private shouldFilterMessage(message: string): boolean {
    if (this.filterLevel === 'none') return false;

    // Check development and security patterns
    const matchesDevPattern = this.DEV_PATTERNS.some(pattern => pattern.test(message));
    if (matchesDevPattern) return true;

    // Check known infrastructure error patterns
    const isKnownInfraError = Object.entries(KNOWN_ERROR_PATTERNS).some(([type, pattern]) => {
      const found = message.includes(pattern);
      if (found) {
        apmService.recordKnownInfrastructureError(message, type.toLowerCase());
      }
      return found;
    });
    
    if (isKnownInfraError) return true;

    // Check strict patterns if in strict mode
    if (this.filterLevel === 'strict') {
      const matchesStrictPattern = this.STRICT_PATTERNS.some(pattern => pattern.test(message));
      if (matchesStrictPattern) return true;
    }

    return false;
  }

  private getStackTrace(): string {
    try {
      throw new Error();
    } catch (e) {
      return (e as Error).stack || '';
    }
  }

  private extractComponentName(): string {
    const stack = this.getStackTrace();
    const lines = stack.split('\n');
    
    for (const line of lines) {
      const componentMatch = line.match(/at (\w+Component|\w+\.tsx|\w+\.jsx)/);
      if (componentMatch) {
        return componentMatch[1];
      }
    }
    
    return 'unknown';
  }

  private extractNumericValue(message: string): number | null {
    const match = message.match(/(\d+(?:\.\d+)?)\s*(ms|s|MB|KB)/);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2];
      
      switch (unit) {
        case 's': return value * 1000;
        case 'KB': return value / 1024;
        default: return value;
      }
    }
    return null;
  }

  // Public methods for manual control
  suppressNextError() {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      apmService.recordError({
        error_type: 'console_error_suppressed',
        error_message: this.formatMessage(args),
        severity: 'low',
        tags: { source: 'console', suppressed: true }
      });
    };
    
    setTimeout(() => {
      console.error = originalError;
    }, 0);
  }

  getFilteredErrorCount(): number {
    return 0; // Placeholder
  }

  getOriginalConsole(): Console {
    return this.originalConsole;
  }
}

export const intelligentConsoleManager = IntelligentConsoleManager.getInstance();
