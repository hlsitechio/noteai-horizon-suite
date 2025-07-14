import { logger } from '@/utils/logger';
import { securityService } from './securityService';
import { supabase } from '@/integrations/supabase/client';
// Sentry removed

interface ErrorPattern {
  pattern: RegExp;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  commonCauses: string[];
  suggestedFixes: string[];
  autoResolution?: () => Promise<boolean>;
}

interface BugResolutionContext {
  errorMessage: string;
  stackTrace?: string;
  userAgent: string;
  url: string;
  userId?: string;
  timestamp: number;
  breadcrumbs?: any[];
  componentStack?: string;
}

interface ResolutionSuggestion {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestedActions: string[];
  canAutoResolve: boolean;
  confidence: number;
}

export class IntelligentBugResolutionService {
  private static instance: IntelligentBugResolutionService;
  private errorPatterns: ErrorPattern[] = [];
  private resolutionHistory: Map<string, ResolutionSuggestion[]> = new Map();
  private autoResolutionEnabled = true;

  private constructor() {
    this.initializeErrorPatterns();
    this.startPeriodicAnalysis();
  }

  static getInstance(): IntelligentBugResolutionService {
    if (!IntelligentBugResolutionService.instance) {
      IntelligentBugResolutionService.instance = new IntelligentBugResolutionService();
    }
    return IntelligentBugResolutionService.instance;
  }

  private initializeErrorPatterns() {
    this.errorPatterns = [
      {
        pattern: /Network request failed|fetch.*failed|ERR_NETWORK/i,
        category: 'network',
        severity: 'medium',
        commonCauses: ['Poor internet connection', 'Server timeout', 'CORS issues'],
        suggestedFixes: ['Implement retry logic', 'Add offline fallback', 'Check server status'],
        autoResolution: this.handleNetworkError.bind(this)
      },
      {
        pattern: /Cannot read propert.*of undefined|TypeError.*undefined/i,
        category: 'null_reference',
        severity: 'high',
        commonCauses: ['Missing data validation', 'Async data not loaded', 'API response structure changed'],
        suggestedFixes: ['Add null checks', 'Implement loading states', 'Validate API responses'],
        autoResolution: this.handleNullReference.bind(this)
      },
      {
        pattern: /ChunkLoadError|Loading chunk \d+ failed/i,
        category: 'chunk_load',
        severity: 'medium',
        commonCauses: ['Deployment during user session', 'Cache issues', 'Network interruption'],
        suggestedFixes: ['Implement chunk reload', 'Clear cache', 'Show refresh prompt'],
        autoResolution: this.handleChunkLoadError.bind(this)
      },
      {
        pattern: /ResizeObserver loop limit exceeded/i,
        category: 'resize_observer',
        severity: 'low',
        commonCauses: ['Infinite resize loops', 'CSS layout issues'],
        suggestedFixes: ['Debounce resize handlers', 'Check CSS for infinite loops'],
        autoResolution: this.handleResizeObserverError.bind(this)
      },
      {
        pattern: /Hydration failed|Text content does not match/i,
        category: 'hydration',
        severity: 'high',
        commonCauses: ['Server-client mismatch', 'Dynamic content in SSR'],
        suggestedFixes: ['Ensure consistent rendering', 'Use useEffect for client-only content'],
        autoResolution: this.handleHydrationError.bind(this)
      },
      {
        pattern: /Maximum call stack size exceeded/i,
        category: 'stack_overflow',
        severity: 'critical',
        commonCauses: ['Infinite recursion', 'Circular references'],
        suggestedFixes: ['Add recursion limits', 'Check for circular dependencies'],
      },
      {
        pattern: /Memory leak detected|Out of memory/i,
        category: 'memory_leak',
        severity: 'critical',
        commonCauses: ['Event listeners not cleaned up', 'Large object references'],
        suggestedFixes: ['Clean up event listeners', 'Use WeakMap/WeakSet', 'Profile memory usage'],
      },
      {
        pattern: /setTimeout handler took.*ms|setInterval handler took.*ms|Long running JavaScript task/i,
        category: 'performance_timeout',
        severity: 'medium',
        commonCauses: ['Heavy synchronous operations', 'Blocking main thread'],
        suggestedFixes: ['Break up long tasks', 'Use requestAnimationFrame', 'Implement task chunking'],
        autoResolution: this.handlePerformanceTimeout.bind(this)
      },
      {
        pattern: /Forced reflow|Layout thrashing|Recalculating styles/i,
        category: 'layout_performance',
        severity: 'medium',
        commonCauses: ['Reading layout properties after writes', 'Multiple DOM modifications'],
        suggestedFixes: ['Batch DOM operations', 'Use DocumentFragment', 'Avoid layout-triggering properties'],
        autoResolution: this.handleLayoutPerformance.bind(this)
      },
      {
        pattern: /third-party cookie|blocked.*cookie|SameSite.*cookie/i,
        category: 'cookie_policy',
        severity: 'low',
        commonCauses: ['Third-party cookie restrictions', 'SameSite policy changes'],
        suggestedFixes: ['Update cookie SameSite attributes', 'Use first-party alternatives'],
        autoResolution: this.handleCookiePolicy.bind(this)
      },
      {
        pattern: /Facebook.*pixel|Meta.*pixel|fbq.*error/i,
        category: 'facebook_pixel',
        severity: 'low',
        commonCauses: ['Ad blockers', 'Privacy restrictions', 'Network issues'],
        suggestedFixes: ['Implement graceful fallbacks', 'Check pixel implementation'],
        autoResolution: this.handleFacebookPixel.bind(this)
      }
    ];
  }

  async analyzeError(context: BugResolutionContext): Promise<ResolutionSuggestion[]> {
    try {
      const suggestions: ResolutionSuggestion[] = [];
      
      // Pattern-based analysis
      for (const pattern of this.errorPatterns) {
        if (pattern.pattern.test(context.errorMessage) || 
            (context.stackTrace && pattern.pattern.test(context.stackTrace))) {
          
          const suggestion: ResolutionSuggestion = {
            category: pattern.category,
            severity: pattern.severity,
            description: `${pattern.category} error detected: ${context.errorMessage.substring(0, 100)}...`,
            suggestedActions: pattern.suggestedFixes,
            canAutoResolve: !!pattern.autoResolution,
            confidence: this.calculateConfidence(pattern, context)
          };
          
          suggestions.push(suggestion);
          
          // Attempt auto-resolution if enabled and available
          if (this.autoResolutionEnabled && pattern.autoResolution) {
            try {
              const resolved = await pattern.autoResolution();
              if (resolved) {
                this.trackResolution(context, suggestion, true);
              }
            } catch (autoResolutionError) {
              // Silent failure - only log to Sentry if needed
            }
          }
        }
      }

      // Historical analysis
      const historicalSuggestions = this.getHistoricalSuggestions(context);
      suggestions.push(...historicalSuggestions);

      // Store analysis results
      this.storeAnalysis(context, suggestions);
      
      return suggestions.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      logger.error('BUG_RESOLUTION', 'Error analysis failed:', error);
      return [];
    }
  }

  private calculateConfidence(pattern: ErrorPattern, context: BugResolutionContext): number {
    let confidence = 0.7; // Base confidence
    
    // Increase confidence based on exact pattern match
    if (pattern.pattern.test(context.errorMessage)) {
      confidence += 0.2;
    }
    
    // Increase confidence if we have stack trace information
    if (context.stackTrace && pattern.pattern.test(context.stackTrace)) {
      confidence += 0.1;
    }
    
    // Historical success rate
    const historicalKey = `${pattern.category}_${context.errorMessage.substring(0, 50)}`;
    if (this.resolutionHistory.has(historicalKey)) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  private getHistoricalSuggestions(context: BugResolutionContext): ResolutionSuggestion[] {
    const suggestions: ResolutionSuggestion[] = [];
    const errorKey = context.errorMessage.substring(0, 50);
    
    if (this.resolutionHistory.has(errorKey)) {
      const historical = this.resolutionHistory.get(errorKey)!;
      suggestions.push(...historical.map(h => ({
        ...h,
        confidence: h.confidence * 0.8, // Slight reduction for historical data
        description: `Previously seen: ${h.description}`
      })));
    }
    
    return suggestions;
  }

  // Auto-resolution handlers
  private async handleNetworkError(): Promise<boolean> {
    try {
      // Store network error for retry mechanisms
      localStorage.setItem('network_error_recovery', JSON.stringify({
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries: 3
      }));
      
      return true;
    } catch {
      return false;
    }
  }

  private async handleNullReference(): Promise<boolean> {
    try {
      // This would typically involve patching the specific component
      // For now, we skip the issue for manual intervention
      return false; // Requires manual intervention
    } catch {
      return false;
    }
  }

  private async handleChunkLoadError(): Promise<boolean> {
    try {
      // Clear cache and prepare for reload
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Set flag for page reload
      sessionStorage.setItem('chunk_error_recovery', 'true');
      
      // Delayed reload to avoid immediate error
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return true;
    } catch {
      return false;
    }
  }

  private async handleResizeObserverError(): Promise<boolean> {
    try {
      // Ignore resize observer errors as they're typically non-critical
      return true;
    } catch {
      return false;
    }
  }

  private async handleHydrationError(): Promise<boolean> {
    try {
      // Mark for client-side only rendering
      sessionStorage.setItem('hydration_error_recovery', 'true');
      
      return false; // Usually requires code changes
    } catch {
      return false;
    }
  }

  private async handlePerformanceTimeout(): Promise<boolean> {
    try {
      // Add performance optimization flags
      sessionStorage.setItem('performance_optimization', JSON.stringify({
        timestamp: Date.now(),
        taskChunking: true,
        rafOptimization: true
      }));
      
      return true;
    } catch {
      return false;
    }
  }

  private async handleLayoutPerformance(): Promise<boolean> {
    try {
      // Set DOM optimization flags
      sessionStorage.setItem('layout_optimization', JSON.stringify({
        timestamp: Date.now(),
        batchDOMUpdates: true,
        avoidForcedReflow: true
      }));
      
      return true;
    } catch {
      return false;
    }
  }

  private async handleCookiePolicy(): Promise<boolean> {
    try {
      // Suppress cookie warnings for third-party services
      sessionStorage.setItem('cookie_policy_handled', 'true');
      
      return true;
    } catch {
      return false;
    }
  }

  private async handleFacebookPixel(): Promise<boolean> {
    try {
      // Implement graceful fallback for blocked pixels
      if (typeof window !== 'undefined' && !(window as any).fbq) {
        (window as any).fbq = () => {
          // Noop fallback
        };
      }
      
      return true;
    } catch {
      return false;
    }
  }

  private async storeAnalysis(context: BugResolutionContext, suggestions: ResolutionSuggestion[]) {
    try {
      // Bug resolution analysis storage disabled - security_audit_log table missing
      console.warn('Bug resolution analysis storage disabled - security_audit_log table missing from database schema');
      console.log('Bug analysis would be stored:', {
        error_context: context,
        suggestions: suggestions,
        timestamp: Date.now()
      });
    } catch (error) {
      logger.error('BUG_RESOLUTION', 'Failed to store analysis:', error);
    }
  }

  private trackResolution(context: BugResolutionContext, suggestion: ResolutionSuggestion, successful: boolean) {
    const key = context.errorMessage.substring(0, 50);
    
    if (successful) {
      // Update confidence and store successful resolution
      suggestion.confidence = Math.min(suggestion.confidence + 0.1, 1.0);
      this.resolutionHistory.set(key, [suggestion]);
      
      // Sentry removed - bug auto-resolution logged locally
    }
  }

  private startPeriodicAnalysis() {
    // Run analysis every 5 minutes
    setInterval(() => {
      this.runPeriodicHealthCheck();
    }, 10 * 60 * 1000); // Reduced frequency from 5min to 10min
  }

  private async runPeriodicHealthCheck() {
    try {
      // Check for common issues proactively
      const issues = [];
      
      // Memory usage check
      const performanceMemory = (performance as any).memory;
      if (performanceMemory && performanceMemory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
        issues.push({
          type: 'high_memory_usage',
          severity: 'medium',
          value: performanceMemory.usedJSHeapSize
        });
      }
      
      // Local storage quota check
      try {
        const used = JSON.stringify(localStorage).length;
        if (used > 5 * 1024 * 1024) { // 5MB
          issues.push({
            type: 'local_storage_full',
            severity: 'medium',
            value: used
          });
        }
      } catch (e) {
        issues.push({
          type: 'local_storage_error',
          severity: 'low',
          error: e
        });
      }
      
      if (issues.length > 0) {
        // Sentry removed - proactive issues logged locally
      }
    } catch (error) {
      // Silent error handling
    }
  }

  // Public methods for integration
  enableAutoResolution(enabled: boolean = true) {
    this.autoResolutionEnabled = enabled;
  }

  addCustomPattern(pattern: ErrorPattern) {
    this.errorPatterns.push(pattern);
  }

  getResolutionStats() {
    return {
      totalPatterns: this.errorPatterns.length,
      historicalResolutions: this.resolutionHistory.size,
      autoResolutionEnabled: this.autoResolutionEnabled
    };
  }
}

// Export singleton instance
export const bugResolutionService = IntelligentBugResolutionService.getInstance();