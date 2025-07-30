
/**
 * Enhanced Preload Cleaner
 * Removes unused preload links and prevents console spam
 */

export const cleanPreloadLinks = () => {
  if (typeof window === 'undefined') return;

  // Remove existing problematic preload links
  const preloadLinks = document.querySelectorAll('link[rel="preload"]');
  let removedCount = 0;

  preloadLinks.forEach((link) => {
    const htmlLink = link as HTMLLinkElement;
    
    // Check if it's a tracking-related preload
    if (isTrackingPreload(htmlLink.href)) {
      link.remove();
      removedCount++;
      return;
    }

    // Check if preload has been unused for more than 3 seconds
    const linkLoadTime = htmlLink.dataset.loadTime;
    if (!linkLoadTime) {
      htmlLink.dataset.loadTime = Date.now().toString();
    } else {
      const loadTime = parseInt(linkLoadTime);
      const timeDiff = Date.now() - loadTime;
      
      // Remove if unused for more than 3 seconds
      if (timeDiff > 3000 && !isResourceUsed(htmlLink)) {
        link.remove();
        removedCount++;
      }
    }
  });

  // Monitor for new preload links being added
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLLinkElement && node.rel === 'preload') {
          if (isTrackingPreload(node.href)) {
            node.remove();
          } else {
            node.dataset.loadTime = Date.now().toString();
            
            // Check usage after 3 seconds
            setTimeout(() => {
              if (!isResourceUsed(node)) {
                node.remove();
              }
            }, 3000);
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

const isTrackingPreload = (href: string): boolean => {
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

  return trackingPatterns.some(pattern => pattern.test(href));
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
