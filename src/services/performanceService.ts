
export class PerformanceService {
  private static observers: PerformanceObserver[] = [];
  private static metrics: Map<string, number> = new Map();

  static initialize() {
    if (typeof window === 'undefined') return;

    this.observeWebVitals();
    this.observeNavigation();
    this.observeResources();
  }

  private static observeWebVitals() {
    // Core Web Vitals - silent monitoring
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.set('LCP', Math.round(entry.startTime));
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          this.metrics.set('FID', Math.round(fid));
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.set('CLS', Math.round(clsValue * 1000) / 1000);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    }
  }

  private static observeNavigation() {
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as PerformanceNavigationTiming;
          this.metrics.set('TTFB', Math.round(navEntry.responseStart - navEntry.fetchStart));
          this.metrics.set('DOM_LOAD', Math.round(navEntry.domContentLoadedEventEnd - navEntry.fetchStart));
          this.metrics.set('FULL_LOAD', Math.round(navEntry.loadEventEnd - navEntry.fetchStart));
        }
      });
      navObserver.observe({ type: 'navigation', buffered: true });
      this.observers.push(navObserver);
    }
  }

  private static observeResources() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resourceEntry = entry as PerformanceResourceTiming;
          // Silent monitoring - only store metrics, no console output
          if (resourceEntry.transferSize > 100000) {
            this.metrics.set('LARGE_RESOURCE_' + Date.now(), resourceEntry.transferSize);
          }
        }
      });
      resourceObserver.observe({ type: 'resource', buffered: true });
      this.observers.push(resourceObserver);
    }
  }

  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  static cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}
