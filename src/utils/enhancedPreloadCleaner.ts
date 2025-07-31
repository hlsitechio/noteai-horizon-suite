
/**
 * Enhanced Preload Cleaner
 * Removes unused preload links and prevents console spam
 */

export const cleanPreloadLinks = () => {
  if (typeof window === 'undefined') return;

  // Immediately remove all existing problematic preload links
  const preloadLinks = document.querySelectorAll('link[rel="preload"], link[rel="modulepreload"]');
  let removedCount = 0;

  preloadLinks.forEach((link) => {
    const htmlLink = link as HTMLLinkElement;
    
    // More aggressive removal - remove tracking, chunk files, and unused scripts
    if (shouldRemovePreload(htmlLink)) {
      link.remove();
      removedCount++;
      return;
    }

    // Mark timestamp and schedule removal after shorter delay
    if (!htmlLink.dataset.loadTime) {
      htmlLink.dataset.loadTime = Date.now().toString();
      
      // Schedule removal after just 1 second instead of 3
      setTimeout(() => {
        if (document.contains(htmlLink) && !isResourceUsed(htmlLink)) {
          htmlLink.remove();
        }
      }, 1000);
    }
  });

  // Monitor for new preload links being added
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLLinkElement && (node.rel === 'preload' || node.rel === 'modulepreload')) {
          if (shouldRemovePreload(node)) {
            node.remove();
          } else {
            node.dataset.loadTime = Date.now().toString();
            
            // Reduce timeout to 1 second to prevent console warnings
            setTimeout(() => {
              if (document.contains(node) && !isResourceUsed(node)) {
                node.remove();
              }
            }, 1000);
          }
        }
      });
    });
  });

  observer.observe(document.head, { childList: true, subtree: true });

  if (removedCount > 0) {
    console.log(`🧹 Cleaned up ${removedCount} problematic preload links`);
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

  // Also remove problematic chunk files and assets that commonly cause warnings
  const problematicPatterns = [
    /assets\/.*\.(js|css)$/i,  // Vite generated assets
    /chunk/i,                   // Chunk files
    /vendor/i,                  // Vendor bundles
    /runtime/i,                 // Runtime files
    /\.bundle\./i,              // Bundle files
    /\.[a-f0-9]{8,}\.(js|css)$/i // Hashed assets
  ];

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

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cleanPreloadLinks);
} else {
  cleanPreloadLinks();
}
