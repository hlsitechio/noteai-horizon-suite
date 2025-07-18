/**
 * Block External Tracking Script
 * Prevents external services from injecting tracking scripts
 */

export const blockExternalTracking = () => {
  if (typeof window === 'undefined') return;

  // Block Facebook Pixel injection
  const originalAppendChild = Element.prototype.appendChild;
  const originalInsertBefore = Element.prototype.insertBefore;

  Element.prototype.appendChild = function<T extends Node>(node: T): T {
    if (isTrackingScript(node)) {
      console.warn('Blocked external tracking script:', node);
      return node; // Return the node but don't actually append it
    }
    return originalAppendChild.call(this, node);
  };

  Element.prototype.insertBefore = function<T extends Node>(node: T, referenceNode: Node | null): T {
    if (isTrackingScript(node)) {
      console.warn('Blocked external tracking script:', node);
      return node; // Return the node but don't actually insert it
    }
    return originalInsertBefore.call(this, node, referenceNode);
  };

  // Block preload links for tracking
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLLinkElement && node.rel === 'preload') {
          if (isTrackingUrl(node.href)) {
            console.warn('Blocked tracking preload:', node.href);
            node.remove();
          }
        }
      });
    });
  });

  observer.observe(document.head, { childList: true, subtree: true });

  // Clean up existing tracking preloads
  const existingPreloads = document.querySelectorAll('link[rel="preload"]');
  existingPreloads.forEach((link) => {
    if (link instanceof HTMLLinkElement && isTrackingUrl(link.href)) {
      console.warn('Removed existing tracking preload:', link.href);
      link.remove();
    }
  });
};

const isTrackingScript = (node: Node): boolean => {
  if (!(node instanceof HTMLScriptElement)) return false;
  
  const trackingPatterns = [
    /facebook\.com/,
    /fbcdn\.net/,
    /connect\.facebook\.net/,
    /analytics\.google\.com/,
    /googletagmanager\.com/,
    /doubleclick\.net/,
    /googlesyndication\.com/
  ];

  return trackingPatterns.some(pattern => 
    pattern.test(node.src || '') || 
    pattern.test(node.innerHTML || '')
  );
};

const isTrackingUrl = (url: string): boolean => {
  const trackingPatterns = [
    // Facebook tracking
    /facebook\.com\/tr/,
    /fbcdn\.net/,
    /connect\.facebook\.net/,
    /fbevents/,
    
    // Google tracking
    /analytics\.google\.com/,
    /googletagmanager\.com/,
    /doubleclick\.net/,
    /googlesyndication/,
    /google-analytics/,
    
    // Universal tracking systems and fingerprinting
    /UTS/,
    /_fbp/,
    /fingerprint/,
    /tracking/,
    /analytics/,
    
    // Specific IDs found in logs
    /9151671744940732/, // Facebook Pixel ID
    /51355e5ea95dbd049a736d96abcbf090/, // Fingerprinting hash
    /HB-ET_62a029ce4d0d5148349c0bd60bf952550b18008677ee9505980bcdf9060d6d7e/, // UTS tracking ID
    
    // Additional tracking patterns
    /pixel/,
    /beacon/,
    /metrics/,
    /telemetry/
  ];

  return trackingPatterns.some(pattern => pattern.test(url));
};