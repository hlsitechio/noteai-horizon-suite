import { useEffect, useState } from 'react';
import { safeSendAnalyticsEvent } from '@/utils/safeAnalytics';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

export const usePerformanceTracking = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    let hasRun = false;
    
    // Track Core Web Vitals
    const measurePerformance = () => {
      if (hasRun || !('performance' in window)) return;
      hasRun = true;
      
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      const newMetrics: PerformanceMetrics = {
        loadTime: Math.round(loadTime)
      };

      // Get FCP if available
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        newMetrics.firstContentfulPaint = Math.round(fcpEntry.startTime);
      }

      setMetrics(newMetrics);

      // Track performance metrics (only once)
      safeSendAnalyticsEvent('performance_metrics', {
        load_time: newMetrics.loadTime,
        fcp: newMetrics.firstContentfulPaint,
        user_agent: navigator.userAgent,
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      });

      // Performance warnings
      if (newMetrics.loadTime > 3000) {
        console.warn('Slow page load detected:', newMetrics.loadTime + 'ms');
      }
    };

    // Measure on load with delay to avoid multiple calls
    if (document.readyState === 'complete') {
      setTimeout(measurePerformance, 100);
    } else {
      window.addEventListener('load', measurePerformance, { once: true });
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []); // Removed dependencies to prevent re-runs

  return metrics;
};

export const useViewportTracking = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    deviceType: 'desktop' as 'mobile' | 'tablet' | 'desktop'
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const updateViewport = () => {
      // Debounce viewport updates to prevent excessive analytics calls
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
        if (width < 768) deviceType = 'mobile';
        else if (width < 1024) deviceType = 'tablet';

        setViewport({ width, height, deviceType });

        // Track viewport changes for responsive optimization (debounced)
        safeSendAnalyticsEvent('viewport_change', {
          width,
          height,
          device_type: deviceType
        });
      }, 250); // 250ms debounce
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  return viewport;
};

export const useImageOptimization = () => {
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);
  const [supportsAvif, setSupportsAvif] = useState<boolean | null>(null);

  useEffect(() => {
    // Check WebP support
    const checkWebP = () => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        setSupportsWebP(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    // Check AVIF support
    const checkAvif = () => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        setSupportsAvif(avif.height === 2);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    };

    checkWebP();
    checkAvif();
  }, []);

  const getOptimalImageFormat = (originalSrc: string) => {
    if (supportsAvif) return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    if (supportsWebP) return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return originalSrc;
  };

  return { supportsWebP, supportsAvif, getOptimalImageFormat };
};