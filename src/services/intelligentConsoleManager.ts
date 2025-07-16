import { apmService, KNOWN_ERROR_PATTERNS } from './apmService';
import { logger } from '@/lib/logger';

class IntelligentConsoleManager {
  private static instance: IntelligentConsoleManager;
  private originalConsole: Console;
  private isEnabled: boolean = true;
  private filterLevel: 'none' | 'dev' | 'strict' = 'dev';

  // Patterns to filter out development environment noise
  private readonly DEV_PATTERNS = [
    /lovable\.dev/i,
    /lovable\.app/i,
    /vite.*hmr/i,
    /hot.*reload/i,
    /webpack.*hmr/i,
    /dev.*server/i,
    /live.*reload/i,
    /@vite\/client/i,
    /socket.*disconnect/i,
    /react.*devtools/i,
    /react.*refresh/i,
    /__REACT_DEVTOOLS_GLOBAL_HOOK__/i,
    /fast.*refresh/i,
    /development.*mode/i,
    /dev.*environment/i,
    /\[HMR\]/i,
    /\[vite\]/i,
    /ESLint/i,
    /TypeScript/i
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

    // Override console.error
    console.error = (...args: any[]) => {
      const message = this.formatMessage(args);
      const shouldFilter = this.shouldFilterMessage(message);

      if (!shouldFilter) {
        this.originalConsole.error(...args);
        
        // Record error in APM
        apmService.recordError({
          error_type: 'console_error',
          error_message: message,
          error_stack: this.getStackTrace(),
          component_name: this.extractComponentName(),
          severity: 'high',
          tags: { source: 'console', filtered: false }
        });
      } else {
        // Still record filtered errors for analysis
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

    // Override console.warn
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

    // Override console.log for performance tracking
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

    // Initialization logging removed to reduce console noise
  }

  private restoreOriginalConsole() {
    Object.assign(console, this.originalConsole);
    // Console restoration logging removed to reduce console noise
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

    // Check development patterns
    const matchesDevPattern = this.DEV_PATTERNS.some(pattern => pattern.test(message));
    if (matchesDevPattern) return true;

    // Check known infrastructure error patterns (these should be tracked but filtered from console)
    const isKnownInfraError = Object.entries(KNOWN_ERROR_PATTERNS).some(([type, pattern]) => {
      const found = message.includes(pattern);
      if (found) {
        // Track the known infrastructure error in APM
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
      // Look for React component names
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
      
      // Convert to standard units (ms for time, MB for memory)
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
      // Suppress this error
      apmService.recordError({
        error_type: 'console_error_suppressed',
        error_message: this.formatMessage(args),
        severity: 'low',
        tags: { source: 'console', suppressed: true }
      });
    };
    
    // Restore after next tick
    setTimeout(() => {
      console.error = originalError;
    }, 0);
  }

  getFilteredErrorCount(): number {
    // This would typically come from APM service
    return 0; // Placeholder
  }

  getOriginalConsole(): Console {
    return this.originalConsole;
  }
}

export const intelligentConsoleManager = IntelligentConsoleManager.getInstance();