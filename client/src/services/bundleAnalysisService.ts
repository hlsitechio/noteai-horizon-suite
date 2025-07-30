
import { logger } from '../utils/logger';

interface BundleMetrics {
  totalSize: number;
  gzippedSize: number;
  chunkCount: number;
  largestChunks: Array<{
    name: string;
    size: number;
    type: 'js' | 'css' | 'asset';
  }>;
  duplicateModules: string[];
  unusedModules: string[];
  performanceScore: number;
}

interface LoadingMetrics {
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export class BundleAnalysisService {
  private static performanceEntries: PerformanceEntry[] = [];
  private static resourceTimings: PerformanceResourceTiming[] = [];

  static initialize() {
    this.collectPerformanceMetrics();
    this.analyzeResourceLoading();
    logger.info('Bundle Analysis Service initialized');
  }

  private static collectPerformanceMetrics() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Observe navigation timing
    const navObserver = new PerformanceObserver((list) => {
      this.performanceEntries.push(...list.getEntries());
    });
    navObserver.observe({ type: 'navigation', buffered: true });

    // Observe resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      const resources = list.getEntries() as PerformanceResourceTiming[];
      this.resourceTimings.push(...resources);
    });
    resourceObserver.observe({ type: 'resource', buffered: true });

    // Observe paint timing
    const paintObserver = new PerformanceObserver((list) => {
      this.performanceEntries.push(...list.getEntries());
    });
    paintObserver.observe({ type: 'paint', buffered: true });

    // Observe largest contentful paint
    const lcpObserver = new PerformanceObserver((list) => {
      this.performanceEntries.push(...list.getEntries());
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  private static analyzeResourceLoading() {
    // Analyze loaded resources every 5 seconds
    setInterval(() => {
      this.generateBundleReport();
    }, 5000);
  }

  static getBundleMetrics(): BundleMetrics {
    const jsResources = this.resourceTimings.filter(r => 
      r.name.includes('.js') || r.name.includes('chunk')
    );
    
    const cssResources = this.resourceTimings.filter(r => 
      r.name.includes('.css')
    );

    const totalSize = this.resourceTimings.reduce((sum, r) => 
      sum + (r.transferSize || 0), 0
    );

    const largestChunks = [...jsResources, ...cssResources]
      .map(r => ({
        name: this.extractResourceName(r.name),
        size: r.transferSize || 0,
        type: r.name.includes('.css') ? 'css' as const : 'js' as const
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    const performanceScore = this.calculatePerformanceScore();

    return {
      totalSize,
      gzippedSize: totalSize * 0.7, // Estimate
      chunkCount: jsResources.length,
      largestChunks,
      duplicateModules: this.detectDuplicateModules(),
      unusedModules: this.detectUnusedModules(),
      performanceScore
    };
  }

  static getLoadingMetrics(): LoadingMetrics {
    const navigationEntry = this.performanceEntries.find(
      e => e.entryType === 'navigation'
    ) as PerformanceNavigationTiming;

    const paintEntries = this.performanceEntries.filter(
      e => e.entryType === 'paint'
    );

    const lcpEntry = this.performanceEntries
      .filter(e => e.entryType === 'largest-contentful-paint')
      .pop();

    const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');

    return {
      timeToInteractive: navigationEntry ? 
        navigationEntry.domInteractive - navigationEntry.fetchStart : 0,
      firstContentfulPaint: fcp ? fcp.startTime : 0,
      largestContentfulPaint: lcpEntry ? lcpEntry.startTime : 0,
      cumulativeLayoutShift: this.calculateCLS(),
      firstInputDelay: this.calculateFID()
    };
  }

  private static extractResourceName(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const parts = pathname.split('/');
      return parts[parts.length - 1] || 'unknown';
    } catch {
      return url.substring(url.lastIndexOf('/') + 1) || 'unknown';
    }
  }

  private static detectDuplicateModules(): string[] {
    // Simplified duplicate detection based on resource names
    const resourceNames = this.resourceTimings.map(r => 
      this.extractResourceName(r.name)
    );
    
    const duplicates: string[] = [];
    const seen = new Set<string>();
    
    for (const name of resourceNames) {
      if (seen.has(name) && !duplicates.includes(name)) {
        duplicates.push(name);
      }
      seen.add(name);
    }
    
    return duplicates;
  }

  private static detectUnusedModules(): string[] {
    // This is a simplified approach - in a real implementation,
    // you'd need code coverage data
    const loadedModules = this.resourceTimings
      .filter(r => r.name.includes('.js'))
      .map(r => this.extractResourceName(r.name));

    // Simulate some unused modules detection
    return loadedModules.filter(name => 
      name.includes('unused') || 
      name.includes('legacy') ||
      name.includes('polyfill')
    );
  }

  private static calculatePerformanceScore(): number {
    const metrics = this.getLoadingMetrics();
    let score = 100;

    // Penalize slow metrics
    if (metrics.firstContentfulPaint > 2000) score -= 20;
    if (metrics.largestContentfulPaint > 2500) score -= 20;
    if (metrics.timeToInteractive > 3000) score -= 30;
    if (metrics.cumulativeLayoutShift > 0.1) score -= 15;
    if (metrics.firstInputDelay > 100) score -= 15;

    return Math.max(0, score);
  }

  private static calculateCLS(): number {
    // Simplified CLS calculation
    const layoutShiftEntries = this.performanceEntries.filter(
      e => e.entryType === 'layout-shift'
    );
    
    return layoutShiftEntries.reduce((cls, entry) => {
      const layoutShiftEntry = entry as any;
      if (!layoutShiftEntry.hadRecentInput) {
        return cls + layoutShiftEntry.value;
      }
      return cls;
    }, 0);
  }

  private static calculateFID(): number {
    const firstInputEntry = this.performanceEntries.find(
      e => e.entryType === 'first-input'
    ) as any;
    
    return firstInputEntry ? 
      firstInputEntry.processingStart - firstInputEntry.startTime : 0;
  }

  private static generateBundleReport() {
    const metrics = this.getBundleMetrics();
    const loadingMetrics = this.getLoadingMetrics();

    if (import.meta.env.DEV) {
      logger.debug('Bundle Analysis Report', {
        bundleMetrics: metrics,
        loadingMetrics,
        recommendations: this.generateRecommendations(metrics, loadingMetrics)
      });
    }
  }

  private static generateRecommendations(
    bundle: BundleMetrics, 
    loading: LoadingMetrics
  ): string[] {
    const recommendations: string[] = [];

    if (bundle.totalSize > 1000000) { // 1MB
      recommendations.push('Consider code splitting to reduce initial bundle size');
    }

    if (bundle.largestChunks[0]?.size > 500000) { // 500KB
      recommendations.push('Largest chunk is too big - consider breaking it down');
    }

    if (bundle.duplicateModules.length > 0) {
      recommendations.push('Remove duplicate modules to reduce bundle size');
    }

    if (loading.firstContentfulPaint > 2000) {
      recommendations.push('Optimize for faster First Contentful Paint');
    }

    if (loading.largestContentfulPaint > 2500) {
      recommendations.push('Optimize largest contentful paint timing');
    }

    if (loading.cumulativeLayoutShift > 0.1) {
      recommendations.push('Reduce layout shifts for better user experience');
    }

    return recommendations;
  }

  static getOptimizationSuggestions(): Array<{
    type: 'critical' | 'important' | 'nice-to-have';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }> {
    const metrics = this.getBundleMetrics();
    const loading = this.getLoadingMetrics();
    const suggestions = [];

    if (metrics.totalSize > 1000000) {
      suggestions.push({
        type: 'critical' as const,
        title: 'Implement Code Splitting',
        description: 'Bundle size exceeds 1MB. Implement route-based code splitting to improve initial load time.',
        impact: 'high' as const
      });
    }

    if (loading.firstContentfulPaint > 2000) {
      suggestions.push({
        type: 'important' as const,
        title: 'Optimize First Contentful Paint',
        description: 'FCP is slower than 2 seconds. Consider preloading critical resources and optimizing render-blocking resources.',
        impact: 'high' as const
      });
    }

    if (metrics.duplicateModules.length > 0) {
      suggestions.push({
        type: 'important' as const,
        title: 'Remove Duplicate Dependencies',
        description: `Found ${metrics.duplicateModules.length} duplicate modules. Use bundle analyzer to identify and deduplicate.`,
        impact: 'medium' as const
      });
    }

    return suggestions;
  }
}
