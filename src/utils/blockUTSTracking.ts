/**
 * UTS TRACKING SYSTEM BLOCKER
 * Specifically targets and neutralizes UTS (Universal Tracking System) attempts
 */

export const blockUTSTracking = () => {
  if (typeof window === 'undefined') return;

  // Block all UTS-related console logging
  const originalConsoleLog = console.log;
  const originalConsoleInfo = console.info;
  const originalConsoleWarn = console.warn;

  console.log = function(...args: any[]) {
    const message = args.join(' ');
    if (isUTSMessage(message)) {
      console.warn('SECURITY: UTS tracking blocked:', message);
      return;
    }
    return originalConsoleLog.apply(this, args);
  };

  console.info = function(...args: any[]) {
    const message = args.join(' ');
    if (isUTSMessage(message)) {
      console.warn('SECURITY: UTS tracking blocked:', message);
      return;
    }
    return originalConsoleInfo.apply(this, args);
  };

  console.warn = function(...args: any[]) {
    const message = args.join(' ');
    if (isUTSMessage(message)) {
      return; // Silently block UTS warnings
    }
    return originalConsoleWarn.apply(this, args);
  };

  // Block UTS script execution
  const originalEval = window.eval;
  window.eval = function(script: string) {
    if (isUTSScript(script)) {
      console.warn('SECURITY: UTS script execution blocked');
      return '';
    }
    return originalEval.call(this, script);
  };

  // Block UTS data storage
  const originalLocalStorageSetItem = localStorage.setItem;
  const originalSessionStorageSetItem = sessionStorage.setItem;

  localStorage.setItem = function(key: string, value: string) {
    if (isUTSStorageKey(key)) {
      console.warn('SECURITY: UTS localStorage blocked:', key);
      return;
    }
    return originalLocalStorageSetItem.call(this, key, value);
  };

  sessionStorage.setItem = function(key: string, value: string) {
    if (isUTSStorageKey(key)) {
      console.warn('SECURITY: UTS sessionStorage blocked:', key);
      return;
    }
    return originalSessionStorageSetItem.call(this, key, value);
  };

  // Block UTS network requests
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input.toString();
    
    if (isUTSUrl(url)) {
      console.warn('SECURITY: UTS network request blocked:', url);
      return Promise.reject(new Error('UTS tracking request blocked for privacy'));
    }
    
    return originalFetch.apply(this, [input, init]);
  };

  // Block UTS cookie access
  const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  if (originalCookieDescriptor) {
    Object.defineProperty(document, 'cookie', {
      get: function() {
        const cookies = originalCookieDescriptor.get?.call(this) || '';
        // Filter out UTS tracking cookies
        return cookies.split(';')
          .filter(cookie => !isUTSCookie(cookie.trim()))
          .join(';');
      },
      set: function(value: string) {
        if (isUTSCookie(value)) {
          console.warn('SECURITY: UTS cookie blocked:', value);
          return;
        }
        return originalCookieDescriptor.set?.call(this, value);
      }
    });
  }

  console.log('🔒 SECURITY: UTS tracking system neutralized');
};

const isUTSMessage = (message: string): boolean => {
  const utsPatterns = [
    /\[UTS\]/,
    /UTS.*fp/,
    /UTS.*gusid/,
    /UTS.*_fbp/,
    /UTS.*pc/,
    /HB-ET_/,
    /51355e5ea95dbd049a736d96abcbf090/,
    /_fbp_c/,
    /fb\.1\.\d+\.\d+/
  ];

  return utsPatterns.some(pattern => pattern.test(message));
};

const isUTSScript = (script: string): boolean => {
  const utsScriptPatterns = [
    /UTS/,
    /_fbp/,
    /fingerprint/,
    /gusid/,
    /HB-ET/,
    /facebook.*pixel/,
    /connect\.facebook\.net/
  ];

  return utsScriptPatterns.some(pattern => pattern.test(script));
};

const isUTSStorageKey = (key: string): boolean => {
  const utsKeyPatterns = [
    /^_fbp/,
    /^UTS/,
    /fingerprint/,
    /gusid/,
    /HB-ET/,
    /facebook.*pixel/
  ];

  return utsKeyPatterns.some(pattern => pattern.test(key));
};

const isUTSUrl = (url: string): boolean => {
  const utsUrlPatterns = [
    /UTS/,
    /_fbp/,
    /fingerprint/,
    /gusid/,
    /HB-ET/,
    /facebook\.com\/tr/,
    /connect\.facebook\.net/,
    /fbcdn\.net/,
    /fbevents/
  ];

  return utsUrlPatterns.some(pattern => pattern.test(url));
};

const isUTSCookie = (cookie: string): boolean => {
  const utsCookiePatterns = [
    /^_fbp=/,
    /^UTS=/,
    /fingerprint=/,
    /gusid=/,
    /HB-ET=/,
    /fb\.1\.\d+\.\d+/
  ];

  return utsCookiePatterns.some(pattern => pattern.test(cookie));
};