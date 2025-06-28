/**
 * Advanced memory cleanup utilities with performance monitoring
 */

export interface CleanupStats {
  timersCleared: number;
  intervalsCleared: number;
  observersDisconnected: number;
  controllersAborted: number;
  listenersRemoved: number;
  streamsTerminated: number;
  totalCleanupTime: number;
}

export class AdvancedCleanupManager {
  private timers: (number | NodeJS.Timeout)[] = [];
  private intervals: (number | NodeJS.Timeout)[] = [];
  private observers: (ResizeObserver | IntersectionObserver | MutationObserver | PerformanceObserver)[] = [];
  private controllers: AbortController[] = [];
  private listeners: Array<{
    element: HTMLElement | Window | Document;
    event: string;
    handler: EventListener;
  }> = [];
  private streams: ReadableStreamDefaultReader[] = [];
  private cleanupCallbacks: Array<() => void | Promise<void>> = [];
  private isDestroyed = false;
  private cleanupStats: CleanupStats = {
    timersCleared: 0,
    intervalsCleared: 0,
    observersDisconnected: 0,
    controllersAborted: 0,
    listenersRemoved: 0,
    streamsTerminated: 0,
    totalCleanupTime: 0,
  };

  constructor(private debugMode = import.meta.env.DEV) {
    if (this.debugMode) {
      console.log('AdvancedCleanupManager initialized');
    }
  }

  addTimer(id: number | NodeJS.Timeout, description?: string) {
    if (this.isDestroyed) return;
    this.timers.push(id);
    if (this.debugMode && description) {
      console.log(`Timer added: ${description}`);
    }
  }

  addInterval(id: number | NodeJS.Timeout, description?: string) {
    if (this.isDestroyed) return;
    this.intervals.push(id);
    if (this.debugMode && description) {
      console.log(`Interval added: ${description}`);
    }
  }

  addObserver(observer: ResizeObserver | IntersectionObserver | MutationObserver | PerformanceObserver, description?: string) {
    if (this.isDestroyed) return;
    this.observers.push(observer);
    if (this.debugMode && description) {
      console.log(`Observer added: ${description}`);
    }
  }

  addController(controller: AbortController, description?: string) {
    if (this.isDestroyed) return;
    this.controllers.push(controller);
    if (this.debugMode && description) {
      console.log(`AbortController added: ${description}`);
    }
  }

  addListener(element: HTMLElement | Window | Document, event: string, handler: EventListener, description?: string) {
    if (this.isDestroyed) return;
    this.listeners.push({ element, event, handler });
    try {
      element.addEventListener(event, handler);
      if (this.debugMode && description) {
        console.log(`Event listener added: ${event} - ${description}`);
      }
    } catch (error) {
      console.warn('Failed to add event listener:', error);
    }
  }

  addStream(stream: ReadableStreamDefaultReader, description?: string) {
    if (this.isDestroyed) return;
    this.streams.push(stream);
    if (this.debugMode && description) {
      console.log(`Stream added: ${description}`);
    }
  }

  addCleanupCallback(callback: () => void | Promise<void>, description?: string) {
    if (this.isDestroyed) return;
    this.cleanupCallbacks.push(callback);
    if (this.debugMode && description) {
      console.log(`Cleanup callback added: ${description}`);
    }
  }

  // Specific cleanup methods for different resource types
  private clearTimers(): void {
    this.timers.forEach((id) => {
      try {
        clearTimeout(id);
        this.cleanupStats.timersCleared++;
      } catch (error) {
        console.warn('Failed to clear timer:', error);
      }
    });
    this.timers = [];
  }

  private clearIntervals(): void {
    this.intervals.forEach((id) => {
      try {
        clearInterval(id);
        this.cleanupStats.intervalsCleared++;
      } catch (error) {
        console.warn('Failed to clear interval:', error);
      }
    });
    this.intervals = [];
  }

  private disconnectObservers(): void {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
        this.cleanupStats.observersDisconnected++;
      } catch (error) {
        console.warn('Failed to disconnect observer:', error);
      }
    });
    this.observers = [];
  }

  private abortControllers(): void {
    this.controllers.forEach(controller => {
      try {
        if (!controller.signal.aborted) {
          controller.abort();
          this.cleanupStats.controllersAborted++;
        }
      } catch (error) {
        console.warn('Failed to abort controller:', error);
      }
    });
    this.controllers = [];
  }

  private removeEventListeners(): void {
    this.listeners.forEach(({ element, event, handler }) => {
      try {
        if (element && typeof element.removeEventListener === 'function') {
          element.removeEventListener(event, handler);
          this.cleanupStats.listenersRemoved++;
        }
      } catch (error) {
        console.warn('Failed to remove event listener:', error);
      }
    });
    this.listeners = [];
  }

  private terminateStreams(): void {
    this.streams.forEach(stream => {
      try {
        stream.cancel();
        this.cleanupStats.streamsTerminated++;
      } catch (error) {
        console.warn('Failed to terminate stream:', error);
      }
    });
    this.streams = [];
  }

  private async executeCleanupCallbacks(): Promise<void> {
    const callbacks = [...this.cleanupCallbacks];
    this.cleanupCallbacks = [];

    for (const callback of callbacks) {
      try {
        await callback();
      } catch (error) {
        console.warn('Cleanup callback failed:', error);
      }
    }
  }

  async cleanup(): Promise<CleanupStats> {
    if (this.isDestroyed) {
      return this.cleanupStats;
    }

    const startTime = performance.now();

    try {
      // Clear all resources
      this.clearTimers();
      this.clearIntervals();
      this.disconnectObservers();
      this.abortControllers();
      this.removeEventListeners();
      this.terminateStreams();
      
      // Execute custom cleanup callbacks
      await this.executeCleanupCallbacks();

      this.cleanupStats.totalCleanupTime = performance.now() - startTime;
      this.isDestroyed = true;

      if (this.debugMode) {
        console.log('AdvancedCleanupManager: Cleanup completed', this.cleanupStats);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      this.cleanupStats.totalCleanupTime = performance.now() - startTime;
    }

    return { ...this.cleanupStats };
  }

  // Utility methods for monitoring
  getResourceCount(): { 
    timers: number; 
    intervals: number; 
    observers: number; 
    controllers: number; 
    listeners: number; 
    streams: number;
    callbacks: number;
  } {
    return {
      timers: this.timers.length,
      intervals: this.intervals.length,
      observers: this.observers.length,
      controllers: this.controllers.length,
      listeners: this.listeners.length,
      streams: this.streams.length,
      callbacks: this.cleanupCallbacks.length,
    };
  }

  isResourcesEmpty(): boolean {
    const counts = this.getResourceCount();
    return Object.values(counts).every(count => count === 0);
  }

  getCleanupStats(): CleanupStats {
    return { ...this.cleanupStats };
  }
}

// Global cleanup manager for app-level resources
export const globalCleanupManager = new AdvancedCleanupManager();

// Performance monitoring utilities
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.setupPerformanceObservers();
  }

  private setupPerformanceObservers() {
    if (typeof PerformanceObserver === 'undefined') return;

    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('longTask', entry.duration);
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        }
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
      this.observers.push(longTaskObserver);
    } catch (error) {
      console.warn('Long task observer not supported:', error);
    }

    // Monitor layout shifts
    try {
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const cls = (entry as any).value;
          this.recordMetric('cumulativeLayoutShift', cls);
          if (cls > 0.1) {
            console.warn(`Layout shift detected: ${cls}`);
          }
        }
      });
      layoutShiftObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(layoutShiftObserver);
    } catch (error) {
      console.warn('Layout shift observer not supported:', error);
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only the last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetricStats(name: string): { avg: number; max: number; min: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    return {
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
      count: values.length,
    };
  }

  getAllMetrics(): Record<string, { avg: number; max: number; min: number; count: number }> {
    const result: Record<string, { avg: number; max: number; min: number; count: number }> = {};
    for (const [name] of this.metrics) {
      const stats = this.getMetricStats(name);
      if (stats) {
        result[name] = stats;
      }
    }
    return result;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

export const globalPerformanceMonitor = new PerformanceMonitor();
