import { logger } from '@/utils/logger';

interface BundleMetrics {
  performanceScore: number;
  bundleSize: {
    total: number;
    javascript: number;
    css: number;
    images: number;
    fonts: number;
  };
  loadingMetrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
    timeToInteractive: number;
  };
  optimization: {
    codeSplitting: boolean;
    compression: boolean;
    minification: boolean;
    treeshaking: boolean;
    lazyLoading: boolean;
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: 'bundle-size' | 'loading' | 'optimization';
    title: string;
    description: string;
    estimatedImpact: number; // 0-100
  }>;
}

interface ResourceTiming {
  name: string;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  duration: number;
  type: 'script' | 'stylesheet' | 'image' | 'font' | 'other';
}

export class BundleAnalysisService {
  private static metrics: BundleMetrics = {
    performanceScore: 0,
    bundleSize: {
      total: 0,
      javascript: 0,
      css: 0,
      images: 0,
      fonts: 0
    },
    loadingMetrics: {
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      timeToInteractive: 0
    },
    optimization: {
      codeSplitting: false,
      compression: false,
      minification: false,
      treeshaking: false,
      lazyLoading: false
    },
    recommendations: []
  };

  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;

    await this.analyzeBundleSize();
    await this.analyzeLoadingMetrics();
    this.analyzeOptimizations();
    this.generateRecommendations();
    this.calculatePerformanceScore();

    logger.info('Bundle Analysis Service initialized', this.metrics);
    this.isInitialized = true;
  }

  private static async analyzeBundleSize() {
    try {
      const resources = this.getResourceTimings();
      
      this.metrics.bundleSize = {
        total: resources.reduce((sum, r) => sum + r.transferSize, 0),
        javascript: resources.filter(r => r.type === 'script').reduce((sum, r) => sum + r.transferSize, 0),
        css: resources.filter(r => r.type === 'stylesheet').reduce((sum, r) => sum + r.transferSize, 0),
        images: resources.filter(r => r.type === 'image').reduce((sum, r) => sum + r.transferSize, 0),
        fonts: resources.filter(r => r.type === 'font').reduce((sum, r) => sum + r.transferSize, 0)
      };
    } catch (error) {
      logger.warn('Failed to analyze bundle size', error);
    }
  }

  private static getResourceTimings(): ResourceTiming[] {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    return entries.map(entry => ({
      name: entry.name,
      transferSize: entry.transferSize || 0,
      encodedBodySize: entry.encodedBodySize || 0,
      decodedBodySize: entry.decodedBodySize || 0,
      duration: entry.duration,
      type: this.getResourceType(entry.name)
    }));
  }

  private static getResourceType(url: string): 'script' | 'stylesheet' | 'image' | 'font' | 'other' {
    if (url.includes('.js') || url.includes('javascript')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf|eot)$/i)) return 'font';
    return 'other';
  }

  private static async analyzeLoadingMetrics() {
    try {
      // Get Core Web Vitals
      if ('web-vitals' in window) {
        // If web-vitals library is available
        await this.getCoreWebVitals();
      } else {
        // Fallback to Performance API
        await this.getPerformanceMetrics();
      }
    } catch (error) {
      logger.warn('Failed to analyze loading metrics', error);
    }
  }

  private static async getCoreWebVitals() {
    // This would integrate with web-vitals library if available
    // For now, we'll use Performance API as fallback
    return this.getPerformanceMetrics();
  }

  private static async getPerformanceMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.metrics.loadingMetrics = {
        firstContentfulPaint: this.getMetricValue('first-contentful-paint') || 0,
        largestContentfulPaint: this.getMetricValue('largest-contentful-paint') || 0,
        firstInputDelay: this.getMetricValue('first-input-delay') || 0,
        cumulativeLayoutShift: this.getMetricValue('cumulative-layout-shift') || 0,
        timeToInteractive: navigation.loadEventEnd - navigation.fetchStart
      };
    }
  }

  private static getMetricValue(metricName: string): number {
    const entries = performance.getEntriesByName(metricName);
    return entries.length > 0 ? entries[entries.length - 1].startTime : 0;
  }

  private static analyzeOptimizations() {
    const resources = this.getResourceTimings();
    
    // Check for code splitting (multiple JS chunks)
    const jsFiles = resources.filter(r => r.type === 'script');
    this.metrics.optimization.codeSplitting = jsFiles.length > 2;

    // Check for compression (compare encoded vs decoded size)
    const hasCompression = resources.some(r => 
      r.encodedBodySize > 0 && r.decodedBodySize > r.encodedBodySize
    );
    this.metrics.optimization.compression = hasCompression;

    // Check for minification (look for .min files or small file sizes)
    const hasMinification = jsFiles.some(r => 
      r.name.includes('.min.') || r.name.includes('chunk')
    );
    this.metrics.optimization.minification = hasMinification;

    // Check for tree shaking (small JS bundle sizes relative to what's expected)
    this.metrics.optimization.treeshaking = this.metrics.bundleSize.javascript < 500000; // < 500KB

    // Check for lazy loading (images with loading="lazy" or intersection observer usage)
    const images = document.querySelectorAll('img');
    const hasLazyLoading = Array.from(images).some(img => 
      img.getAttribute('loading') === 'lazy' || img.classList.contains('lazy')
    );
    this.metrics.optimization.lazyLoading = hasLazyLoading;
  }

  private static generateRecommendations() {
    const recommendations: BundleMetrics['recommendations'] = [];

    // Bundle size recommendations
    if (this.metrics.bundleSize.total > 1000000) { // > 1MB
      recommendations.push({
        priority: 'high',
        category: 'bundle-size',
        title: 'Reduce Total Bundle Size',
        description: 'Your bundle is over 1MB. Consider code splitting and removing unused dependencies.',
        estimatedImpact: 80
      });
    }

    if (this.metrics.bundleSize.javascript > 500000) { // > 500KB
      recommendations.push({
        priority: 'high',
        category: 'bundle-size',
        title: 'Optimize JavaScript Bundle',
        description: 'JavaScript bundle is large. Implement code splitting and tree shaking.',
        estimatedImpact: 70
      });
    }

    if (this.metrics.bundleSize.images > 2000000) { // > 2MB
      recommendations.push({
        priority: 'medium',
        category: 'bundle-size',
        title: 'Optimize Images',
        description: 'Image assets are large. Use modern formats like WebP and implement lazy loading.',
        estimatedImpact: 60
      });
    }

    // Loading performance recommendations
    if (this.metrics.loadingMetrics.firstContentfulPaint > 2500) {
      recommendations.push({
        priority: 'high',
        category: 'loading',
        title: 'Improve First Contentful Paint',
        description: 'FCP is over 2.5s. Optimize critical rendering path and reduce blocking resources.',
        estimatedImpact: 85
      });
    }

    if (this.metrics.loadingMetrics.largestContentfulPaint > 4000) {
      recommendations.push({
        priority: 'high',
        category: 'loading',
        title: 'Improve Largest Contentful Paint',
        description: 'LCP is over 4s. Optimize main content loading and reduce server response time.',
        estimatedImpact: 80
      });
    }

    if (this.metrics.loadingMetrics.cumulativeLayoutShift > 0.25) {
      recommendations.push({
        priority: 'medium',
        category: 'loading',
        title: 'Reduce Layout Shifts',
        description: 'High CLS detected. Add size attributes to images and reserve space for dynamic content.',
        estimatedImpact: 60
      });
    }

    // Optimization recommendations
    if (!this.metrics.optimization.codeSplitting) {
      recommendations.push({
        priority: 'medium',
        category: 'optimization',
        title: 'Implement Code Splitting',
        description: 'Split your code into smaller chunks for better loading performance.',
        estimatedImpact: 70
      });
    }

    if (!this.metrics.optimization.compression) {
      recommendations.push({
        priority: 'high',
        category: 'optimization',
        title: 'Enable Compression',
        description: 'Enable gzip or brotli compression to reduce file sizes.',
        estimatedImpact: 75
      });
    }

    if (!this.metrics.optimization.lazyLoading) {
      recommendations.push({
        priority: 'medium',
        category: 'optimization',
        title: 'Implement Lazy Loading',
        description: 'Add lazy loading for images and components below the fold.',
        estimatedImpact: 50
      });
    }

    // Sort by priority and estimated impact
    this.metrics.recommendations = recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.estimatedImpact - a.estimatedImpact;
    });
  }

  private static calculatePerformanceScore() {
    let score = 100;

    // Deduct points based on bundle size
    const bundleSizeScore = Math.max(0, 100 - (this.metrics.bundleSize.total / 10000)); // 1 point per 10KB
    
    // Deduct points based on loading metrics
    const fcpScore = Math.max(0, 100 - (this.metrics.loadingMetrics.firstContentfulPaint / 50)); // 1 point per 50ms
    const lcpScore = Math.max(0, 100 - (this.metrics.loadingMetrics.largestContentfulPaint / 80)); // 1 point per 80ms
    
    // Add points for optimizations
    const optimizationCount = Object.values(this.metrics.optimization).filter(Boolean).length;
    const optimizationScore = (optimizationCount / 5) * 100; // 5 total optimizations

    // Calculate weighted average
    this.metrics.performanceScore = Math.max(0, Math.min(100, 
      (bundleSizeScore * 0.3) + 
      (fcpScore * 0.25) + 
      (lcpScore * 0.25) + 
      (optimizationScore * 0.2)
    ));
  }

  static getBundleMetrics(): BundleMetrics {
    return { ...this.metrics };
  }

  static async refreshMetrics() {
    await this.initialize();
  }

  static getOptimizationSuggestions(): Array<{
    title: string;
    description: string;
    implementation: string;
    impact: 'high' | 'medium' | 'low';
  }> {
    return [
      {
        title: 'Implement Dynamic Imports',
        description: 'Use React.lazy() and dynamic imports for code splitting',
        implementation: 'const Component = React.lazy(() => import("./Component"));',
        impact: 'high'
      },
      {
        title: 'Optimize Bundle Analyzer',
        description: 'Use bundle analyzer to identify large dependencies',
        implementation: 'npm run build -- --analyze',
        impact: 'high'
      },
      {
        title: 'Enable Tree Shaking',
        description: 'Remove unused code from your bundles',
        implementation: 'Configure webpack or vite for tree shaking',
        impact: 'medium'
      },
      {
        title: 'Implement Service Worker',
        description: 'Cache static assets for faster subsequent loads',
        implementation: 'Add service worker with cache strategies',
        impact: 'medium'
      },
      {
        title: 'Use Modern Image Formats',
        description: 'Convert images to WebP or AVIF formats',
        implementation: 'Use picture element with modern format fallbacks',
        impact: 'medium'
      }
    ];
  }

  static getPerformanceInsights() {
    const metrics = this.getBundleMetrics();
    
    return {
      score: metrics.performanceScore,
      status: metrics.performanceScore >= 90 ? 'excellent' : 
              metrics.performanceScore >= 70 ? 'good' : 
              metrics.performanceScore >= 50 ? 'fair' : 'poor',
      criticalIssues: metrics.recommendations.filter(r => r.priority === 'high').length,
      totalBundleSize: `${(metrics.bundleSize.total / 1024).toFixed(2)} KB`,
      largestAssetType: this.getLargestAssetType(metrics.bundleSize),
      optimizationsEnabled: Object.values(metrics.optimization).filter(Boolean).length
    };
  }

  private static getLargestAssetType(bundleSize: BundleMetrics['bundleSize']): string {
    const sizes = {
      JavaScript: bundleSize.javascript,
      CSS: bundleSize.css,
      Images: bundleSize.images,
      Fonts: bundleSize.fonts
    };

    const largest = Object.entries(sizes).reduce((a, b) => a[1] > b[1] ? a : b);
    return largest[0];
  }
}