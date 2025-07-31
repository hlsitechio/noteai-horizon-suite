
/**
 * Ultimate Preload Cleaner for Chrome Warning Fix
 * Aggressively prevents and removes unused preload links to eliminate console warnings
 */

let isCleanerActive = false;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

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

  // Continuous cleanup every 2 seconds to catch any stragglers
  cleanupInterval = setInterval(() => {
    immediateCleanup();
  }, 2000);

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
  
  // Remove tracking-related preloads
  const trackingPatterns = [
    /facebook\.com/i,
    /fbcdn\.net/i,
    /connect\.facebook\.net/i,
    /fbevents/i,
    /googleads/i,
    /doubleclick\.net/i,
    /googlesyndication/i,
    /google-analytics/i,
    /googletagmanager/i,
    /tracking/i,
    /analytics/i,
    /pixel/i,
    /beacon/i,
    /metrics/i,
    /telemetry/i
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
