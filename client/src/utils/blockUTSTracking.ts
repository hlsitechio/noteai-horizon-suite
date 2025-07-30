
/**
 * ENHANCED UTS TRACKING SYSTEM BLOCKER
 * Completely neutralizes UTS (Universal Tracking System) and all Facebook tracking
 */

export const blockUTSTracking = () => {
  if (typeof window === 'undefined') return;

  // More aggressive UTS script execution blocking
  const originalEval = window.eval;
  window.eval = function(script: string) {
    if (isUTSScript(script)) {
      // Silent block - don't log to prevent console noise
      return '';
    }
    return originalEval.call(this, script);
  };

  // Block UTS data storage more aggressively
  const originalLocalStorageSetItem = localStorage.setItem;
  const originalSessionStorageSetItem = sessionStorage.setItem;
  const originalLocalStorageGetItem = localStorage.getItem;
  const originalSessionStorageGetItem = sessionStorage.getItem;

  localStorage.setItem = function(key: string, value: string) {
    if (isUTSStorageKey(key)) {
      return; // Silent block
    }
    return originalLocalStorageSetItem.call(this, key, value);
  };

  localStorage.getItem = function(key: string) {
    if (isUTSStorageKey(key)) {
      return null; // Return null for UTS keys
    }
    return originalLocalStorageGetItem.call(this, key);
  };

  sessionStorage.setItem = function(key: string, value: string) {
    if (isUTSStorageKey(key)) {
      return; // Silent block
    }
    return originalSessionStorageSetItem.call(this, key, value);
  };

  sessionStorage.getItem = function(key: string) {
    if (isUTSStorageKey(key)) {
      return null; // Return null for UTS keys
    }
    return originalSessionStorageGetItem.call(this, key);
  };

  // Enhanced network request blocking
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input.toString();
    
    if (isUTSUrl(url)) {
      // Silent rejection - errors are expected and filtered by console manager
      return Promise.reject(new Error('UTS tracking request blocked'));
    }
    
    return originalFetch.apply(this, [input, init]);
  };

  // Enhanced XMLHttpRequest blocking
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method: string, url: string, ...args: any[]) {
    if (isUTSUrl(url)) {
      // Block the request by opening to a dummy URL
      return originalXHROpen.call(this, method, 'about:blank', ...args);
    }
    return originalXHROpen.call(this, method, url, ...args);
  };

  // Block UTS cookie access more thoroughly
  const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  if (originalCookieDescriptor && originalCookieDescriptor.configurable) {
    try {
      Object.defineProperty(document, 'cookie', {
        get: function() {
          const cookies = originalCookieDescriptor.get?.call(this) || '';
          // Filter out UTS tracking cookies completely
          return cookies.split(';')
            .filter(cookie => !isUTSCookie(cookie.trim()))
            .join(';');
        },
        set: function(value: string) {
          if (isUTSCookie(value)) {
            return; // Silent block
          }
          return originalCookieDescriptor.set?.call(this, value);
        }
      });
    } catch (error) {
      // Cookie property cannot be redefined, skip this protection silently
    }
  }

  // Block script injection attempts with react-helmet-async compatibility
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName: string, options?: ElementCreationOptions): HTMLElement {
    const element = originalCreateElement.call(this, tagName, options) as HTMLElement;
    
    if (tagName.toLowerCase() === 'script') {
      const script = element as HTMLScriptElement;
      
      // Enhanced compatibility check for react-helmet-async and other libraries
      const existingDescriptor = Object.getOwnPropertyDescriptor(script, 'src');
      const prototypeDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
      
      // Only intercept if no other library has already modified the property
      if (!existingDescriptor && prototypeDescriptor && prototypeDescriptor.configurable !== false) {
        try {
          const originalSetter = prototypeDescriptor.set;
          const originalGetter = prototypeDescriptor.get;
          
          if (originalSetter) {
            Object.defineProperty(script, 'src', {
              set: function(value: string) {
                if (isUTSUrl(value)) {
                  return; // Don't set UTS URLs
                }
                return originalSetter.call(this, value);
              },
              get: function() {
                return originalGetter ? originalGetter.call(this) : '';
              },
              configurable: true,
              enumerable: true
            });
          }
        } catch (error) {
          // Property conflicts detected - let other libraries handle this
          // This prevents conflicts with react-helmet-async and similar libraries
        }
      }
    }
    
    return element;
  };

  // Block WebSocket connections to tracking services
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(url: string, protocols?: string | string[]) {
    if (isUTSUrl(url)) {
      throw new Error('WebSocket connection blocked');
    }
    return new originalWebSocket(url, protocols);
  } as any;

  // Clean up existing UTS data
  setTimeout(() => {
    // Clean localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && isUTSStorageKey(key)) {
        localStorage.removeItem(key);
      }
    }
    
    // Clean sessionStorage
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && isUTSStorageKey(key)) {
        sessionStorage.removeItem(key);
      }
    }
  }, 100);
};

const isUTSScript = (script: string): boolean => {
  const utsScriptPatterns = [
    /UTS/i,
    /_fbp/i,
    /fingerprint/i,
    /gusid/i,
    /HB-ET/i,
    /facebook.*pixel/i,
    /connect\.facebook\.net/i,
    /fbevents/i,
    /fbcdn\.net/i,
    /googleads/i,
    /doubleclick/i,
    /googlesyndication/i,
    /google-analytics/i,
    /gtag/i,
    /gtm/i
  ];

  return utsScriptPatterns.some(pattern => pattern.test(script));
};

const isUTSStorageKey = (key: string): boolean => {
  const utsKeyPatterns = [
    /^_fbp/i,
    /^UTS/i,
    /fingerprint/i,
    /gusid/i,
    /HB-ET/i,
    /facebook.*pixel/i,
    /^_ga/i,
    /^_gid/i,
    /^_gtag/i,
    /^_gcl/i,
    /tracking/i,
    /analytics/i
  ];

  return utsKeyPatterns.some(pattern => pattern.test(key));
};

const isUTSUrl = (url: string): boolean => {
  const utsUrlPatterns = [
    /UTS/i,
    /_fbp/i,
    /fingerprint/i,
    /gusid/i,
    /HB-ET/i,
    /facebook\.com\/tr/i,
    /connect\.facebook\.net/i,
    /fbcdn\.net/i,
    /fbevents/i,
    /googleads/i,
    /doubleclick\.net/i,
    /googlesyndication/i,
    /google-analytics\.com/i,
    /googletagmanager\.com/i,
    /analytics\.google\.com/i,
    /stats\.g\.doubleclick\.net/i,
    /pagead2\.googlesyndication\.com/i,
    /googleadservices\.com/i
  ];

  return utsUrlPatterns.some(pattern => pattern.test(url));
};

const isUTSCookie = (cookie: string): boolean => {
  const utsCookiePatterns = [
    /^_fbp=/i,
    /^UTS=/i,
    /fingerprint=/i,
    /gusid=/i,
    /HB-ET=/i,
    /fb\.1\.\d+\.\d+/i,
    /^_ga=/i,
    /^_gid=/i,
    /^_gat=/i,
    /^_gtag=/i,
    /^_gcl=/i
  ];

  return utsCookiePatterns.some(pattern => pattern.test(cookie));
};

// Initialize immediately
blockUTSTracking();
