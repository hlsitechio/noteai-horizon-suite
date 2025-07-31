
/**
 * Ultimate Preload Cleaner for Chrome Warning Fix
 * Aggressively prevents and removes unused preload links to eliminate console warnings
 * Now includes early DOM interception to prevent Facebook tracking preloads
 */

let isCleanerActive = false;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

// Immediately hijack HTMLLinkElement creation to prevent tracking preloads
if (typeof window !== 'undefined') {
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName: string) {
    const element = originalCreateElement.call(document, tagName);
    
    // Intercept link elements being created
    if (tagName.toLowerCase() === 'link') {
      const link = element as HTMLLinkElement;
      
      // Override href setter to block tracking preloads
      const originalHrefSetter = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, 'href')?.set;
      if (originalHrefSetter) {
        Object.defineProperty(link, 'href', {
          set: function(value: string) {
            // Block Facebook tracking URLs from being set as preloads
            if ((this.rel === 'preload' || this.rel === 'prefetch') && shouldBlockTrackingUrl(value)) {
              console.warn('🚫 Blocked tracking preload creation:', value);
              return; // Don't set the href
            }
            originalHrefSetter.call(this, value);
          },
          get: function() {
            return originalHrefSetter ? this.getAttribute('href') || '' : '';
          },
          configurable: true
        });
      }
      
      // Also override rel setter to catch late assignments
      const originalRelSetter = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, 'rel')?.set;
      if (originalRelSetter) {
        Object.defineProperty(link, 'rel', {
          set: function(value: string) {
            if ((value === 'preload' || value === 'prefetch') && shouldBlockTrackingUrl(this.href)) {
              console.warn('🚫 Blocked tracking preload via rel assignment:', this.href);
              return; // Don't set rel to preload for tracking URLs
            }
            originalRelSetter.call(this, value);
          },
          get: function() {
            return originalRelSetter ? this.getAttribute('rel') || '' : '';
          },
          configurable: true
        });
      }
    }
    
    return element;
  };
}

// Helper function to identify tracking URLs
const shouldBlockTrackingUrl = (url: string): boolean => {
  const trackingPatterns = [
    /facebook\.com\/tr/i,
    /9151671744940732/i,
    /fbevents/i,
    /pixel/i,
    /ev=PageView/i,
    /noscript=1/i,
    /connect\.facebook\.net/i,
    /fbcdn\.net/i,
    /gusid/i,
    /HB-ET/i,
    /UTS/i
  ];
  return trackingPatterns.some(pattern => pattern.test(url));
};

export const cleanPreloadLinks = () => {
  if (typeof window === 'undefined' || isCleanerActive) return;
  
  isCleanerActive = true;

  // Immediate aggressive cleanup of all existing preloads
  const immediateCleanup = () => {
    const preloadLinks = document.querySelectorAll('link[rel="preload"], link[rel="modulepreload"]');
    let removedCount = 0;

    preloadLinks.forEach((link) => {
      const htmlLink = link as HTMLLinkElement;
      
      // Remove all problematic preloads immediately
      if (shouldRemovePreload(htmlLink) || !isResourceUsed(htmlLink)) {
        link.remove();
        removedCount++;
      }
    });

    return removedCount;
  };

  // Run immediate cleanup
  const initialRemoved = immediateCleanup();

  // Set up aggressive monitoring with shorter intervals
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLLinkElement && (node.rel === 'preload' || node.rel === 'modulepreload')) {
          // Remove problematic preloads immediately upon creation
          if (shouldRemovePreload(node)) {
            node.remove();
            return;
          }
          
          // For non-problematic preloads, remove them quickly if unused
          setTimeout(() => {
            if (document.contains(node) && !isResourceUsed(node)) {
              node.remove();
            }
          }, 500); // Even more aggressive - 500ms
        }
      });
    });
  });

  observer.observe(document.head, { childList: true, subtree: true });

  // More aggressive cleanup every 1 second to catch any stragglers
  cleanupInterval = setInterval(() => {
    immediateCleanup();
  }, 1000);

  // Stop continuous cleanup after 30 seconds
  setTimeout(() => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
  }, 30000);

  if (initialRemoved > 0) {
    console.log(`🚀 Ultra-cleaned ${initialRemoved} preload links to prevent Chrome warnings`);
  }
};

const shouldRemovePreload = (link: HTMLLinkElement): boolean => {
  const href = link.href;
  
  // Remove tracking-related preloads - ultra aggressive against Facebook Pixel
  const trackingPatterns = [
    // Facebook Pixel specific patterns
    /facebook\.com\/tr/i,               // Facebook tracking pixel
    /facebook\.com/i,                   // All Facebook domains
    /fbcdn\.net/i,                      // Facebook CDN
    /connect\.facebook\.net/i,          // Facebook Connect
    /fbevents/i,                        // Facebook events
    /9151671744940732/i,               // Specific FB Pixel ID from warning
    /ev=PageView/i,                     // Facebook PageView events
    /noscript=1/i,                      // Facebook noscript fallbacks
    // Google tracking
    /googleads/i,
    /doubleclick\.net/i,
    /googlesyndication/i,
    /google-analytics/i,
    /googletagmanager/i,
    // Generic tracking patterns
    /tracking/i,
    /analytics/i,
    /pixel/i,
    /beacon/i,
    /metrics/i,
    /telemetry/i,
    // UTM and campaign tracking
    /utm_/i,
    /\?.*ev=PageView/i,                 // Facebook PageView events
    /\?.*noscript=1/i                   // Facebook noscript pixel fallbacks
  ];

  // More comprehensive patterns for Vite-generated assets that cause Chrome warnings
  const problematicPatterns = [
    /assets\/.*\.(js|css)$/i,        // Vite generated assets
    /chunk.*\.(js|css)$/i,           // Chunk files
    /vendor.*\.(js|css)$/i,          // Vendor bundles
    /runtime.*\.(js|css)$/i,         // Runtime files
    /\.bundle\./i,                   // Bundle files
    /\.[a-f0-9]{8,}\.(js|css)$/i,   // Hashed assets
    /node_modules/i,                 // Node modules
    /\.js$/i,                        // All JS files (aggressive)
    /\.css$/i,                       // All CSS files (aggressive)
    /\/@fs\//i,                      // Vite filesystem references
    /\/@id\//i,                      // Vite ID references
  ];

  // Special check for modulepreload links without proper 'as' attribute
  if (link.rel === 'modulepreload' && !link.getAttribute('as')) {
    return true;
  }

  // Remove if no crossorigin for external resources
  if (href.includes('://') && !link.crossOrigin && !href.includes(window.location.origin)) {
    return true;
  }

  return trackingPatterns.some(pattern => pattern.test(href)) ||
         problematicPatterns.some(pattern => pattern.test(href));
};

const isResourceUsed = (link: HTMLLinkElement): boolean => {
  const href = link.href;
  const as = link.getAttribute('as');

  // Check if resource is actually being used
  switch (as) {
    case 'script':
      return document.querySelector(`script[src="${href}"]`) !== null;
    case 'style':
      return document.querySelector(`link[href="${href}"][rel="stylesheet"]`) !== null;
    case 'font':
      return document.fonts ? Array.from(document.fonts).some(font => 
        font.status === 'loaded' && href.includes(font.family.toLowerCase().replace(/\s+/g, ''))
      ) : false;
    case 'image':
      return document.querySelector(`img[src="${href}"]`) !== null;
    default:
      return false;
  }
};

// Initialize immediately and on various events to catch all scenarios
const initializeCleaner = () => {
  cleanPreloadLinks();
  
  // Also clean on page visibility change (tab focus)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      cleanPreloadLinks();
    }
  });
  
  // Clean before unload to prevent warnings during navigation
  window.addEventListener('beforeunload', () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
    }
  });
};

// Multiple initialization points to ensure we catch preloads early
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCleaner);
} else {
  initializeCleaner();
}

// Backup initialization after a short delay
setTimeout(initializeCleaner, 100);
