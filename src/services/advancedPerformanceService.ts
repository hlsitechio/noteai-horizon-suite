import { PerformanceService } from './performanceService';
import { globalPerformanceMonitor } from '@/utils/advancedMemoryCleanup';

export class AdvancedPerformanceService extends PerformanceService {
  private static memoryMonitor: {
    baseline: number;
    peak: number;
    current: number;
    samples: number[];
  } = {
    baseline: 0,
    peak: 0,
    current: 0,
    samples: [],
  };

  private static componentRenderTimes: Map<string, number[]> = new Map();
  private static apiCallTimes: Map<string, { duration: number; status: number; timestamp: number }[]> = new Map();

  static initialize() {
    // Call parent initialization
    super.initialize();
    
    // Initialize advanced monitoring
    this.initializeMemoryMonitoring();
    this.initializeNetworkMonitoring();
    this.initializeRenderMonitoring();
    
    console.log('AdvancedPerformanceService initialized');
  }

  private static initializeMemoryMonitoring() {
    // Disable memory monitoring to eliminate setTimeout violations
    if (typeof (performance as any).memory !== 'undefined') {
      const memInfo = (performance as any).memory;
      this.memoryMonitor.baseline = memInfo.usedJSHeapSize;
      this.memoryMonitor.current = memInfo.usedJSHeapSize;
      this.memoryMonitor.peak = memInfo.usedJSHeapSize;
      // No interval monitoring to prevent violations
    }
  }

  private static initializeNetworkMonitoring() {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const startTime = performance.now();
      const url = typeof input === 'string' ? input : input.toString();
      
      try {
        const response = await originalFetch(input, init);
        const duration = performance.now() - startTime;
        
        this.recordApiCall(url, duration, response.status);
        
        // Warn on slow API calls
        if (duration > 5000) {
          console.warn(`Slow API call detected: ${url} took ${duration.toFixed(2)}ms`);
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.recordApiCall(url, duration, 0); // 0 status for failed requests
        throw error;
      }
    };
  }

  private static initializeRenderMonitoring() {
    // This would typically be implemented with React DevTools Profiler
    // For now, we'll use a simple mutation observer to detect DOM changes
    if (typeof MutationObserver !== 'undefined') {
      const renderObserver = new MutationObserver((mutations) => {
        const renderTime = performance.now();
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            globalPerformanceMonitor.recordMetric('domMutation', renderTime);
          }
        });
      });

      renderObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Clean up observer when page unloads using modern event
      window.addEventListener('pagehide', () => {
        renderObserver.disconnect();
      });
    }
  }

  private static recordApiCall(url: string, duration: number, status: number) {
    if (!this.apiCallTimes.has(url)) {
      this.apiCallTimes.set(url, []);
    }
    
    const calls = this.apiCallTimes.get(url)!;
    calls.push({ duration, status, timestamp: Date.now() });
    
    // Keep only last 50 calls per endpoint
    if (calls.length > 50) {
      calls.shift();
    }
  }

  static recordComponentRender(componentName: string, renderTime: number) {
    if (!this.componentRenderTimes.has(componentName)) {
      this.componentRenderTimes.set(componentName, []);
    }
    
    const times = this.componentRenderTimes.get(componentName)!;
    times.push(renderTime);
    
    // Keep only last 50 render times per component
    if (times.length > 50) {
      times.shift();
    }

    // Warn on slow renders
    if (renderTime > 16) { // Longer than one frame at 60fps
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  static getAdvancedMetrics() {
    const baseMetrics = super.getMetrics();
    
    return {
      ...baseMetrics,
      memory: this.memoryMonitor,
      componentRenders: this.getComponentRenderStats(),
      apiCalls: this.getApiCallStats(),
      performanceMonitor: globalPerformanceMonitor.getAllMetrics(),
    };
  }

  private static getComponentRenderStats() {
    const stats: Record<string, { avg: number; max: number; count: number }> = {};
    
    for (const [component, times] of this.componentRenderTimes) {
      if (times.length > 0) {
        stats[component] = {
          avg: times.reduce((sum, time) => sum + time, 0) / times.length,
          max: Math.max(...times),
          count: times.length,
        };
      }
    }
    
    return stats;
  }

  private static getApiCallStats() {
    const stats: Record<string, { 
      avg: number; 
      max: number; 
      count: number; 
      successRate: number; 
      recentFailures: number;
    }> = {};
    
    for (const [url, calls] of this.apiCallTimes) {
      if (calls.length > 0) {
        const durations = calls.map(call => call.duration);
        const successCount = calls.filter(call => call.status >= 200 && call.status < 300).length;
        const recentFailures = calls.filter(call => 
          call.status === 0 || call.status >= 400
        ).length;
        
        stats[url] = {
          avg: durations.reduce((sum, duration) => sum + duration, 0) / durations.length,
          max: Math.max(...durations),
          count: calls.length,
          successRate: successCount / calls.length,
          recentFailures,
        };
      }
    }
    
    return stats;
  }

  static cleanup() {
    super.cleanup();
    globalPerformanceMonitor.cleanup();
    this.componentRenderTimes.clear();
    this.apiCallTimes.clear();
  }

  // Utility method to trigger memory cleanup
  static triggerGarbageCollection() {
    if (typeof window !== 'undefined' && 'gc' in window) {
      try {
        (window as any).gc();
        console.log('Manual garbage collection triggered');
      } catch (error) {
        console.warn('Manual garbage collection failed:', error);
      }
    }
  }

  // Method to analyze and report performance issues
  static analyzePerformance(): {
    issues: string[];
    recommendations: string[];
    score: number;
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    const metrics = this.getAdvancedMetrics();

    // Check memory usage
    if (metrics.memory.current > metrics.memory.baseline * 2) {
      issues.push('High memory usage detected');
      recommendations.push('Consider implementing memory cleanup strategies');
      score -= 20;
    }

    // Check component render performance
    const slowComponents = Object.entries(metrics.componentRenders)
      .filter(([, stats]) => stats.avg > 16)
      .map(([component]) => component);

    if (slowComponents.length > 0) {
      issues.push(`Slow rendering components: ${slowComponents.join(', ')}`);
      recommendations.push('Optimize component rendering with React.memo or useMemo');
      score -= 15;
    }

    // Check API performance
    const slowApis = Object.entries(metrics.apiCalls)
      .filter(([, stats]) => stats.avg > 2000)
      .map(([url]) => url);

    if (slowApis.length > 0) {
      issues.push(`Slow API calls: ${slowApis.length} endpoints`);
      recommendations.push('Consider implementing request caching or pagination');
      score -= 15;
    }

    // Check for layout shifts
    const clsMetric = metrics.performanceMonitor.cumulativeLayoutShift;
    if (clsMetric && clsMetric.avg > 0.1) {
      issues.push('High Cumulative Layout Shift detected');
      recommendations.push('Optimize layout stability by reserving space for dynamic content');
      score -= 10;
    }

    return {
      issues,
      recommendations,
      score: Math.max(0, score),
    };
  }
}
