
/**
 * Ultimate Preload Cleaner for Chrome Warning Fix
 * Completely disables Vite preloading to eliminate all preload warnings
 */

let isCleanerActive = false;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

// NUCLEAR OPTION: Completely disable preloading by overriding the browser's preload mechanism
if (typeof window !== 'undefined') {
  // Override document.createElement to prevent ALL preload creation
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName: string) {
    const element = originalCreateElement.call(document, tagName);
    
    // NUCLEAR: Block ALL preload links from being created
    if (tagName.toLowerCase() === 'link') {
      const link = element as HTMLLinkElement;
      
      // Override rel setter to prevent ALL preloads
      const originalRelSetter = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, 'rel')?.set;
      if (originalRelSetter) {
        Object.defineProperty(link, 'rel', {
          set: function(value: string) {
            // Block ALL preload and modulepreload entirely
            if (value === 'preload' || value === 'modulepreload' || value === 'prefetch') {
              // Silent block - don't even log it
              return;
            }
            originalRelSetter.call(this, value);
          },
          get: function() {
            return this.getAttribute('rel') || '';
          },
          configurable: true
        });
      }
      
      // Also prevent setAttribute from setting preload rel
      const originalSetAttribute = link.setAttribute;
      link.setAttribute = function(name: string, value: string) {
        if (name === 'rel' && (value === 'preload' || value === 'modulepreload' || value === 'prefetch')) {
          // Silent block
          return;
        }
        return originalSetAttribute.call(this, name, value);
      };
    }
    
    return element;
  };

  // Also override appendChild to prevent preload links from being added
  const originalAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function<T extends Node>(node: T): T {
    if (node instanceof HTMLLinkElement && 
        (node.rel === 'preload' || node.rel === 'modulepreload' || node.rel === 'prefetch')) {
      // Silently ignore preload links
      return node;
    }
    return originalAppendChild.call(this, node);
  };

  // Override insertBefore as well
  const originalInsertBefore = Element.prototype.insertBefore;
  Element.prototype.insertBefore = function<T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (newNode instanceof HTMLLinkElement && 
        (newNode.rel === 'preload' || newNode.rel === 'modulepreload' || newNode.rel === 'prefetch')) {
      // Silently ignore preload links
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };
}

// Helper function to identify tracking URLs - more comprehensive patterns
const shouldBlockTrackingUrl = (url: string): boolean => {
  const trackingPatterns = [
    // Facebook Pixel specific patterns (most aggressive)
    /facebook\.com\/tr/i,
    /9151671744940732/i,               // Specific FB Pixel ID causing issues
    /fbevents/i,
    /connect\.facebook\.net/i,
    /fbcdn\.net/i,
    /facebook\.com/i,                  // Block all Facebook domains
    
    // Google tracking
    /google-analytics/i,
    /googletagmanager/i,
    /doubleclick/i,
    /googlesyndication/i,
    
    // Generic tracking patterns
    /pixel/i,
    /ev=PageView/i,
    /noscript=1/i,
    /tracking/i,
    /analytics/i,
    /gusid/i,
    /HB-ET/i,
    /UTS/i,
    /_fbp/i
  ];
  return trackingPatterns.some(pattern => pattern.test(url));
};

export const cleanPreloadLinks = () => {
  if (typeof window === 'undefined' || isCleanerActive) return;
  
  isCleanerActive = true;

  // NUCLEAR: Remove ALL existing preloads immediately
  const nukeAllPreloads = () => {
    const preloadLinks = document.querySelectorAll('link[rel="preload"], link[rel="modulepreload"], link[rel="prefetch"]');
    let removedCount = 0;

    preloadLinks.forEach((link) => {
      link.remove();
      removedCount++;
    });

    return removedCount;
  };

  // Run immediate nuclear cleanup
  const initialRemoved = nukeAllPreloads();

  // Set up mutation observer to nuke any new preloads instantly
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLLinkElement && 
            (node.rel === 'preload' || node.rel === 'modulepreload' || node.rel === 'prefetch')) {
          // Instantly remove any preload that gets created
          node.remove();
        }
      });
    });
  });

  observer.observe(document.head, { childList: true, subtree: true });
  observer.observe(document.body, { childList: true, subtree: true });

  // Nuclear cleanup every 500ms to catch any stragglers
  cleanupInterval = setInterval(() => {
    nukeAllPreloads();
  }, 500);

  // Keep this running indefinitely since Vite keeps adding preloads
  if (initialRemoved > 0) {
    console.log(`🚀 NUCLEAR: Disabled all preloading (removed ${initialRemoved} initial preloads)`);
  }
};

// We don't need these functions anymore with the nuclear approach
// But keeping them for potential future use

const shouldRemovePreload = (link: HTMLLinkElement): boolean => {
  // With nuclear approach, we remove ALL preloads
  return true;
};

const isResourceUsed = (link: HTMLLinkElement): boolean => {
  // With nuclear approach, we don't care if resources are used
  return false;
};

// Initialize immediately and keep running
const initializeCleaner = () => {
  cleanPreloadLinks();
  
  // Don't clean before unload since we want continuous blocking
  window.addEventListener('beforeunload', () => {
    // Keep the cleaner running even during navigation
  });
};

// Initialize as early as possible
initializeCleaner();

// Also initialize after short delays to catch any stragglers
setTimeout(initializeCleaner, 10);
setTimeout(initializeCleaner, 100);
setTimeout(initializeCleaner, 500);
