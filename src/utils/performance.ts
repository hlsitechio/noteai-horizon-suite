// Performance utilities for monitoring and optimization

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
  }

  private initializeObservers() {
    // Core Web Vitals observer
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const value = 'value' in entry ? (entry as any).value : entry.duration || 0
            this.recordMetric(entry.name, value, 'ms')
          }
        })
        
        observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] })
        this.observers.push(observer)
      } catch (error) {
        console.warn('Performance Observer not supported:', error)
      }
    }
  }

  recordMetric(name: string, value: number, unit: string = 'ms'): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now()
    }

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    this.metrics.get(name)!.push(metric)
    
    // Keep only last 100 metrics per type
    const metrics = this.metrics.get(name)!
    if (metrics.length > 100) {
      metrics.shift()
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.get(name) || []
    }
    
    const allMetrics: PerformanceMetric[] = []
    for (const metrics of this.metrics.values()) {
      allMetrics.push(...metrics)
    }
    
    return allMetrics.sort((a, b) => b.timestamp - a.timestamp)
  }

  measureAsync<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    
    return asyncFn().finally(() => {
      const end = performance.now()
      this.recordMetric(name, end - start)
    })
  }

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now()
    try {
      return fn()
    } finally {
      const end = performance.now()
      this.recordMetric(name, end - start)
    }
  }

  getCoreWebVitals(): Record<string, PerformanceMetric | null> {
    return {
      FCP: this.getLatestMetric('first-contentful-paint'),
      LCP: this.getLatestMetric('largest-contentful-paint'),
      CLS: this.getLatestMetric('cumulative-layout-shift'),
      FID: this.getLatestMetric('first-input-delay'),
      TTFB: this.getLatestMetric('time-to-first-byte')
    }
  }

  private getLatestMetric(name: string): PerformanceMetric | null {
    const metrics = this.metrics.get(name)
    return metrics && metrics.length > 0 ? metrics[metrics.length - 1] : null
  }

  generateReport(): string {
    const coreVitals = this.getCoreWebVitals()
    const allMetrics = this.getMetrics()
    
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      coreWebVitals: coreVitals,
      customMetrics: allMetrics.slice(0, 20), // Last 20 metrics
      summary: {
        totalMetrics: allMetrics.length,
        uniqueMetricTypes: this.metrics.size
      }
    }, null, 2)
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics.clear()
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const recordMetric = (name: string, value: number, unit?: string) => {
    performanceMonitor.recordMetric(name, value, unit)
  }

  const measureAsync = <T>(name: string, asyncFn: () => Promise<T>) => {
    return performanceMonitor.measureAsync(name, asyncFn)
  }

  const measure = <T>(name: string, fn: () => T) => {
    return performanceMonitor.measure(name, fn)
  }

  const getMetrics = (name?: string) => {
    return performanceMonitor.getMetrics(name)
  }

  const getCoreWebVitals = () => {
    return performanceMonitor.getCoreWebVitals()
  }

  return {
    recordMetric,
    measureAsync,
    measure,
    getMetrics,
    getCoreWebVitals
  }
}
